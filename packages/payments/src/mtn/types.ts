export interface CreateApiUserRequest {
  providerCallbackHost: string;
}

export interface CreateApiKeyResponse {
  apiKey: string;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RequestToPay {
  amount: string;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: "MSISDN";
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
}

export interface RequestToPayStatus {
  amount: string;
  currency: string;
  financialTransactionId?: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  reason?: string;
}