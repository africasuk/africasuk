
"use client";

import { useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";

interface ColorNamePickerProps {
  value: string;
  onChange: (name: string) => void;
}

const COLORS = [
  { name: "Black", hex: "#171717" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Light Gray", hex: "#D3D3D3" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Navy Blue", hex: "#000080" },
  { name: "Baby Blue", hex: "#89CFF0" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Teal", hex: "#008080" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Mint Green", hex: "#98FF98" },
  { name: "Light Green", hex: "#90EE90" },
  { name: "Green", hex: "#008000" },
  { name: "Emerald Green", hex: "#50C878" },
  { name: "Olive Green", hex: "#808000" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Lime Green", hex: "#32CD32" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Lemon Yellow", hex: "#FFF44F" },
  { name: "Mustard Yellow", hex: "#FFDB58" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Peach", hex: "#FFE5B4" },
  { name: "Red", hex: "#FF0000" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Maroon", hex: "#800000" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Fuchsia", hex: "#FF00FF" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Purple", hex: "#800080" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Lilac", hex: "#C8A2C8" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Chocolate Brown", hex: "#7B3F00" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Tan", hex: "#D2B48C" },
];

export function ColorNamePicker({
  value,
  onChange,
}: ColorNamePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = COLORS.find(
    (color) => color.name.toLowerCase() === value.trim().toLowerCase(),
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Color Name</label>

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-md border bg-background px-3 py-2 text-left text-sm hover:bg-muted/50"
      >
        {selected ? (
          <span
            className="size-6 shrink-0 rounded-full border shadow-sm"
            style={{ backgroundColor: selected.hex }}
          />
        ) : (
          <Palette className="size-5 shrink-0 text-muted-foreground" />
        )}

        <span className="flex-1 truncate">
          {value || "Choose a color"}
        </span>

        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="rounded-lg border bg-background p-3 shadow-sm">
          <p className="mb-3 text-xs text-muted-foreground">
            Select a color to fill in its name.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {COLORS.map((color) => {
              const active =
                value.trim().toLowerCase() === color.name.toLowerCase();

              return (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  aria-label={color.name}
                  aria-pressed={active}
                  onClick={() => {
                    onChange(color.name);
                    setOpen(false);
                  }}
                  className={`flex min-w-0 items-center gap-2 rounded-md border p-2 text-left text-xs hover:bg-muted ${
                    active ? "border-primary ring-1 ring-primary" : ""
                  }`}
                >
                  <span
                    className="relative size-5 shrink-0 rounded-full border"
                    style={{ backgroundColor: color.hex }}
                  >
                    {active && (
                      <Check
                        className={`absolute inset-0 m-auto size-3 ${
                          ["Black", "Navy Blue", "Burgundy", "Purple"].includes(
                            color.name,
                          )
                            ? "text-white"
                            : "text-black"
                        }`}
                      />
                    )}
                  </span>

                  <span className="truncate">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Or type a custom color name"
        className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
