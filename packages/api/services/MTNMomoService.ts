import axios, { type AxiosInstance } from "axios";

export class MTNMomoService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.MTN_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getAccessToken(): Promise<string> {
    throw new Error("MTNMomoService is disabled.");
  }

  public async requestToPay(_params: {
    amount: string;
    currency: string;
    externalId: string;
    phoneNumber: string;
    payerMessage: string;
    payeeNote: string;
  }): Promise<string> {
    throw new Error("MTNMomoService is disabled.");
  }

  public async getRequestToPayStatus(
    _referenceId: string,
  ): Promise<{
    status: "PENDING" | "SUCCESSFUL" | "FAILED";
  }> {
    throw new Error("MTNMomoService is disabled.");
  }
}