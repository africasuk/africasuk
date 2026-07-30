import type {
  Payment,
  PlaceOrderRequest,
} from "@africasuk/types";

import {
  PaymentRepository,
} from "@africasuk/database";

import { OrderCommandService } from "../orders";

export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderCommandService: OrderCommandService,
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
          request.paymentMethod === "ONLINE"
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

    // MTN MoMo is currently disabled
    if (payment.provider === "MTN_MOMO") {
      throw new Error(
        "MTN MoMo payments are not configured."
      );
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
      payment.provider !== "MTN_MOMO" ||
      !payment.referenceId
    ) {
      return payment;
    }

    throw new Error(
      "MTN MoMo payments are not configured."
    );
  }
}