import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";

import CartHeader from "@/components/cart/CartHeader";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  return (
    <Layout>
      <Container>
        <section className="py-10">
          <CartHeader />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <CartList />

            <CartSummary />
          </div>
        </section>
      </Container>
    </Layout>
  );
}