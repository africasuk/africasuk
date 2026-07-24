import PageHeader from "@/components/shared/PageHeader";


export default function NewProductPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <PageHeader
        title="Create Product"
        description="Add a new product."
      />
    </div>
  );
}