


import PageHeader from "@/components/shared/PageHeader";







interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({

}: PageProps) {


  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Edit Product"
        description="Update product information."
      />

    </div>
  );
}