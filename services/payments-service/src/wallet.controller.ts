import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '@vayva/db';
// import { WalletStatus, TransactionType, TransactionStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import axios from 'axios';

/**
 * Wallet Read Model (Summary)
 */
export const getWalletSummaryHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    if (!storeId) return reply.status(400).send({ error: 'Store ID required' });

    let wallet = await prisma.wallet.findUnique({ where: { storeId } });

    // Auto-create wallet if missing (V1 convenience)
    if (!wallet) {
        wallet = await prisma.wallet.create({
            data: { storeId, kycStatus: 'NOT_STARTED' }
        });
    }

    return reply.send({
        merchantId: req.headers['x-user-id'], // From Gateway
        storeId: wallet.storeId,
        kycStatus: wallet.kycStatus,
        pinSet: wallet.pinSet,
        isLocked: wallet.isLocked,
        virtualAccount: {
            status: wallet.vaStatus,
            bankName: wallet.vaBankName,
            accountNumber: wallet.vaAccountNumber,
            accountName: wallet.vaAccountName,
            providerRef: wallet.vaProviderRef
        },
        balances: {
            availableKobo: wallet.availableKobo.toString(),
            pendingKobo: wallet.pendingKobo.toString()
        }
    });
};

/**
 * Ledger History
 */
export const getLedgerHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    if (!storeId) return reply.status(400).send({ error: 'Store ID required' });

    const ledger = await prisma.ledgerEntry.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return reply.send(ledger.map(entry => ({
        ...entry,
        amount: entry.amount.toString()
    })));
};

/**
 * PIN Management
 */
const setPinSchema = z.object({
    pin: z.string().regex(/^\d{4,6}$/)
});

export const setPinHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    const { pin } = setPinSchema.parse(req.body as any);

    const hashedPin = await bcrypt.hash(pin, 10);

    await prisma.wallet.update({
        where: { storeId },
        data: {
            pinHash: hashedPin,
            pinSet: true
        }
    });

    return reply.send({ status: 'success', message: 'PIN set successfully' });
};

const verifyPinSchema = z.object({
    pin: z.string()
});

export const verifyPinHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    const { pin } = verifyPinSchema.parse(req.body as any);

    const wallet = await prisma.wallet.findUnique({ where: { storeId } });
    if (!wallet || !wallet.pinHash) return reply.status(400).send({ error: 'PIN not set' });

    // Lock check
    if (wallet.isLocked && wallet.lockedUntil && wallet.lockedUntil > new Date()) {
        return reply.status(403).send({ error: 'Wallet locked', lockedUntil: wallet.lockedUntil });
    }

    const isValid = await bcrypt.compare(pin, wallet.pinHash);

    if (!isValid) {
        const attempts = wallet.failedPinAttempts + 1;
        const isLocked = attempts >= 5;
        try {
            await prisma.wallet.update({
                where: { storeId },
                data: {
                    failedPinAttempts: attempts,
                    isLocked: isLocked,
                    lockedUntil: isLocked ? new Date(Date.now() + 15 * 60000) : null
                }
            });
            return reply.send({ success: true, message: 'Wallet lock status updated' });
        } catch (error) {
            (req.log as any).error(error);
            return reply.status(500).send({ error: 'Failed to update wallet lock status' });
        }
        return reply.status(401).send({ error: 'Invalid PIN', attemptsRemaining: 5 - attempts });
    }

    // Success: Reset failures
    await prisma.wallet.update({
        where: { storeId },
        data: { failedPinAttempts: 0, isLocked: false, lockedUntil: null }
    });

    return reply.send({ status: 'success', unlockToken: 'v1_session_' + crypto.randomBytes(16).toString('hex') });
};


/**
 * Virtual Account (Paystack Dedicated Account)
 */
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock';
const IS_TEST_MODE = !process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_MOCK === 'true';

