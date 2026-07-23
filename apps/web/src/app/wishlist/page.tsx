import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";

import WishlistHeader from "@/components/wishlist/WishlistHeader";
import WishlistList from "@/components/wishlist/WishlistList";

export default function WishlistPage() {
  return (
    <Layout>
      <Container>
        <section className="py-10">
          <WishlistHeader />

          <div className="mt-8">
            <WishlistList />
          </div>
        </section>
      </Container>
    </Layout>
  );
}