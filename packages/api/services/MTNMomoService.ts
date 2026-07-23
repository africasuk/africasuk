import axios, { type AxiosInstance } from "axios";
import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";

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
  const credentials = Buffer.from(
    `${process.env.MTN_CONSUMER_KEY}:${process.env.MTN_CONSUMER_SECRET}`,
  ).toString("base64");
  try {
    const { data } = await this.client.post<{ access_token: string }>(
      "/oauth/access_token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    console.log("TOKEN RESPONSE:", data);

    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("STATUS:", error.response?.status);
      console.log("HEADERS:", error.response?.headers);
      console.log("BODY:", error.response?.data);
    }

    throw error;
  }
}

  public async requestToPay(params: {
    amount: string;
    currency: string;
    externalId: string;
    phoneNumber: string;
    payerMessage: string;
    payeeNote: string;
  }): Promise<string> {
    const token = await this.getAccessToken();

    console.log("Access Token:", token);
    console.log("Payment Request:", params);

    return randomUUID();
  }

  public async getRequestToPayStatus(
    referenceId: string,
  ): Promise<{
    status: "PENDING" | "SUCCESSFUL" | "FAILED";
  }> {
    console.log("Reference ID:", referenceId);

    return {
      status: "PENDING",
    };
  }
}