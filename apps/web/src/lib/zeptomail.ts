export async function sendEmail({
  to,
  subject,
  htmlbody,
}: {
  to: string;
  subject: string;
  htmlbody: string;
}) {
  const response = await fetch("https://api.zeptomail.in/v1.1/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: process.env.ZEPTOMAIL_API_KEY!,
    },
    body: JSON.stringify({
      from: {
        address: process.env.ZEPTOMAIL_FROM_EMAIL!,
        name: process.env.ZEPTOMAIL_FROM_NAME!,
      },
      to: [
        {
          email_address: {
            address: to,
          },
        },
      ],
      subject,
      htmlbody,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ZeptoMail error: ${error}`);
  }

  return response.json();
}