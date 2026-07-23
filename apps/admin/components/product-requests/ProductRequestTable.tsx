"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
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

export function ProductRequestTable({ data }: Props) {
  const [selectedRequest, setSelectedRequest] =
    useState<ProductRequest | null>(null);

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Image
                    src={request.image_url}
                    alt="Requested Product"
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                </TableCell>

                <TableCell>{request.phone}</TableCell>

                <TableCell className="max-w-sm truncate">
                  {request.description}
                </TableCell>

                <TableCell>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                    {request.status}
                  </span>
                </TableCell>

                <TableCell>
                  {new Date(request.created_at).toLocaleDateString("en-GB")}
                </TableCell>

                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
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

      <ProductRequestDialog
        key={selectedRequest?.id}
        open={open}
        onOpenChange={setOpen}
        request={selectedRequest}
        />
    </>
  );
}