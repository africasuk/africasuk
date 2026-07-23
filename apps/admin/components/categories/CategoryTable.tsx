"use client";

import {
  useMemo,
  useState,
} from "react";

import type { Category } from "@africasuk/types";

import SearchInput from "@/components/shared/SearchInput";
import EmptyState from "@/components/shared/EmptyState";
import SortableCategoryRow from "./SortableCategoryRow";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { toast } from "sonner";

export interface CategoryTableProps {
  categories: Category[];
  basePath?: string;
  canDelete?: boolean;
}

export default function CategoryTableClient({
  categories,
  basePath = "/categories",
  canDelete = true,
}: CategoryTableProps) {
  const [search, setSearch] =
    useState("");

  const [items, setItems] =
    useState(categories);

  const filteredCategories =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return items;
      }

      return items.filter(
        (category) =>
          category.name
            .toLowerCase()
            .includes(query) ||
          category.slug
            .toLowerCase()
            .includes(query)
      );
    }, [items, search]);

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } =
      event;

    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const oldIndex =
      items.findIndex(
        (item) =>
          item.id === active.id
      );

    const newIndex =
      items.findIndex(
        (item) =>
          item.id === over.id
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const reordered =
      arrayMove(
        items,
        oldIndex,
        newIndex
      );

    setItems(reordered);

    try {
      const response =
        await fetch(
          "/api/categories/reorder",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              reordered.map(
                (
                  item,
                  index
                ) => ({
                  id: item.id,
                  sortOrder:
                    index,
                })
              )
            ),
          }
        );

      if (!response.ok) {
        throw new Error();
      }

      toast.success(
        "Category order updated."
      );
    } catch (error) {
      console.error(error);

      setItems(categories);

      toast.error(
        "Failed to update category order."
      );
    }
  }

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search categories..."
      />

      <div className="overflow-hidden rounded-xl border bg-card">
        <DndContext
          collisionDetection={
            closestCenter
          }
          onDragEnd={
            handleDragEnd
          }
        >
          <SortableContext
            items={filteredCategories.map(
              (item) => item.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12" />

                  <TableHead className="w-[40%]">
                    Category
                  </TableHead>

                  <TableHead>
                    Slug
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCategories.length ===
                0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="p-8"
                    >
                      <EmptyState
                        title="No categories found"
                        description="There are no categories matching your search."
                        actionLabel="Create Category"
                        actionHref={`${basePath}/new`}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map(
                    (
                      category
                    ) => (
                      <SortableCategoryRow
                        key={
                          category.id
                        }
                        category={
                          category
                        }
                        basePath={
                          basePath
                        }
                        canDelete={
                          canDelete
                        }
                      />
                    )
                  )
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}