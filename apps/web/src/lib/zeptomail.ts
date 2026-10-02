export async function sendEmail({
  to,
  subject,
  htmlbody,
}: {
  to: string;
  subject: string;
  htmlbody: string;
}) {
  const senderEmail =
    process.env.ZEPTOMAIL_FROM_EMAIL ||
    "no-reply@africasuk.com";

  const senderName =
    process.env.ZEPTOMAIL_FROM_NAME ||
    "AfricaSuk";

  console.log("=================================");
  console.log("ZeptoMail SEND");
  console.log("From:", senderEmail);
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("=================================");

  const response = await fetch(
    "https://api.zeptomail.in/v1.1/email",
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          process.env.ZEPTOMAIL_API_KEY!,
      },

      body: JSON.stringify({
        from: {
          address: senderEmail,
          name: senderName,
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
    },
  );

  const responseText = await response.text();

  console.log("=================================");
  console.log("ZeptoMail RESPONSE");
  console.log("Status:", response.status);
  console.log("OK:", response.ok);
  console.log("Body:", responseText);
  console.log("=================================");

  if (!response.ok) {
    throw new Error(
      `ZeptoMail error (${response.status}): ${responseText}`,
    );
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return {
      success: true,
      rawResponse: responseText,
    };
  }
}