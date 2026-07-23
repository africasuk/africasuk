"use client";

import { useRef, useState, useTransition } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";

import { submitProductRequest } from "@/app/request-product/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RequestProductForm() {
  const [image, setImage] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setImage(file);
    } else {
      toast.error("Please upload an image.");
    }
  };

  const handleSubmit = (formData: FormData) => {
    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    startTransition(async () => {
      try {
        await submitProductRequest(formData);

        toast.success("Your request has been submitted.");

        formRef.current?.reset();
        setImage(null);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-6 antialiased select-none"
    >
      {/* Image Dropzone Field */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Product Image
        </Label>

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);

            const file = e.dataTransfer.files?.[0];

            if (file) {
              handleFile(file);
            }
          }}
          className={`group flex h-60 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ${
            dragging
              ? "border-[#005c2e] bg-emerald-50/70 scale-[0.99]"
              : image
              ? "border-emerald-500/50 bg-emerald-50/30"
              : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-100/60"
          }`}
        >
          {image ? (
            <div className="flex flex-col items-center text-center px-4">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#005c2e]">
                <ImageIcon className="h-6 w-6" />
              </div>

              <p className="font-bold text-gray-900 text-sm max-w-xs truncate">
                {image.name}
              </p>

              <p className="mt-1 text-xs font-medium text-emerald-700">
                Click or drag another image to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center px-4">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform duration-200 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:text-[#005c2e]">
                <Upload className="h-6 w-6" />
              </div>

              <p className="text-sm font-bold text-gray-800">
                Drag & Drop Product Image
              </p>

              <p className="mt-1 text-xs text-gray-500">
                or click to browse from device
              </p>
            </div>
          )}
        </div>

        <Input
          ref={inputRef}
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              handleFile(file);
            }
          }}
        />
      </div>

      {/* Phone Number Field */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Phone Number
        </Label>

        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+211xxxxxxxxx"
          required
          className="h-11 rounded-xl border-gray-200 bg-white/80 px-4 text-sm font-medium transition-all focus-visible:border-[#005c2e] focus-visible:ring-2 focus-visible:ring-[#005c2e]/20"
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Description
        </Label>

        <Textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Describe the product you are looking for (brand, color, size, specs)..."
          required
          className="rounded-xl border-gray-200 bg-white/80 p-4 text-sm font-medium transition-all focus-visible:border-[#005c2e] focus-visible:ring-2 focus-visible:ring-[#005c2e]/20"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-xl bg-linear-to-r from-[#002b15] to-[#005c2e] text-sm font-bold text-white shadow-2xs transition-all duration-200 hover:opacity-95 active:scale-[0.99] cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}