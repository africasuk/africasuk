import type {
  Order,
  PlaceOrderRequest,
} from "@africasuk/types";

import {
  OrderItemRepository,
  OrderRepository,
  ProductRepository,
  ProductVariantRepository,
} from "@africasuk/database";
import type { OrderItem } from "@africasuk/types";
export class OrderCommandService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly productRepository: ProductRepository,
    private readonly variantRepository: ProductVariantRepository,
  ) {}

  async placeOrder(
    request: PlaceOrderRequest,
  ): Promise<Order> {
    if (request.items.length === 0) {
      throw new Error(
        "Your cart is empty."
      );
    }

    if (!request.customer.name.trim()) {
      throw new Error(
        "Customer name is required."
      );
    }

    if (!request.customer.email.trim()) {
      throw new Error(
        "Customer email is required."
      );
    }

    if (!request.customer.country.trim()) {
      throw new Error(
        "Country is required."
      );
    }

    if (!request.customer.city.trim()) {
      throw new Error(
        "City is required."
      );
    }

    if (!request.customer.address.trim()) {
      throw new Error(
        "Address is required."
      );
    }

    // Restore your original placeOrder implementation here.
    const orderItems: Omit<
  OrderItem,
  "id" | "createdAt"
>[] = [];

let subtotal = 0;

for (const item of request.items) {
  const product =
    await this.productRepository.getById(
      item.productId,
    );

  if (!product) {
    throw new Error("Product not found.");
  }

  const variant =
    await this.variantRepository.getById(
      item.variantId,
    );

  if (!variant) {
    throw new Error("Variant not found.");
  }

  if (variant.stock < item.quantity) {
    throw new Error(
      `${product.name} is out of stock.`,
    );
  }

  subtotal +=
    variant.price * item.quantity;

    orderItems.push({
      orderId: "",
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image:
        variant.productColor?.images[0]
          ?.imageUrl ?? null,
      price: variant.price,
      quantity: item.quantity,
    });
    }

    throw new Error("Next");
    }

    async updateEstimatedDelivery(
    orderId: string,
    estimatedDeliveryStart: string | null,
    estimatedDeliveryEnd: string | null,
  ): Promise<void> {
    await this.orderRepository.update(
      orderId,
      {
        estimatedDeliveryStart,
        estimatedDeliveryEnd,
      },
    );
  }

  async updateOrder(
    orderId: string,
    input: {
      status?: Order["status"];
      paymentStatus?: Order["paymentStatus"];
      estimatedDeliveryStart?: string | null;
      estimatedDeliveryEnd?: string | null;
      trackingNumber?: string | null;
      adminNotes?: string | null;
    },
  ): Promise<void> {
    await this.orderRepository.update(
      orderId,
      input,
    );
  }
}