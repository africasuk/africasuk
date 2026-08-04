import { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About Us | AfricaSuk",
  description:
    "Bringing the world to South Sudan. Learn about AfricaSuk's mission to make international shopping and product sourcing simple, reliable, and convenient.",
};

export default function Page() {
  return <AboutPage />;
}