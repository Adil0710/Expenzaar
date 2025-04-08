import nodemailer from "nodemailer";

import { ApiResponse } from "@/types/ApiResponse";
import OTPMail from "@/emails/OTPMail";

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for all other ports
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS, // Your email password or app-specific password
  },
});

export async function sendOTPMail(
  email: string,
  name: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Convert the JSX to a string (HTML) using ReactDOMServer

    // Send email using the transporter
    const info = await transporter.sendMail({
      from: '"Expenzaar" <padil2246@gmail.com>', // Change this to your verified email
      to: email, // Recipient email
      subject: "Expenzaar | OTP for Password Reset", // Subject line
      html: OTPMail({ name, verifyCode, email }), // HTML body content (as a string)
    });

    console.log("Message sent: %s", info.messageId, info); // Access the messageId properly
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
