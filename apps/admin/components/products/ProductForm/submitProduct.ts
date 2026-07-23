import type { ProductWithDetails } from "@africasuk/types";
import type { Color, ProductInfo } from "./types";

interface SubmitProductParams {
  product?: ProductWithDetails;
  info: ProductInfo;
  colors: Color[];
}

export async function submitProduct({
  product,
  info,
  colors,
}: SubmitProductParams) {

  const formData = new FormData();


  formData.append(
    "name",
    info.name
  );

  formData.append(
    "description",
    info.description
  );

  formData.append(
    "categoryId",
    info.categoryId
  );

  formData.append(
    "brandId",
    info.brandId
  );


  formData.append(
    "isActive",
    info.isActive ? "on" : "off"
  );


  const payload = colors.map(
    (color, colorIndex) => {

      const images: string[] = [];


      color.images.forEach(
        (image, imageIndex) => {


          // Existing Cloudinary image
          if (
            image.url &&
            !image.file
          ) {
            images.push(
              image.url
            );

            return;
          }



          // New image file
          if (image.file) {

            const key =
              `color-${colorIndex}-${imageIndex}`;


            formData.append(
              key,
              image.file
            );


            images.push(
              key
            );
          }

        }
      );


      return {

        name:
          color.name,


        optionName:
          color.optionName,


        images,


        variants:
          color.variants.map(
            (variant) => ({
              optionValue:
                variant.optionValue,

              price:
                variant.price,

              stock:
                variant.stock,

              sku:
                variant.sku || null,
            })
          ),
      };

    }
  );


  formData.append(
    "colors",
    JSON.stringify(payload)
  );



  const url =
    product?.id
      ? `/api/products/${product.id}`
      : "/api/products";


  const response =
    await fetch(url, {
      method:
        product?.id
          ? "PUT"
          : "POST",

      body: formData,
    });



  if (!response.ok) {

    let message =
      "Failed to save product.";


    try {

      const error =
        await response.json();


      if (error?.message) {
        message =
          error.message;
      }

    } catch {}

    throw new Error(message);
  }



  return response.json();
}