"use client";

import { Truck } from "lucide-react";

interface Props {
  label?: string;
}

export default function TruckMarker({ label = "Live Location" }: Props) {
  const labelText = label.toUpperCase();
  // Dynamic pill width based on text length to prevent clipping or fixed truncation
  const pillWidth = Math.max(54, labelText.length * 5.2 + 18);
  const halfPill = pillWidth / 2;

  return (
    <g className="cursor-pointer group select-none">
      <defs>
        {/* Soft, low-contrast drop shadow filter */}
        <filter
          id="truck-shadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2.5"
            floodColor="#002b15"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      {/* Subtle Ambient Pulse Aura - Emerald Tint */}
      <circle r={18} fill="#10b981" opacity={0.2}>
        <animate
          attributeName="r"
          values="13;22;13"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.25;0.05;0.25"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Central Vehicle Badge Icon */}
      <g
        filter="url(#truck-shadow)"
        className="transition-transform duration-300 group-hover:scale-105"
      >
        {/* Outer Circle Container */}
        <circle
          r={13}
          fill="#005c2e"
          stroke="#ffffff"
          strokeWidth={1.8}
        />

        {/* Inner Vehicle Icon */}
        <foreignObject
          x={-8}
          y={-8}
          width={16}
          height={16}
          className="pointer-events-none"
        >
          <div className="flex h-full w-full items-center justify-center">
            <Truck
              size={11}
              color="white"
              strokeWidth={1.8}
            />
          </div>
        </foreignObject>
      </g>

      {/* Floating Status Badge Label (Positioned BELOW circle at y = +20 to avoid obscuring waypoint markers) */}
      <g
        transform="translate(0, 20)"
        className="transition-transform duration-300 group-hover:translate-y-0.5"
      >
        {/* Pill Background - Deep Navy */}
        <rect
          x={-halfPill}
          y={-7}
          width={pillWidth}
          height={14}
          rx={7}
          fill="#002b15"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={1}
        />

        {/* Live Indicator Dot - Emerald Green */}
        <circle cx={-halfPill + 8} cy={0} r={1.8} fill="#34d399">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Label Text - Lightweight & Clean */}
        <text
          x={3}
          y={2.8}
          textAnchor="middle"
          fontSize={7.5}
          fill="#ffffff"
          fontWeight={500}
          letterSpacing="0.04em"
          className="uppercase font-sans antialiased"
        >
          {labelText}
        </text>
      </g>
    </g>
  );
}