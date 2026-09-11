"use client";

import { FormEvent, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import Container from "../Container";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) return;

    // Replace with your newsletter API when available.
    setIsSubmitted(true);
    setEmail("");
  }

  return (
    <section className="border-b border-gray-100 bg-gray-50/50 py-8 text-gray-900 antialiased select-none sm:py-12 md:py-14">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center px-2 text-center">
          <h2 className="text-xl font-black leading-tight tracking-tight text-[#002b15] sm:text-2xl md:text-3xl">
            Stay Updated
          </h2>

          <p className="mt-1.5 max-w-md text-[11px] font-medium leading-relaxed text-gray-600 sm:text-xs md:text-sm">
            Subscribe for new products, special offers, and updates from
            Africa Suk.
          </p>

          {/* Newsletter Form */}
          <div className="relative mt-4 min-h-10 w-full sm:mt-6 sm:min-h-11">
            {!isSubmitted ? (
              <form
                onSubmit={handleSubscribe}
                className="flex h-10 w-full items-center overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-300 focus-within:border-[#005c2e] focus-within:ring-1 focus-within:ring-[#005c2e] sm:h-11"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  aria-label="Email address"
                  className="h-full w-full bg-transparent px-3 text-[11px] font-medium text-gray-800 placeholder-gray-400 outline-hidden sm:px-4 sm:text-xs md:text-sm"
                />

                <button
                  type="submit"
                  aria-label="Subscribe to Africa Suk updates"
                  className="flex h-full shrink-0 cursor-pointer items-center gap-1.5 bg-linear-to-r from-[#002b15] to-[#005c2e] px-4 text-[10px] font-black uppercase tracking-wider text-white transition-all duration-200 hover:opacity-95 active:scale-[0.98] sm:px-6 sm:text-xs"
                >
                  <span className="hidden sm:inline">Subscribe</span>

                  <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex animate-in items-center justify-center gap-1.5 py-2 text-[#005c2e] fade-in zoom-in-95 duration-300 sm:gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#005c2e]" />

                <span className="text-[11px] font-bold tracking-wider sm:text-xs md:text-sm">
                  Thank you for subscribing!
                </span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}