import { Buffer } from "node:buffer";

import { mtnClient } from "./client";
import type { AccessTokenResponse } from "./types";

const API_USER = process.env.MTN_API_USER!;
const API_KEY = process.env.MTN_API_KEY!;

export async function getAccessToken() {
  const credentials = Buffer.from(
    `${API_USER}:${API_KEY}`
  ).toString("base64");

  const { data } = await mtnClient.post<AccessTokenResponse>(
    "/collection/token/",
    {},
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  return data;
}

export async function getBearerToken() {
  const token = await getAccessToken();

  return token.access_token;
}