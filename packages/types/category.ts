export interface Category {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  imageUrl: string | null;

  parentId: string | null;

  level: number;

  isActive: boolean;

  sortOrder: number;

  createdAt: string;

  updatedAt: string;
}