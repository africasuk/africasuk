export class MTNMomoService {
  public async getAccessToken(): Promise<string> {
    throw new Error("MTN MoMo is disabled.");
  }

  public async requestToPay(_params: {
    amount: string;
    currency: string;
    externalId: string;
    phoneNumber: string;
    payerMessage: string;
    payeeNote: string;
  }): Promise<string> {
    throw new Error("MTN MoMo is disabled.");
  }

  public async getRequestToPayStatus(
    _referenceId: string,
  ): Promise<{
    status: "PENDING" | "SUCCESSFUL" | "FAILED";
  }> {
    throw new Error("MTN MoMo is disabled.");
  }
}