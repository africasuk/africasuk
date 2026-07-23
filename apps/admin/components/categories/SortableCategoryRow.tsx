"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

import type { Category } from "@africasuk/types";

import RowActions from "@/components/shared/RowActions";
import CategoryStatusSwitch from "@/components/categories/CategoryStatusSwitch";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface Props {
  category: Category;
  basePath: string;
  canDelete: boolean;
}

export default function SortableCategoryRow({
  category,
  basePath,
  canDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-60" : ""}
    >
      <TableCell className="w-12">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </TableCell>

      <TableCell className="font-medium">
        {category.name}
      </TableCell>

      <TableCell className="text-muted-foreground">
        {category.slug}
      </TableCell>

      <TableCell>
        <CategoryStatusSwitch
          id={category.id}
          checked={category.isActive}
        />
      </TableCell>

      <TableCell className="text-right">
        <RowActions
          editHref={`${basePath}/${category.id}/edit`}
          showDelete={canDelete}
          deleteTitle="Delete Category"
          deleteDescription={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
          deleteUrl={`/api/categories/${category.id}`}
        />
      </TableCell>
    </TableRow>
  );
}