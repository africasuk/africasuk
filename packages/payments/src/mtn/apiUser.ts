import { mtnClient } from "./client";
import type { CreateApiKeyResponse } from "./types";

const API_USER = process.env.MTN_API_USER!;

export async function createApiUser() {
  await mtnClient.post(
    "/v1_0/apiuser",
    {
      providerCallbackHost:
        process.env.MTN_CALLBACK_URL ?? "localhost",
    },
    {
      headers: {
        "X-Reference-Id": API_USER,
      },
    }
  );

  return API_USER;
}

export async function createApiKey() {
  const { data } = await mtnClient.post<CreateApiKeyResponse>(
    `/v1_0/apiuser/${API_USER}/apikey`
  );

  return data.apiKey;
}

export async function provisionApiUser() {
  await createApiUser();

  const apiKey = await createApiKey();

  return {
    apiUser: API_USER,
    apiKey,
  };
}