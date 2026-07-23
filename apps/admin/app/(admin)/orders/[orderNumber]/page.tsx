import { notFound } from "next/navigation";




import { OrderDetails } from "@/components/orders/OrderDetails";
import PageHeader from "@/components/shared/PageHeader";
import { getOrder } from "@/app/actions/orders";


interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderPage({
  params,
}: Props) {
  const { orderNumber } =
    await params;

  const result =
    await getOrder(orderNumber);

  if (!result) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={`Order ${result.order.orderNumber}`}
        description="Manage customer order."
      />

      <OrderDetails
        order={result.order}
        items={result.items}
      />
    </>
  );
}