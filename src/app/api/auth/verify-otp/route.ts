import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP required", suceess: false },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found with this email, Please signup",
          success: false,
        },
        { status: 400 }
      );
    }

    if (!user.forgotPasswordOTP) {
      return NextResponse.json(
        {
          message: "OTP not found, please request a new OTP",
          success: false,
        },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (user.verifyOTPExpiry && new Date() > user.verifyOTPExpiry) {
      return NextResponse.json(
        {
          message: "OTP has expired. Please request a new one",
          success: false,
        },
        { status: 400 }
      );
    }

    const isOtpValid = await bcrypt.compare(otp, user.forgotPasswordOTP);

    if (!isOtpValid) {
      return NextResponse.json(
        { message: "Invalid OTP", success: false },
        { status: 400 }
      );
    }

    // OTP is valid - we'll use the same OTP for the reset step
    // We don't need to generate a separate token since we can verify the OTP again
    return NextResponse.json(
      {
        message: "OTP verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in verify OTP API", error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
