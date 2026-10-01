export async function forgotPassword(email: string) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  return {
    data,
    error: response.ok
      ? null
      : new Error(data.error || "Failed to send reset email"),
  };
}