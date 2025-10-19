import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

// This is your POST API
export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html } = await req.json();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your email password or app password
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: `"Next.js Mail" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ message: "Email sent", info });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
