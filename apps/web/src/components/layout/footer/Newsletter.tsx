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

    // Simulate API submission sequence
    setIsSubmitted(true);
    setEmail("");
  }

  return (
    <section className="border-b border-gray-100 bg-gray-50/50 py-8 sm:py-12 md:py-14 text-gray-900 select-none antialiased">
      <Container>
        <div className="mx-auto max-w-xl text-center flex flex-col items-center px-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[#002b15] leading-tight">
            Stay Updated
          </h2>

          <p className="mt-1.5 max-w-md text-[11px] sm:text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
            Subscribe to receive offers, premium brand new arrivals, and exclusive collection updates directly.
          </p>

          {/* Interactive Form Capture Flow */}
          <div className="mt-4 sm:mt-6 w-full relative min-h-10 sm:min-h-11">
            {!isSubmitted ? (
              <form 
                onSubmit={handleSubscribe}
                className="flex w-full h-10 sm:h-11 items-center bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden focus-within:border-[#005c2e] focus-within:ring-1 focus-within:ring-[#005c2e] transition-all duration-300"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full h-full px-3 sm:px-4 text-[11px] sm:text-xs md:text-sm font-medium bg-transparent text-gray-800 placeholder-gray-400 focus:outline-hidden"
                />
                
                <button
                  type="submit"
                  className="h-full px-4 sm:px-6 bg-linear-to-r from-[#002b15] to-[#005c2e] text-white flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider hover:opacity-95 active:scale-98 transition-all duration-200 shrink-0 cursor-pointer"
                  aria-label="Subscribe to newsletter"
                >
                  <span className="hidden sm:inline">Subscribe</span>
                  <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 text-[#005c2e] animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="h-4 w-4 text-[#005c2e] shrink-0" />
                <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider">
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