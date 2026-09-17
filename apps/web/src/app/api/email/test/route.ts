import { sendEmail } from "@/lib/zeptomail";
import { NextResponse } from "next/server";


export async function POST() {
  try {
    await sendEmail({
      to: "YOUR_EMAIL@gmail.com",
      subject: "AfricaSuk ZeptoMail Test",
      htmlbody: `
        <h2>ZeptoMail is working 🎉</h2>
        <p>This email was sent from AfricaSuk.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}