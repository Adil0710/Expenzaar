import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    // Try NextAuth session (for web users)
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    // If no session, fallback to JWT (for mobile users)
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

    // Parse request body
    const { name, limit } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if the category already exists for the user
    const existingCategory = await prisma.category.findFirst({
      where: { userId, name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 }
      );
    }

    // Create new category
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        userId: userId as string,
        name,
        limit: limit || 0, // Default to 0 if not provided
      },
    });

    return NextResponse.json(
      { success: true, newCategory, message: "Category added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { success: false, message: "Error adding category" },
      { status: 500 }
    );
  }
}
