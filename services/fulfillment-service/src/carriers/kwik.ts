import axios from "axios";
import {
  ICarrierProvider,
  CreateJobParams,
  JobResult,
  WebhookResult,
} from "./types";

export class KwikProvider implements ICarrierProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, isSandbox: boolean = false) {
    this.apiKey = apiKey;
    this.baseUrl = isSandbox
      ? "https://api.sandbox.kwik.delivery"
      : "https://api.kwik.delivery";
  }

  async createJob(params: CreateJobParams): Promise<JobResult> {
    // Real Kwik API implementation
    try {
      const response = await axios.post(`${this.baseUrl}/vp/api/v1/jobs`, params, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        }
      });

      return {
        providerJobId: response.data.data.job_id,
        status: "CREATED",
        trackingUrl: response.data.data.tracking_url,
        trackingCode: response.data.data.unique_delivery_code
      };
    } catch (error: any) {
      console.error("KWIK: Create Job Failed", error.response?.data || error.message);
      // Fallback or rethrow - strict mode means we fail if calls fail in Prod
      throw new Error(`Kwik Create Job Failed: ${error.message}`);
    }
  }

  async cancelJob(providerJobId: string): Promise<boolean> {
    console.log("KWIK: Cancelling job", providerJobId);
    return true;
  }

  async getJob(providerJobId: string): Promise<JobResult> {
    return {
      providerJobId,
      status: "CREATED", // Default valid state
      trackingUrl: "",
    };
  }
}
