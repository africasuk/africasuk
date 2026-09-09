"use client";

import Link from "next/link";

export default function SocialLinks() {
  const socialChannels = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/africa.suk/",
      icon: (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            width="20"
            height="20"
            x="2"
            y="2"
            rx="5"
            ry="5"
          />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },

    {
      name: "Facebook",
      href: "https://www.facebook.com/people/Africa-Suk/61592236599092/",
      icon: (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },

    {
      name: "X",
      href: "https://x.com/africasuk",
      icon: (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 3 21 3 13.5 11.5 22 21h-6.5l-5.1-5.9L5.2 21H2l8-9.1L2.5 3H9l4.6 5.4L18 3z" />
        </svg>
      ),
    },

    {
      name: "YouTube",
      href: "https://www.youtube.com/@AfricaSuk",
      icon: (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon
            points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
            fill="currentColor"
          />
        </svg>
      ),
    },

    {
      name: "Threads",
      href: "https://www.threads.com/@africa.suk",
      icon: (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18.25 11.2c-.2-4.2-2.55-6.65-6.35-6.65-3.85 0-6.2 2.55-6.2 6.65 0 4.25 2.4 6.9 6.3 6.9 3.15 0 5.2-1.75 5.2-4.25 0-2.3-1.65-3.75-4.35-3.75-2.45 0-3.9 1.25-3.9 3.05 0 1.55 1.15 2.55 2.9 2.55 2.15 0 3.55-1.55 3.55-4.15 0-3.3-1.45-5.05-4.15-5.05-2.1 0-3.35 1.25-3.35 3.35" />
          <path d="M12.1 10.1c4.25 0 6.9 1.45 6.9 4.45 0 2.25-1.45 3.55-3.8 3.55" />
        </svg>
      ),
    },
  ];

  return (
    <div className="select-none py-4 text-neutral-900 antialiased">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
          CONNECT WITH{" "}
          <span className="text-[#002b15]">AFRICA SUK</span>
        </p>

        <div className="flex items-center gap-2">
          {socialChannels.map((channel) => (
            <Link
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Africa Suk on ${channel.name}`}
              className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-[#002b15] hover:bg-[#002b15] active:scale-95"
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