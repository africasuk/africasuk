import axios from "axios";

export const mtnClient = axios.create({
  baseURL: process.env.MTN_MOMO_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key":
      process.env.MTN_SUBSCRIPTION_KEY!,
  },
});