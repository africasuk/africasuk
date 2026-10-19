
import Header from "./header/Header";
import Footer from "./footer/Footer";
import MobileBottomNav from "./MobileBottomNav";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />

      <main className="min-h-screen pb-24 lg:pb-0">
        {children}
      </main>

      <Footer />

      <MobileBottomNav />
    </>
  );
}