export const createVirtualAccountHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;

    const wallet = await prisma.wallet.findUnique({ where: { storeId } });
    if (!wallet) return reply.status(404).send({ error: 'Wallet not found' });
    if ((wallet.vaStatus as any) === 'CREATED') return reply.send({ status: 'CREATED', data: wallet });

    if (IS_TEST_MODE) {
        const mockVA = {
            vaStatus: 'CREATED' as any,
            vaBankName: 'Test Bank',
            vaAccountNumber: Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
            vaAccountName: 'VAYVA/' + storeId.slice(0, 8),
            vaProviderRef: 'mock_va_' + crypto.randomBytes(4).toString('hex')
        };

        const updated = await prisma.wallet.update({
            where: { storeId },
            data: mockVA
        });

        return reply.send(updated);
    }

    try {
        // 1. Create/Get Paystack Customer first
        // For V1, we assume the store email is the customer identifier
        const store = await prisma.store.findUnique({ where: { id: storeId } });

        // Use Dedicated Account API
        const response = await axios.post('https://api.paystack.co/dedicated_account', {
            customer: store?.slug + '@vayva.app', // Dynamic placeholder
            preferred_bank: "wema-bank"
        }, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY} ` }
        });

        const va = response.data.data;
        const updated = await prisma.wallet.update({
            where: { storeId },
            data: {
                vaStatus: 'CREATED' as any,
                vaBankName: va.bank.name,
                vaAccountNumber: va.account_number,
                vaAccountName: va.account_name,
                vaProviderRef: va.assignment.integration.toString()
            }
        });

        return reply.send(updated);
    } catch (error: any) {
        console.error('Paystack DVA Error:', error.response?.data || error.message);
        return reply.status(500).send({ error: 'Failed to create virtual account', details: error.response?.data });
    }
};

/**
 * Bank Beneficiaries
 */
export const listBanksHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    const banks = await prisma.bankBeneficiary.findMany({ where: { storeId } });
    return reply.send(banks);
};

const addBankSchema = z.object({
    bankCode: z.string(),
    bankName: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
    isDefault: z.boolean().optional()
});

export const addBankHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    const body = addBankSchema.parse(req.body as any);

    if (body.isDefault) {
        await prisma.bankBeneficiary.updateMany({
            where: { storeId },
            data: { isDefault: false }
        });
    }

    const bank = await prisma.bankBeneficiary.create({
        data: { ...body, storeId }
    });

    return reply.send(bank);
};

export const deleteBankHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await prisma.bankBeneficiary.delete({ where: { id } });
    return reply.send({ status: 'success' });
};

/**
 * Withdrawal Flow (Integration 3)
 */
const withdrawInitiateSchema = z.object({
    amountKobo: z.coerce.string(), // BigInt from string
    bankAccountId: z.string(),
    pin: z.string()
});

export const initiateWithdrawalHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    const body = withdrawInitiateSchema.parse(req.body as any);

    const wallet = await prisma.wallet.findUnique({ where: { storeId } });
    if (!wallet || !wallet.pinHash) return reply.status(400).send({ error: 'Wallet not ready or PIN not set' });

    // 1. PIN Verify
    const isValid = await bcrypt.compare(body.pin, wallet.pinHash);
    if (!isValid) return reply.status(401).send({ error: 'Invalid PIN' });

    // 2. Balance Check
    const amount = BigInt(body.amountKobo);
    if (wallet.availableKobo < amount) return reply.status(400).send({ error: 'Insufficient balance' });

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60000); // 10 mins

    const withdrawal = await prisma.withdrawal.create({
        data: {
            storeId,
            amountKobo: amount,
            bankAccountId: body.bankAccountId,
            status: 'PENDING_OTP',
            otpCode: otp,
            otpExpiresAt: expires,
            referenceCode: 'WD-' + crypto.randomBytes(6).toString('hex').toUpperCase()
        }
    });

    // 4. Notify (Placeholder call to Notifications Service)
    try {
        await axios.post('http://localhost:3008/v1/notifications', {
            channel: 'EMAIL',
            recipient: 'merchant@example.com', // In real, fetch from User
            template: 'WITHDRAWAL_OTP',
            data: { otp, amount: (Number(amount) / 100).toFixed(2) },
            storeId
        });
    } catch (e) {
        console.error('Failed to send OTP notification:', e);
    }

    return reply.send({ status: 'OTP_SENT', withdrawalId: withdrawal.id });
};

const withdrawConfirmSchema = z.object({
    withdrawalId: z.string(),
    otpCode: z.string()
});

export const confirmWithdrawalHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    const { withdrawalId, otpCode } = withdrawConfirmSchema.parse(req.body as any);

    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal) return reply.status(404).send({ error: 'Withdrawal not found' });
    if (withdrawal.status !== 'PENDING_OTP') return reply.status(400).send({ error: 'Invalid withdrawal state' });

    // 1. Verify OTP
    if (withdrawal.otpCode !== otpCode || (withdrawal.otpExpiresAt && withdrawal.otpExpiresAt < new Date())) {
        return reply.status(401).send({ error: 'Invalid or expired OTP' });
    }

    // --- KYC Enforcement Check ---
    const wallet = await prisma.wallet.findUnique({ where: { storeId } });
    if (wallet?.kycStatus !== 'VERIFIED') {
        return reply.status(403).send({ error: 'KYC_REQUIRED', message: 'KYC must be VERIFIED to withdraw' });
    }

    // 2. Trigger Paystack Transfer (or Mock)
    if (IS_TEST_MODE) {
        // Success Mock
        await prisma.$transaction([
            prisma.withdrawal.update({
                where: { id: withdrawalId },
                data: { status: 'SUCCESS', providerRef: 'mock_tx_' + crypto.randomBytes(4).toString('hex') }
            }),
            prisma.wallet.update({
                where: { storeId },
                data: { availableKobo: { decrement: withdrawal.amountKobo } }
            }),
            prisma.ledgerEntry.create({
                data: {
                    storeId,
                    referenceType: 'payout',
                    referenceId: 'WDR-' + Date.now(),
                    direction: 'DEBIT',
                    account: 'payouts',
                    amount: (Number(withdrawal.amountKobo) / 100) as any,
                    currency: 'NGN',
                    description: 'Withdrawal to Bank',
                    metadata: { status: 'SUCCESS' }
                }
            })
        ]);

        return reply.send({ status: 'SUCCESS', message: 'Withdrawal completed' });
    }

    // Live mode would call Paystack Transfer API...
    return reply.status(501).send({ error: 'Live transfers not yet enabled' });
};

/**
 * KYC Submission & Review
 */
const kycSubmitSchema = z.object({
    nin: z.string().min(10).max(11),
    bvn: z.string().length(11)
});

export const submitKycHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    const { nin, bvn } = kycSubmitSchema.parse(req.body as any);

    // 1. Masking
    const ninLast4 = nin.slice(-4);
    const bvnLast4 = bvn.slice(-4);

    // 2. State Transition
    // Note: Transactional update for both Record and Wallet status
    await prisma.$transaction([
        prisma.kycRecord.upsert({
            where: { storeId },
            create: {
                storeId,
                ninLast4,
                bvnLast4,
                fullNinEncrypted: `ENC:${nin} `, // Placeholder for encryption
                fullBvnEncrypted: `ENC:${bvn} `, // Placeholder for encryption
                status: 'PENDING',
                audit: [
                    { event: 'KYC_SUBMITTED', at: new Date().toISOString(), actorId: req.headers['x-user-id'] }
                ]
            },
            update: {
                ninLast4,
                bvnLast4,
                fullNinEncrypted: `ENC:${nin} `,
                fullBvnEncrypted: `ENC:${bvn} `,
                status: 'PENDING',
                audit: {
                    push: { event: 'KYC_RESUBMITTED', at: new Date().toISOString(), actorId: req.headers['x-user-id'] }
                }
            }
        }),
        prisma.wallet.update({
            where: { storeId },
            data: { kycStatus: 'PENDING' }
        })
    ]);

    return reply.send({ status: 'PENDING', message: 'KYC submitted for review' });
};

export const getKycStatusHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    const kyc = await prisma.kycRecord.findUnique({ where: { storeId } });

    if (!kyc) return reply.send({ status: 'NOT_STARTED' });

    return reply.send({
        status: kyc.status,
        submittedAt: kyc.submittedAt,
        ninLast4: kyc.ninLast4,
        bvnLast4: kyc.bvnLast4,
        rejectionReason: kyc.rejectionReason
    });
};

/**
 * Ops KYC Handlers
 */
export const listPendingKycHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const submissions = await prisma.kycRecord.findMany({
        where: { status: 'PENDING' },
        include: { store: true },
        orderBy: { submittedAt: 'asc' }
    });
    return reply.send(submissions);
};

export const reviewKycHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id: merchantId } = req.params as { id: string };
    const { action, reason, notes } = req.body as { action: 'APPROVE' | 'REJECT', reason?: string, notes?: string };
    const opsUserId = req.headers['x-ops-user-id'] as string;

    const store = await prisma.store.findFirst({
        where: { memberships: { some: { userId: merchantId, role: 'OWNER' } } }
    });

    if (!store) return reply.status(404).send({ error: 'Store not found for merchant' });

    const newStatus = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';

    await prisma.$transaction([
        prisma.kycRecord.update({
            where: { storeId: store.id },
            data: {
                status: newStatus,
                reviewedAt: new Date(),
                reviewedBy: opsUserId,
                rejectionReason: reason,
                notes,
                audit: {
                    push: {
                        event: action === 'APPROVE' ? 'KYC_APPROVED' : 'KYC_REJECTED',
                        at: new Date().toISOString(),
                        actorId: opsUserId,
                        reason
                    }
                }
            }
        }),
        prisma.wallet.update({
            where: { storeId: store.id },
            data: { kycStatus: newStatus }
        })
    ]);

    return reply.send({ status: newStatus });
};
