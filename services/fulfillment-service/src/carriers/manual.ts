import { ICarrierProvider, CreateJobParams, JobResult } from "./types";

export class ManualProvider implements ICarrierProvider {
  async createJob(params: CreateJobParams): Promise<JobResult> {
    // For Manual dispatch, we just confirm creation.
    // The ID is internal or generated here.
    return {
      providerJobId: `manual_${Date.now()}`,
      status: "CREATED",
      trackingUrl: undefined, // Merchant can update manually
    };
  }

  async cancelJob(providerJobId: string): Promise<boolean> {
    return true;
  }
}
