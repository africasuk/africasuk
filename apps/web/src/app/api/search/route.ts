import { NextRequest, NextResponse } from "next/server";

import {
  ProductRepository,
} from "@africasuk/database";

import {
  SearchService,
} from "@africasuk/api";

import { createClient } from "@/lib/auth/server";


export async function GET(
  request: NextRequest
) {
  try {
    const query =
      request.nextUrl.searchParams.get("q")?.trim() ?? "";


    if (!query) {
      return NextResponse.json([]);
    }


    const supabase =
      await createClient();


    const productRepository =
      new ProductRepository(supabase);


    const searchService =
      new SearchService(
        productRepository
      );


    const results =
      await searchService.search(query);


    return NextResponse.json(results);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message: "Search failed",
      },
      {
        status: 500,
      }
    );
  }
}