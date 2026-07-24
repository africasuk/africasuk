import { PaymentRepository } from "@africasuk/database";
import { OrderCommandService } from "../../orders/OrderCommandService";



export class PaymentWebhookService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderCommandService: OrderCommandService,
  ) {}

  async handleSuccessfulPayment(
    referenceId: string,
    transactionId?: string,
  ): Promise<void> {
    const payment =
      await this.paymentRepository.findByReferenceId(
        referenceId,
      );

    if (!payment) {
      throw new Error(
        "Payment not found.",
      );
    }

    if (payment.status === "PAID") {
      return;
    }

    await this.paymentRepository.update(
      payment.id,
      {
        status: "PAID",
        transactionId,
      },
    );

    await this.orderCommandService.updateOrder(
      payment.orderId,
      {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
    );
  }

  async handleFailedPayment(
    referenceId: string,
    reason?: string,
  ): Promise<void> {
    const payment =
      await this.paymentRepository.findByReferenceId(
        referenceId,
      );

    if (!payment) {
      throw new Error(
        "Payment not found.",
      );
    }

    if (payment.status === "FAILED") {
      return;
    }

    await this.paymentRepository.update(
      payment.id,
      {
        status: "FAILED",
        failureReason: reason,
      },
    );

    await this.orderCommandService.updateOrder(
      payment.orderId,
      {
        paymentStatus: "FAILED",
      },
    );
  }
}