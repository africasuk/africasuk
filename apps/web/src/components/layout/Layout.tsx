import Header from "./header/Header";
import Footer from "./footer/Footer";

interface Props {
  children: React.ReactNode;
}

export default function Layout({
  children,
}: Props) {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </>
  );
}