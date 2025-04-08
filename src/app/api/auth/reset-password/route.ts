import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !password || !otp) {
      return NextResponse.json(
        { message: "Email, password and OTP are required", success: false },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 400 }
      );
    }

    if (!user.forgotPasswordOTP || !user.verifyOTPExpiry) {
      return NextResponse.json(
        { message: "No OTP request found", success: false },
        { status: 400 }
      );
    }

    if (new Date() > user.verifyOTPExpiry) {
      return NextResponse.json(
        {
          message: "OTP has expired. Please request a new one",
          success: false,
        },
        { status: 400 }
      );
    }

    // Verify OTP again for security
    const isValidOTP = await bcrypt.compare(otp, user.forgotPasswordOTP);
    if (!isValidOTP) {
      return NextResponse.json(
        { message: "Invalid OTP", success: false },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with new password and clear OTP fields
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        forgotPasswordOTP: null,
        verifyOTPExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset password API", error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
