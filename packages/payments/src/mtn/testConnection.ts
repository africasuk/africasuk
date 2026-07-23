import { provisionApiUser } from "./apiUser";
import { getAccessToken } from "./auth";

async function main() {
  try {
    console.log("Creating MTN API User...");

    const credentials = await provisionApiUser();

    console.log("API User:", credentials.apiUser);
    console.log("API Key :", credentials.apiKey);

    console.log("\nUpdate your .env.local with the API Key before continuing.\n");

    process.env.MTN_API_KEY = credentials.apiKey;

    const token = await getAccessToken();

    console.log("Access Token:");
    console.log(token.access_token);
    console.log("Expires In:", token.expires_in);
  } catch (error) {
    console.error(error);
  }
}

main();