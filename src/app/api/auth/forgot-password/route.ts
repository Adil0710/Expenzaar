import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { send } from "process";
import { sendOTPMail } from "@/helpers/sendOTPMail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found with this email. Please Signup." },
        { status: 400 }
      );
    }

    if (existingUser.googleAccount) {
      return NextResponse.json(
        {
          message:
            "You have signed up using Google. Please use Google to login.",
        },
        { status: 400 }
      );
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6 digit OTP

    const hashedOtp = await bcrypt.hash(otp, 10); // Hash the OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Set OTP expiry to 10 minutes from now
    await prisma.user.update({
      where: { email },
      data: {
        forgotPasswordOTP: hashedOtp,
        verifyOTPExpiry: otpExpiry,
      },
    });

    const name = existingUser.name.split(" ")[0]; // Get the first name from the full name
    const sendOTPMailResponse = await sendOTPMail(email, name, otp);

    if (!sendOTPMailResponse.success) {
      return NextResponse.json(
        { message: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password API", error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
