
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@vayva/db';
import { KwikProvider } from '../carriers/kwik';
import { ManualProvider } from '../carriers/manual';
import { CreateJobParams } from '../carriers/types';

const getProvider = (type: string, apiKey: string = '') => {
    switch (type) {
        case 'KWIK': return new KwikProvider(apiKey);
        case 'MANUAL': return new ManualProvider();
        default: throw new Error('Unknown Provider');
    }
};

export const FulfillmentController = {
    // 1. Delivery Profiles & Zones
    createProfile: async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
        const { storeId, name, isDefault } = req.body as any;
        // Logic to unset other defaults if this is set to default
        if (isDefault) {
            await prisma.deliveryProfile.updateMany({
                where: { storeId, isDefault: true },
                data: { isDefault: false }
            });
        }
        const profile = await prisma.deliveryProfile.create({
            data: { storeId, name, isDefault }
        });
        return profile;
    },

    createZone: async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
        const { storeId, profileId, name, states, cities, feeType, feeAmount, freeOverAmount } = req.body as any;
        const zone = await prisma.deliveryZone.create({
            data: {
                storeId, profileId, name, states, cities, feeType, feeAmount, freeOverAmount
            }
        });
        return zone;
    },

    getProfiles: async (req: FastifyRequest<{ Querystring: { storeId: string } }>, reply: FastifyReply) => {
        const { storeId } = req.query as any;
        return prisma.deliveryProfile.findMany({
            where: { storeId },
            include: { zones: true, options: true }
        });
    },

    // 2. Dispatch / Fulfillment
    createShipment: async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
        const { storeId, orderId, deliveryOptionType, address, deliveryFee } = req.body as any;

        // 1. Create Shipment Record
        const shipment = await prisma.shipment.create({
            data: {
                storeId, orderId, deliveryOptionType,
                recipientName: address.name,
                recipientPhone: address.phone,
                addressState: address.state,
                addressCity: address.city,
                addressLine1: address.line1,
                deliveryFee: deliveryFee || 0,
                status: 'PENDING'
            }
        });

        // 2. Update Order Status
        await prisma.order.update({
            where: { id: orderId },
            data: { fulfillmentStatus: 'PROCESSING' }
        });

        return shipment;
    },

    dispatchShipment: async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
        const { storeId, shipmentId, carrier, carrierParams } = req.body as any;

        const shipment = await prisma.shipment.findUniqueOrThrow({ where: { id: shipmentId } });

        // 1. Get Provider
        let providerInstance;
        if (carrier === 'KWIK') {
            // Fetch credentials
            // const creds = await prisma.carrierAccount.findUnique(...)
            providerInstance = getProvider('KWIK', 'mock_key');
        } else {
            providerInstance = getProvider('MANUAL');
        }

        // 2. Call Create Job
        const jobParams: CreateJobParams = {
            pickup: carrierParams.pickup,
            dropoff: {
                name: shipment.recipientName!,
                phone: shipment.recipientPhone!,
                address: `${shipment.addressLine1}, ${shipment.addressCity}, ${shipment.addressState}`,
            },
            items: carrierParams.items,
            notes: carrierParams.notes
        };

        const result = await providerInstance.createJob(jobParams);

        // 3. Create DispatchJob
        const dispatchJob = await prisma.dispatchJob.create({
            data: {
                storeId, shipmentId, carrier,
                providerJobId: result.providerJobId,
                status: result.status,
                assignedRiderName: carrierParams.riderName, // For manual
                assignedRiderPhone: carrierParams.riderPhone
            }
        });

        // 4. Update Shipment
        await prisma.shipment.update({
            where: { id: shipmentId },
            data: {
                status: 'DISPATCHED',
                trackingUrl: result.trackingUrl,
                trackingCode: result.trackingCode
            }
        });

        return dispatchJob;
    }
};
