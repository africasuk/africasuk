"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateProductRequestStatus } from "@/app/(admin)/product-requests/actions";

interface ProductRequest {
  id: string;
  image_url: string;
  phone: string;
  description: string;
  status: string;
  product_link?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ProductRequest | null;
}

export function ProductRequestDialog({
  open,
  onOpenChange,
  request,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(request?.status ?? "pending");
  const [productLink, setProductLink] = useState(
    request?.product_link ?? "",
  );

  const [isPending, startTransition] = useTransition();

  if (!request) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Request</DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 md:grid-cols-2">
          <Image
            src={request.image_url}
            alt="Requested Product"
            width={600}
            height={600}
            className="aspect-square rounded-lg object-cover"
          />

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>{request.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold">Description</h3>

              <Textarea
                value={request.description}
                readOnly
                rows={8}
              />
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Status</h3>
            <Select
              value={status}
              onValueChange={(value) => {
              if (value) setStatus(value);
            }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="sourcing">Sourcing</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            </div>

            {status === "available" && (
              <div>
                <h3 className="mb-2 font-semibold">
                  Product Link
                </h3>

                <Input
                  placeholder="https://africasuk.com/products/iphone-16-pro"
                  value={productLink}
                  onChange={(e) =>
                    setProductLink(e.target.value)
                  }
                />
              </div>
            )}

            <Button
              className="w-full"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  try {
                    await updateProductRequestStatus(
                      request.id,
                      status,
                      status === "available"
                        ? productLink
                        : null,
                    );

                    toast.success(
                      "Request updated successfully.",
                    );

                    onOpenChange(false);

                    router.refresh();
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "Failed to update request.",
                    );
                  }
                });
              }}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}