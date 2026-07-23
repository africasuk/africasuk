import type { Color, ProductInfo } from "./types";

interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateProduct(
  info: ProductInfo,
  colors: Color[]
): ValidationResult {
  if (!info.name.trim()) {
    return {
      valid: false,
      message: "Product name is required.",
    };
  }

  if (!info.categoryId) {
    return {
      valid: false,
      message: "Please select a category.",
    };
  }

  if (!info.brandId) {
    return {
      valid: false,
      message: "Please select a brand.",
    };
  }

  if (colors.length === 0) {
    return {
      valid: false,
      message: "Add at least one color.",
    };
  }

  for (const color of colors) {
    if (!color.name.trim()) {
      return {
        valid: false,
        message: "Every color must have a name.",
      };
    }

    if (!color.optionName.trim()) {
      return {
        valid: false,
        message: `Color "${color.name}" needs an option type.`,
      };
    }

    if (color.variants.length === 0) {
      return {
        valid: false,
        message: `Color "${color.name}" must have at least one variant.`,
      };
    }

    for (const variant of color.variants) {
      if (!variant.optionValue.trim()) {
        return {
          valid: false,
          message: `Variant value is required for ${color.name}.`,
        };
      }

      if (variant.price < 0) {
        return {
          valid: false,
          message: "Price cannot be negative.",
        };
      }

      if (variant.stock < 0) {
        return {
          valid: false,
          message: "Stock cannot be negative.",
        };
      }
    }
  }

  return {
    valid: true,
  };
}