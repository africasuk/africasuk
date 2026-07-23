import type {
  CreatePaymentDto,
  Payment,
  PlaceOrderRequest,
} from "@africasuk/types";

import {
  PaymentRepository,
} from "@africasuk/database";

import { OrderCommandService } from "../orders";
import { MTNMomoService } from "./MTNMomoService";

export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderCommandService: OrderCommandService,
    private readonly mtnMomoService: MTNMomoService,
  ) {}

  async checkout(
    request: PlaceOrderRequest,
  ) {
    // 1. Create order
    const order =
      await this.orderCommandService.placeOrder(
        request,
      );

    // 2. Create payment
    const payment =
      await this.paymentRepository.create({
        orderId: order.id,

        provider:
        request.paymentMethod ===
        "ONLINE"
          ? "MTN_MOMO"
          : "CASH_ON_DELIVERY",

        amount: order.total,

        currency: order.currency,

        externalId: order.orderNumber,

        phoneNumber:
          request.customer.phone,

        payerMessage:
          `Payment for Order ${order.orderNumber}`,

        payeeNote:
          "AfricaSuk Order",
      });
    // 3. MTN payment
    if (
      payment.provider === "MTN_MOMO"
    ) {
     const referenceId =
  await this.mtnMomoService.requestToPay({
    amount: payment.amount.toString(),
    currency: payment.currency,
    externalId: payment.externalId,
    phoneNumber: payment.phoneNumber!,
    payerMessage: payment.payerMessage ?? "",
    payeeNote: payment.payeeNote ?? "",
  });

      await this.paymentRepository.update(
        payment.id,
        {
          referenceId,
        },
      );

      payment.referenceId =
        referenceId;
    }

    return {
      order,
      payment,
    };
  }

  async getPaymentStatus(
  referenceId: string,
): Promise<Payment> {
  const payment =
    await this.paymentRepository.findByReferenceId(
      referenceId,
    );

  if (!payment) {
    throw new Error(
      "Payment not found.",
    );
  }

  if (
    payment.provider !==
      "MTN_MOMO" ||
    !payment.referenceId
  ) {
    return payment;
  }

  const status =
  await this.mtnMomoService.getRequestToPayStatus(
    payment.referenceId,
  );

  if (
    status.status ===
      "SUCCESSFUL" &&
    payment.status !== "PAID"
  ) {
    return await this.paymentRepository.update(
      payment.id,
      {
        status: "PAID",
      },
    );
  }

  if (
    status.status ===
      "FAILED" &&
    payment.status !== "FAILED"
  ) {
    return await this.paymentRepository.update(
      payment.id,
      {
        status: "FAILED",
      },
    );
  }

  return payment;
}
}