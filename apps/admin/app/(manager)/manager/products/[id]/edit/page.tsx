// import { notFound } from "next/navigation";

// import { ProductRepository } from "@africasuk/database";
// import { ProductService } from "@africasuk/api";

// import { createServerSupabaseClient } from "@/lib/supabase/server";

// import PageHeader from "@/components/shared/PageHeader";
// import EditProductForm from "@/components/products/EditProductForm";


// async function getProduct(id: string) {
//   const supabase =
//     await createServerSupabaseClient();

//   const repository =
//     new ProductRepository(supabase);

//   const service =
//     new ProductService(repository);

//   try {
//     return await service.getById(id);
//   } catch {
//     return null;
//   }
// }

// async function getBrands() {
//   const supabase =
//     await createServerSupabaseClient();

//   const { BrandRepository } =
//     await import("@africasuk/database");

//   const repository =
//     new BrandRepository(supabase);

//   const { BrandService } =
//     await import("@africasuk/api");

//   const service =
//     new BrandService(repository);

//   return service.getAll();
// }

// async function getCategories() {
//   const supabase =
//     await createServerSupabaseClient();

//   const { CategoryRepository } =
//     await import("@africasuk/database");

//   const repository =
//     new CategoryRepository(supabase);

//   const { CategoryService } =
//     await import("@africasuk/api");

//   const service =
//     new CategoryService(repository);

//   return service.getAll();
// }

// interface PageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default async function Page({
//   params,
// }: PageProps) {
//   const { id } = await params;

//   const [
//     product,
//     brands,
//     categories,
//   ] = await Promise.all([
//     getProduct(id),
//     getBrands(),
//     getCategories(),
//   ]);

//   if (!product) {
//     notFound();
//   }

//   return (
//     <div className="mx-auto max-w-5xl space-y-8">
//       <PageHeader
//         title="Edit Product"
//         description="Update product information."
//       />

//       <EditProductForm
//         product={product}
//         brands={brands}
//         categories={categories}
//         redirectTo="/manager/products"
//       />
//     </div>
//   );
// }