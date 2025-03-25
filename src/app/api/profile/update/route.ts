import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PUT(req: Request) {
  try {
    // First, try NextAuth session (for web)
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    // If no session, fallback to JWT (for mobile)
    if (!userId) {
      const token = req.headers.get("authorization")?.split(" ")[1];
      if (!token) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      if (!decoded || typeof decoded === "string") {
        return NextResponse.json(
          { success: false, message: "Invalid token" },
          { status: 401 }
        );
      }

      userId = decoded.id;
    }

    // Find the logged-in user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      name,
      email,
      salary,
      currencyCode,
      currencySymbol,
      currentPassword,
      newPassword,
    } = body;

    // If updating password, verify current password
    if (currentPassword && newPassword) {
      if (!user.password) {
        return NextResponse.json(
          { success: false, message: "User password not set" },
          { status: 400 }
        );
      }
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // Update fields if provided
    const updateData: Record<string, string | number> = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (typeof salary !== "undefined") updateData.salary = salary;
    if (currencyCode) updateData.currencyCode = currencyCode;
    if (currencySymbol) updateData.currencySymbol = currencySymbol;
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Save updated user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        salary: true,
        currencyCode: true,
        currencySymbol: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error updating profile" },
      { status: 500 }
    );
  }
}
