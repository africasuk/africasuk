"use client";

import {
  Building2,
  Factory,
  Home,
  ShieldCheck,
} from "lucide-react";

interface Props {
  type: "supplier" | "warehouse" | "border" | "customer";
  label: string;
  color: string;
  offsetDirection?: "top" | "bottom" | "left" | "right";
}

export default function MapMarker({
  type,
  label,
  color,
  offsetDirection = "top",
}: Props) {
  const Icon =
    type === "supplier"
      ? Factory
      : type === "warehouse"
      ? Building2
      : type === "border"
      ? ShieldCheck
      : Home;

  // Compute text label positioning based on offset direction
  const textOffsets = {
    top: { x: 0, y: -34, textAnchor: "middle" as const },
    bottom: { x: 0, y: 18, textAnchor: "middle" as const },
    left: { x: -28, y: -8, textAnchor: "end" as const },
    right: { x: 28, y: -8, textAnchor: "start" as const },
  }[offsetDirection];

  return (
    <g className="cursor-pointer group select-none">
      {/* Drop Shadow Filter */}
      <defs>
        <filter id={`shadow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#002b15" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Radar Pulse Animation */}
      <circle r={22} fill={color} opacity={0.2}>
        <animate
          attributeName="r"
          values="14;30;14"
          dur="2.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0.05;0.4"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Advanced Map Pin Teardrop Shape */}
      <g filter={`url(#shadow-${type})`} className="transition-transform duration-300 group-hover:-translate-y-1">
        <path
          d="M 0 -26 C -12 -26 -16 -12 0 0 C 16 -12 12 -26 0 -26 Z"
          fill={color}
          stroke="#ffffff"
          strokeWidth={2.5}
        />
        {/* Inner Circle Badge */}
        <circle cx={0} cy={-16} r={8.5} fill="#ffffff" />
      </g>

      {/* Centered Icon inside Badge */}
      <foreignObject
        x={-8}
        y={-24}
        width={16}
        height={16}
        className="pointer-events-none transition-transform duration-300 group-hover:-translate-y-1"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Icon
            size={11}
            color={color}
            strokeWidth={3}
          />
        </div>
      </foreignObject>

      {/* High-Precision Premium Label */}
      <text
        x={textOffsets.x}
        y={textOffsets.y}
        textAnchor={textOffsets.textAnchor}
        fontSize={10}
        fill="#f8fafc"
        fontWeight={800}
        letterSpacing="0.08em"
        stroke="#090d16"
        strokeWidth={4}
        paintOrder="stroke"
        className="uppercase font-sans antialiased"
      >
        {label}
      </text>
    </g>
  );
}