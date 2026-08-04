"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductRequestDialog } from "./ProductRequestDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductRequest {
  id: string;
  image_url: string;
  phone: string;
  description: string;
  status: string;
  created_at: string;
}

interface Props {
  data: ProductRequest[];
}

// Helper to truncate text to a maximum word count
function truncateWords(text?: string | null, wordLimit: number = 3): string {
  if (!text) return "-";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return `${words.slice(0, wordLimit).join(" ")}...`;
}

export function ProductRequestTable({ data }: Props) {
  const [selectedRequest, setSelectedRequest] =
    useState<ProductRequest | null>(null);

  const [open, setOpen] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-2xs">
        No product requests found.
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        {/* ------------------------------------------------------------- */}
        {/* 1. MOBILE CARD VIEW (Visible on screens smaller than md)      */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {data.map((request) => (
            <div
              key={request.id}
              className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-2xs gap-3"
            >
              <div className="flex items-start gap-3">
                {/* Image */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  <Image
                    src={request.image_url || "/placeholder.png"}
                    alt="Requested Product"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {request.phone}
                    </p>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] px-2 py-0.5 capitalize bg-primary/10 text-primary border-primary/20"
                    >
                      {request.status}
                    </Badge>
                  </div>

                  {/* 3-word truncated description */}
                  <p
                    className="text-xs text-muted-foreground truncate"
                    title={request.description}
                  >
                    {truncateWords(request.description, 3)}
                  </p>

                  <p className="text-[11px] text-muted-foreground/80 pt-0.5">
                    {new Date(request.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-end pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-1.5 text-xs"
                  onClick={() => {
                    setSelectedRequest(request);
                    setOpen(true);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. TABLE VIEW (Visible on tablet & desktop screens md+)        */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden md:block rounded-lg border border-border bg-card text-card-foreground shadow-2xs overflow-hidden">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="w-16">Image</TableHead>
                <TableHead className="w-[22%]">Phone</TableHead>
                <TableHead className="w-[38%]">Description</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[15%]">Date</TableHead>
                <TableHead className="w-20 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((request) => (
                <TableRow key={request.id} className="border-border hover:bg-muted/50">
                  <TableCell className="w-16">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        src={request.image_url || "/placeholder.png"}
                        alt="Requested Product"
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-sm whitespace-nowrap">
                    {request.phone}
                  </TableCell>

                  {/* 3-word truncated description */}
                  <TableCell className="text-muted-foreground text-sm">
                    <span className="truncate block" title={request.description}>
                      {truncateWords(request.description, 3)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-[11px] px-2 py-0.5 capitalize bg-primary/10 text-primary border-primary/20"
                    >
                      {request.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(request.created_at).toLocaleDateString("en-GB")}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      onClick={() => {
                        setSelectedRequest(request);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductRequestDialog
        key={selectedRequest?.id}
        open={open}
        onOpenChange={setOpen}
        request={selectedRequest}
      />
    </>
  );
}