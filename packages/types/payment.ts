import type { PaymentStatus } from "./order";

export type PaymentProvider =
  | "MTN_MOMO"
  | "CASH_ON_DELIVERY";

export interface Payment {
  id: string;

  orderId: string;

  provider: PaymentProvider;

  status: PaymentStatus;

  amount: number;

  currency: string;

  externalId: string;

  referenceId?: string;

  transactionId?: string;

  phoneNumber?: string;

  payerMessage?: string;

  payeeNote?: string;

  failureReason?: string;

  createdAt: string;

  updatedAt: string;
}

export interface CreatePaymentDto {
  orderId: string;

  provider: PaymentProvider;

  amount: number;

  currency: string;

  externalId: string;

  phoneNumber?: string;

  payerMessage?: string;

  payeeNote?: string;
}
export interface UpdatePaymentDto {
  status?: PaymentStatus;

  referenceId?: string;

  transactionId?: string;

  failureReason?: string;
}