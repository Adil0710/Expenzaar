import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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

    const { name, limit } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if the category name already exists for the user
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId: decoded.id,
        name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        userId: decoded.id,
        name,
        limit: limit || 0, // Default to 0 if no limit provided
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
