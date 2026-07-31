"use client";

import Link from "next/link";

export default function SocialLinks() {
  const socialChannels = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/africa.suk/",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/people/Africa-Suk/61592236599092/",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://x.com/africasuk",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@AfricaSuk",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-4 text-neutral-900 select-none antialiased">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        
        {/* Subtle Brand Cue */}
        <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">
          CONNECT WITH <span className="text-[#002b15]">AFRICASUK</span>
        </p>

        {/* Minimal Social Button Row */}
        <div className="flex items-center gap-2">
          {socialChannels.map((channel) => (
            <Link
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow AfricaSuk on ${channel.name}`}
              className="group flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-[#002b15] hover:bg-[#002b15] active:scale-95 cursor-pointer"
            >
              <div className="text-gray-500 transition-colors duration-200 group-hover:text-white">
                {channel.icon}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}