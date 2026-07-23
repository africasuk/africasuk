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

import { generateOrderNumber } from "./generateOrderNumber";

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
      throw new Error("Your cart is empty.");
    }

    if (!request.customer.name.trim()) {
      throw new Error("Customer name is required.");
    }

    if (!request.customer.email.trim()) {
      throw new Error("Customer email is required.");
    }

    if (!request.customer.country.trim()) {
      throw new Error("Country is required.");
    }

    if (!request.customer.city.trim()) {
      throw new Error("City is required.");
    }

    if (!request.customer.address.trim()) {
      throw new Error("Address is required.");
    }

const orderNumber = generateOrderNumber();

let subtotal = 0;

const shipping = 0;
const tax = 0;
const discount = 0;

const orderItems: {
  productId: string;
  variantId: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
}[] = [];

const productCache = new Map<string, Awaited<ReturnType<ProductRepository["getById"]>>>();

// Validate products and calculate totals
for (const item of request.items) {
  const variant =
    await this.variantRepository.getById(
      item.variantId,
    );

  if (variant === null) {
    throw new Error(
      "Product variant not found.",
    );
  }

  if (!variant.isActive) {
    throw new Error(
      "Product variant is unavailable.",
    );
  }

  if (variant.stock < item.quantity) {
    throw new Error(
      `Only ${variant.stock} item(s) available.`,
    );
  }

  let product =
    productCache.get(item.productId);

  if (!product) {
    product =
      await this.productRepository.getById(
        item.productId,
      );

    if (product === null) {
      throw new Error(
        "Product not found.",
      );
    }

    if (!product.isActive) {
      throw new Error(
        "Product is unavailable.",
      );
    }

    productCache.set(
      item.productId,
      product,
    );
  }

  subtotal +=
    variant.price *
    item.quantity;

  orderItems.push({
    productId: product.id,
    variantId: variant.id,
    name: product.name,
    image:
      variant.productColor?.images?.[0]
        ?.imageUrl ?? null,
    price: variant.price,
    quantity: item.quantity,
  });
}

const total =
  subtotal +
  shipping +
  tax -
  discount;

// Default delivery estimate (7–14 days)
const now = new Date();

const estimatedDeliveryStart =
  new Date(now);

estimatedDeliveryStart.setDate(
  estimatedDeliveryStart.getDate() +
    7,
);

const estimatedDeliveryEnd =
  new Date(now);

estimatedDeliveryEnd.setDate(
  estimatedDeliveryEnd.getDate() +
    14,
);
    const order =
      await this.orderRepository.create({
        userId:
          request.userId ?? null,

        orderNumber,

        status: "PENDING",

        paymentStatus:
          "PENDING",

        paymentMethod:
          request.paymentMethod,

        subtotal,
        shipping,
        tax,
        discount,
        total,

        currency:
          request.currency,

        customerName:
          request.customer.name,

        customerEmail:
          request.customer.email,

        customerPhone:
          request.customer.phone ??
          null,

        country:
          request.customer.country,

        state:
          request.customer.state ??
          null,

        city:
          request.customer.city,

        address:
          request.customer.address,

        postalCode:
          request.customer
            .postalCode ?? null,

        notes:
          request.customer.notes ??
          null,

        estimatedDeliveryStart:
          estimatedDeliveryStart
            .toISOString()
            .split("T")[0],

        estimatedDeliveryEnd:
          estimatedDeliveryEnd
            .toISOString()
            .split("T")[0],

        estimatedDeliveryUpdatedAt:
          new Date().toISOString(),

        trackingNumber: null,
        adminNotes: null,
      });

    await this.orderItemRepository.createMany(
      orderItems.map((item) => ({
        orderId: order.id,

        productId:
          item.productId,

        variantId:
          item.variantId,

        name: item.name,
        image: item.image,

        price: item.price,
        quantity: item.quantity,
      })),
    );

    // Reduce inventory
    for (const item of orderItems) {
      await this.variantRepository.decreaseStock(
        item.variantId,
        item.quantity,
      );
    }

    return order;
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