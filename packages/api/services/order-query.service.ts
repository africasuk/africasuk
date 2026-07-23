import type {
  Order,
  OrderItem,
  Product,
  ProductVariant,
} from "@africasuk/types";

import {
  BrandRepository,
  CategoryRepository,
  OrderItemRepository,
  OrderRepository,
  ProductRepository,
  ProductVariantRepository,
} from "@africasuk/database";

export interface OrderItemDetails {
  item: OrderItem;
  product: Product | null;
  variant: ProductVariant | null;
}

export interface OrderDetails {
  order: Order;
  items: OrderItemDetails[];
}

export class OrderQueryService {
constructor(
  private readonly orderRepository: OrderRepository,
  private readonly orderItemRepository: OrderItemRepository,
  private readonly productRepository: ProductRepository,
  private readonly productVariantRepository: ProductVariantRepository,
  private readonly brandRepository: BrandRepository,
  private readonly categoryRepository: CategoryRepository,
) {}

  async getOrders(
    userId: string,
  ): Promise<Order[]> {
    return this.orderRepository.findByUser(
      userId,
    );
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async getOrder(
    orderNumber: string,
  ): Promise<OrderDetails | null> {
    const order =
      await this.orderRepository.findByOrderNumber(
        orderNumber,
      );

    if (!order) {
      return null;
    }

    const orderItems =
      await this.orderItemRepository.findByOrder(
        order.id,
      );

    const items: OrderItemDetails[] =
      await Promise.all(
        orderItems.map(async (item) => {
          const product =
              await this.productRepository.getById(
                item.productId,
              );
            const variant =
              await this.productVariantRepository.getById(
                item.variantId,
              );

            let brand = null;
            let category = null;

            if (product) {
              [brand, category] =
                await Promise.all([
                  this.brandRepository.getById(
                    product.brandId,
                  ),
                  this.categoryRepository.getById(
                    product.categoryId,
                  ),
                ]);

              Object.assign(product, {
                brand,
                category,
              });
            }

          return {
            item,
            product,
            variant,
          };
        }),
      );

    return {
      order,
      items,
    };
  }
}