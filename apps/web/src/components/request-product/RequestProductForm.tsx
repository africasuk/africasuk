"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { ChangeEvent, DragEvent, MouseEvent } from "react";
import imageCompression from "browser-image-compression";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

import { submitProductRequest } from "@/app/request-product/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function RequestProductForm() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const clearImage = () => {
    setImage(null);
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFile = async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_ORIGINAL_SIZE) {
      toast.error("The original image must be 20 MB or smaller.");
      return;
    }

    setIsCompressing(true);

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg",
        initialQuality: 0.82,
      });

      if (compressedFile.size > MAX_IMAGE_SIZE) {
        throw new Error("The image could not be compressed below 5 MB.");
      }

      const optimizedFile = new File(
        [compressedFile],
        `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
        {
          type: "image/jpeg",
          lastModified: Date.now(),
        },
      );

      setPreview(URL.createObjectURL(optimizedFile));
      setImage(optimizedFile);

      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const compressedSize = (
        optimizedFile.size /
        1024 /
        1024
      ).toFixed(2);

      toast.success(
        `Image optimized: ${originalSize} MB → ${compressedSize} MB`,
      );
    } catch (error) {
      console.error("Image compression failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not compress this image. Please try another one.",
      );
    } finally {
      setIsCompressing(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const removeImage = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    clearImage();
  };

  const handleSubmit = (formData: FormData) => {
    if (isCompressing) {
      toast.error("Please wait for image compression to finish.");
      return;
    }

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    if (image.size > MAX_IMAGE_SIZE) {
      toast.error("The compressed image must be 5 MB or smaller.");
      return;
    }

    formData.set("image", image);

    startTransition(async () => {
      try {
        await submitProductRequest(formData);

        toast.success("Your request has been submitted successfully.");

        formRef.current?.reset();
        clearImage();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        );
      }
    });
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      void handleFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void handleFile(file);
    }
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-6 antialiased select-none"
    >
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-emerald-950">
          Product Image <span className="text-emerald-600">*</span>
        </Label>

        <div
          onClick={() => {
            if (!isCompressing && !isPending) {
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`group relative flex h-52 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200 ${
            dragging
              ? "scale-[0.99] border-[#005c2e] bg-emerald-50"
              : image
                ? "border-emerald-500/60 bg-emerald-50/40"
                : "cursor-pointer border-slate-300 bg-slate-50/60 hover:border-emerald-600 hover:bg-emerald-50/30"
          } ${isCompressing ? "cursor-wait opacity-70" : ""}`}
        >
          {preview ? (
            <div className="relative flex h-full w-full flex-col items-center justify-center p-4 text-center">
              <div className="relative mb-2 h-24 w-24 overflow-hidden rounded-xl border border-emerald-500/30 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Compressed product preview"
                  className="h-full w-full object-cover"
                />

                {!isCompressing && (
                  <button
                    type="button"
                    aria-label="Remove selected image"
                    onClick={removeImage}
                    className="absolute right-1 top-1 rounded-full bg-slate-900/80 p-1 text-white transition-colors hover:bg-rose-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <p className="max-w-xs truncate text-xs font-bold text-slate-900">
                {image?.name}
              </p>

              {isCompressing ? (
                <p className="mt-1 text-xs font-semibold text-emerald-700">
                  Compressing image...
                </p>
              ) : (
                <>
                  <p className="mt-1 text-[11px] font-semibold text-emerald-700">
                    {image
                      ? `${(image.size / 1024 / 1024).toFixed(2)} MB · Optimized`
                      : ""}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Click or drag another image to replace
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100/80 text-[#005c2e] transition-transform duration-200 group-hover:scale-110">
                <Upload className="h-5 w-5" />
              </div>

              <p className="text-xs font-bold text-slate-800">
                {isCompressing
                  ? "Compressing image..."
                  : "Drag & Drop Product Image"}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                or click to browse from device
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                JPEG, PNG, or WebP · Up to 20 MB
              </p>
            </div>
          )}
        </div>

        <Input
          ref={inputRef}
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
          disabled={isCompressing || isPending}
        />
      </div>

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

      <Button
        type="submit"
        disabled={isPending || isCompressing}
        className="h-12 w-full cursor-pointer rounded-xl bg-linear-to-r from-[#002b15] via-emerald-800 to-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:from-[#003d1e] hover:to-emerald-500 active:scale-[0.99] disabled:opacity-50"
      >
        {isCompressing
          ? "Compressing Image..."
          : isPending
            ? "Submitting Request..."
            : "Submit Request"}
      </Button>
    </form>
  );
}