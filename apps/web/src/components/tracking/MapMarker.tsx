"use client";

import { useId } from "react";
import {
  Building2,
  Factory,
  Home,
  ShieldCheck,
} from "lucide-react";

interface Props {
  type: "supplier" | "warehouse" | "border" | "customer";
  label: string;
  color?: string;
  offsetDirection?: "top" | "bottom" | "left" | "right";
}

export default function MapMarker({
  type,
  label,
  color,
  offsetDirection = "top",
}: Props) {
  const filterId = useId();

  const Icon =
    type === "supplier"
      ? Factory
      : type === "warehouse"
      ? Building2
      : type === "border"
      ? ShieldCheck
      : Home;

  // Modern zinc palette fallback per role if custom color isn't provided
  const markerColor =
    color ??
    (type === "customer"
      ? "#dc2626"
      : type === "border"
      ? "#d97706"
      : "#18181b");

  // Relative label offset positions with clean padding clearances
  const textOffsets = {
    top: { x: 0, y: -36, textAnchor: "middle" as const },
    bottom: { x: 0, y: 20, textAnchor: "middle" as const },
    left: { x: -30, y: -14, textAnchor: "end" as const },
    right: { x: 30, y: -14, textAnchor: "start" as const },
  }[offsetDirection];

  return (
    <g className="group cursor-pointer select-none">
      {/* Neutral Drop Shadow Filter */}
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="2.5"
            floodColor="#000000"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      {/* Radar Pulse Animation */}
      <circle r={18} fill={markerColor} opacity={0.18}>
        <animate
          attributeName="r"
          values="12;26;12"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.28;0.04;0.28"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Map Pin Teardrop Shape */}
      <g
        filter={`url(#${filterId})`}
        className="transition-transform duration-200 ease-out group-hover:-translate-y-1"
      >
        <path
          d="M 0 -28 C -13 -28 -16 -14 0 0 C 16 -14 13 -28 0 -28 Z"
          fill={markerColor}
          stroke="#ffffff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Inner Icon Cavity */}
        <circle cx={0} cy={-17} r={9} fill="#ffffff" />
      </g>

      {/* Centered Vector Icon */}
      <foreignObject
        x={-8}
        y={-25}
        width={16}
        height={16}
        className="pointer-events-none transition-transform duration-200 ease-out group-hover:-translate-y-1"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Icon
            size={11}
            color={markerColor}
            strokeWidth={2.4}
          />
        </div>
      </foreignObject>

      {/* Label Callout Pill */}
      <g
        transform={`translate(${textOffsets.x}, ${textOffsets.y})`}
        className="pointer-events-none transition-opacity duration-150"
      >
        <text
          x={0}
          y={0}
          textAnchor={textOffsets.textAnchor}
          fontSize={10}
          fill="#18181b"
          fontWeight={600}
          letterSpacing="-0.01em"
          stroke="#ffffff"
          strokeWidth={3.5}
          strokeLinejoin="round"
          paintOrder="stroke"
          className="font-sans antialiased"
        >
          {label}
        </text>
      </g>
    </g>
  );
}