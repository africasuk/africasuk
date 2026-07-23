import { randomUUID } from "node:crypto";

import { mtnClient } from "./client";
import { getBearerToken } from "./auth";
import type { RequestToPay, RequestToPayStatus } from "./types";

export async function requestToPay(payload: RequestToPay) {
  const referenceId = randomUUID();
  const accessToken = await getBearerToken();

  await mtnClient.post("/collection/v1_0/requesttopay", payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Reference-Id": referenceId,
      "X-Target-Environment": process.env.MTN_MOMO_TARGET_ENVIRONMENT!,
    },
  });

  return referenceId;
}

export async function getRequestToPayStatus(referenceId: string) {
  const accessToken = await getBearerToken();

  const { data } = await mtnClient.get<RequestToPayStatus>(
    `/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Target-Environment": process.env.MTN_MOMO_TARGET_ENVIRONMENT!,
      },
    }
  );

  return data;
}