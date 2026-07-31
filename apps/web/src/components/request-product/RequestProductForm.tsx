"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

import { submitProductRequest } from "@/app/request-product/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RequestProductForm() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = (formData: FormData) => {
    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    startTransition(async () => {
      try {
        await submitProductRequest(formData);

        toast.success("Your request has been submitted successfully.");

        formRef.current?.reset();
        setImage(null);
        if (preview) {
          URL.revokeObjectURL(preview);
          setPreview(null);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
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
        <Label className="text-xs font-bold uppercase tracking-wider text-emerald-950">
          Product Image <span className="text-emerald-600">*</span>
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
            if (file) handleFile(file);
          }}
          className={`group relative flex h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
            dragging
              ? "border-[#005c2e] bg-emerald-50 scale-[0.99]"
              : image
              ? "border-emerald-500/60 bg-emerald-50/40"
              : "border-slate-300 bg-slate-50/60 hover:border-emerald-600 hover:bg-emerald-50/30"
          }`}
        >
          {preview ? (
            <div className="relative flex flex-col items-center text-center p-4 h-full w-full justify-center">
              <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-emerald-500/30 mb-2 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Product Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 rounded-full bg-slate-900/80 p-1 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="font-bold text-slate-900 text-xs max-w-xs truncate">
                {image?.name}
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                Click or drag another image to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center px-4">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100/80 text-[#005c2e] transition-transform duration-200 group-hover:scale-110">
                <Upload className="h-5 w-5" />
              </div>

              <p className="text-xs font-bold text-slate-800">
                Drag & Drop Product Image
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
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
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-xs font-bold uppercase tracking-wider text-emerald-950"
        >
          Phone Number <span className="text-emerald-600">*</span>
        </Label>

        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+211xxxxxxxxx"
          required
          className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus-visible:border-[#005c2e] focus-visible:ring-2 focus-visible:ring-[#005c2e]/20"
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-xs font-bold uppercase tracking-wider text-emerald-950"
        >
          Description <span className="text-emerald-600">*</span>
        </Label>

        <Textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Describe the product you are looking for (brand, color, size, specifications)..."
          required
          className="rounded-xl border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus-visible:border-[#005c2e] focus-visible:ring-2 focus-visible:ring-[#005c2e]/20"
        />
      </div>

      {/* Brand Green CTA Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-xl bg-linear-to-r from-[#002b15] via-emerald-800 to-emerald-600 hover:from-[#003d1e] hover:to-emerald-500 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Submitting Request..." : "Submit Request"}
      </Button>
    </form>
  );
}