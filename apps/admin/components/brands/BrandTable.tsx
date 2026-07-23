"use client";

import { useMemo, useState } from "react";

import type { Brand } from "@africasuk/types";

import BrandStatusSwitch from "@/components/brands/BrandStatusSwitch";

import EmptyState from "@/components/shared/EmptyState";
import RowActions from "@/components/shared/RowActions";
import SearchInput from "@/components/shared/SearchInput";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BrandTableProps {
  brands: Brand[];
  basePath?: string;
  canDelete?: boolean;
}

export default function BrandTable({
  brands,
  basePath = "/brands",
  canDelete = true,
}: BrandTableProps) {
  const [search, setSearch] = useState("");

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return brands;
    }

    return brands.filter(
      (brand) =>
        brand.name
          .toLowerCase()
          .includes(query) ||
        brand.slug
          .toLowerCase()
          .includes(query)
    );
  }, [brands, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search brands..."
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">
                Name
              </TableHead>

              <TableHead>
                Slug
              </TableHead>

              <TableHead className="w-36">
                Status
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-8"
                >
                  <EmptyState
                    title="No brands found"
                    description="There are no brands matching your search."
                    actionLabel="Create Brand"
                    actionHref={`${basePath}/new`}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">
                    {brand.name}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {brand.slug}
                  </TableCell>

                  <TableCell>
                    <BrandStatusSwitch
                      id={brand.id}
                      checked={brand.isActive}
                    />
                  </TableCell>

                  <TableCell>
                    <RowActions
                      editHref={`${basePath}/${brand.id}/edit`}
                      showDelete={canDelete}
                      deleteTitle="Delete Brand"
                      deleteDescription={`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`}
                      deleteUrl={`/api/brands/${brand.id}`}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}