import type { CreateProductDto } from "@africasuk/types";

import {
  ProductRepository,
  ProductColorRepository,
  ProductImageRepository,
  ProductVariantRepository,
} from "@africasuk/database";

export class ProductCommandService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productColorRepository: ProductColorRepository,
    private readonly productImageRepository: ProductImageRepository,
    private readonly productVariantRepository: ProductVariantRepository
  ) {}

async create(data: CreateProductDto) {
  const product =
    await this.productRepository.create({
      categoryId: data.categoryId,
      brandId: data.brandId,
      name: data.name,
      description: data.description,
      isActive: data.isActive,
    });

  for (const color of data.colors) {
    const createdColor =
      await this.productColorRepository.create({
        productId: product.id,
        name: color.name,
        hexCode: color.hexCode,
      });

    for (
      let index = 0;
      index < color.images.length;
      index++
    ) {
      await this.productImageRepository.create({
        productColorId: createdColor.id,
        imageUrl: color.images[index],
        sortOrder: index,
      });
    }
      for (const variant of color.variants) {
        await this.productVariantRepository.create({
          productColorId: createdColor.id,
          optionName: color.optionName,
          optionValue: variant.optionValue,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
          isActive: true,
        });
      }
  }

  return product;
}

async delete(id: string) {
  await this.productRepository.delete(id);
}

async update(id: string, dto: CreateProductDto) {

  await this.productRepository.update(id, {
    categoryId: dto.categoryId,
    brandId: dto.brandId,
    name: dto.name,
    description: dto.description,
    isActive: dto.isActive,
  });


  await this.productColorRepository.deleteByProductId(id);


  for (const color of dto.colors) {

    const createdColor =
      await this.productColorRepository.create({
        productId: id,
        name: color.name,
        hexCode: color.hexCode ?? null,
      });


    for (let i = 0; i < color.images.length; i++) {


      await this.productImageRepository.create({
        productColorId: createdColor.id,
        imageUrl: color.images[i],
        sortOrder: i,
      });
    }


    for (const variant of color.variants) {

      await this.productVariantRepository.create({
        productColorId: createdColor.id,
        optionName: color.optionName ?? "",
        optionValue: variant.optionValue,
        price: variant.price,
        stock: variant.stock,
        sku: variant.sku ?? null,
        isActive: true,
      });

    }
  }
}
  

async updatePaymentSettings(
  id: string,
  data: {
    allowCod: boolean;
    allowOnlinePayment: boolean;
  }
) {
  await this.productRepository.updatePaymentSettings(
    id,
    data
  );
}
}

