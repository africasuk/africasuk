import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreatePaymentDto,
  Payment,
  PaymentStatus,
  UpdatePaymentDto,
} from "@africasuk/types";

type PaymentRow = {
  id: string;

  order_id: string;

  provider: Payment["provider"];

  status: PaymentStatus;

  amount: number;

  currency: string;

  external_id: string;

  reference_id: string | null;

  transaction_id: string | null;

  phone_number: string | null;

  payer_message: string | null;

  payee_note: string | null;

  failure_reason: string | null;

  created_at: string;

  updated_at: string;
};

export class PaymentRepository {
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  private mapPayment(
    row: PaymentRow,
  ): Payment {
    return {
      id: row.id,
      orderId: row.order_id,
      provider: row.provider,
      status: row.status,
      amount: Number(row.amount),
      currency: row.currency,
      externalId: row.external_id,
      referenceId: row.reference_id ?? undefined,
      transactionId:
        row.transaction_id ?? undefined,
      phoneNumber:
        row.phone_number ?? undefined,
      payerMessage:
        row.payer_message ?? undefined,
      payeeNote:
        row.payee_note ?? undefined,
      failureReason:
        row.failure_reason ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(
    payment: CreatePaymentDto,
  ): Promise<Payment> {
    const { data, error } =
      await this.supabase
        .from("payments")
        .insert({
          order_id: payment.orderId,
          provider: payment.provider,
          status: "PENDING",
          amount: payment.amount,
          currency: payment.currency,
          external_id: payment.externalId,
          phone_number:
            payment.phoneNumber,
          payer_message:
            payment.payerMessage,
          payee_note:
            payment.payeeNote,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return this.mapPayment(
      data as PaymentRow,
    );
  }

  async findById(
    id: string,
  ): Promise<Payment | null> {
    const { data, error } =
      await this.supabase
        .from("payments")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? this.mapPayment(
          data as PaymentRow,
        )
      : null;
  }

  async findByReferenceId(
    referenceId: string,
  ): Promise<Payment | null> {
    const { data, error } =
      await this.supabase
        .from("payments")
        .select("*")
        .eq(
          "reference_id",
          referenceId,
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? this.mapPayment(
          data as PaymentRow,
        )
      : null;
  }

  async update(
    id: string,
    input: UpdatePaymentDto,
  ): Promise<Payment> {
    const updateData: Record<
      string,
      unknown
    > = {};

    if (input.status !== undefined) {
      updateData.status =
        input.status;
    }

    if (
      input.referenceId !== undefined
    ) {
      updateData.reference_id =
        input.referenceId;
    }

    if (
      input.transactionId !==
      undefined
    ) {
      updateData.transaction_id =
        input.transactionId;
    }

    if (
      input.failureReason !==
      undefined
    ) {
      updateData.failure_reason =
        input.failureReason;
    }

    updateData.updated_at =
      new Date().toISOString();

    const { data, error } =
      await this.supabase
        .from("payments")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return this.mapPayment(
      data as PaymentRow,
    );
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
  ): Promise<void> {
    const { error } =
      await this.supabase
        .from("payments")
        .update({
          status,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async delete(
    id: string,
  ): Promise<void> {
    const { error } =
      await this.supabase
        .from("payments")
        .delete()
        .eq("id", id);

    if (error) {
      throw error;
    }
  }
}