export interface CreateJobParams {
  pickup: {
    name: string;
    phone: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  dropoff: {
    name: string;
    phone: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  items: Array<{ description: string; quantity: number }>;
  notes?: string;
  vehicleType?: string; // bike, car, van
}

export interface JobResult {
  providerJobId: string;
  trackingUrl?: string;
  trackingCode?: string;
  status:
    | "CREATED"
    | "ACCEPTED"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "FAILED"
    | "CANCELLED";
  estimatedPrice?: number;
  currency?: string;
}

export interface WebhookResult {
  isValid: boolean;
  event?: {
    providerEventId: string;
    type: string; // STATUS_UPDATE
    data: any;
  };
  error?: string;
}

export interface ICarrierProvider {
  createJob(params: CreateJobParams): Promise<JobResult>;
  cancelJob(providerJobId: string): Promise<boolean>;
  // Optional
  getJob?(providerJobId: string): Promise<JobResult>;
  verifyWebhookSignature?(
    payload: any,
    signature: string,
  ): Promise<WebhookResult>;
}
