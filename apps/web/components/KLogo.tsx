import React from "react";

interface KLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function KLogo({ size = 32, className = "", ...props }: KLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="k-base logo"
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="#0C101A" />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="7.25"
        stroke="#232D42"
        strokeWidth="1.5"
      />
      {/* Left titanium pillar */}
      <path d="M8.5 7.5H13V24.5H8.5V7.5Z" fill="#F8FAFC" />
      {/* Dynamic precision chevrons with cyan-to-emerald gradient */}
      <path
        d="M14 16.2L20.8 7.5H25.5L17.2 17.8L25.8 24.5H20.2L14 19.2V16.2Z"
        fill="url(#k-logo-gradient)"
      />
      <defs>
        <linearGradient
          id="k-logo-gradient"
          x1="14"
          y1="7.5"
          x2="25.8"
          y2="24.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
      </defs>
    </svg>
  );
}
