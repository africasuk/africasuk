import { NextResponse } from "next/server";

import {
  MTNMomoService,
} from "@africasuk/api";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      referenceId: string;
    }>;
  },
) {
  try {
    const { referenceId } =
      await params;

    const mtn =
      new MTNMomoService();

const status =
  await mtn.getRequestToPayStatus(
    referenceId,
  );

    return NextResponse.json(
      status,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed.",
      },
      {
        status: 500,
      },
    );
  }
}