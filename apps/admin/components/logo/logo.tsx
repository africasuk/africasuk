"use client";

import Image from "next/image";
export default function Logo() {
  return (
    <div className="relative aspect-300/330 w-full max-w-full select-none">
      {/* Light Mode Logo */}
      <Image
        src="/blacklogo.png"
        alt="AfricaSuk Logo"
        fill
        priority
        sizes="(max-width:640px) 120px, (max-width:1024px) 180px, 240px"
        className="object-contain dark:hidden"
      />

      {/* Dark Mode Logo */}
      <Image
        src="/whitelogo.png"
        alt="AfricaSuk Logo"
        fill
        priority
        sizes="(max-width:640px) 120px, (max-width:1024px) 180px, 240px"
        className="hidden object-contain dark:block"
      />

     
    </div>
  );
}