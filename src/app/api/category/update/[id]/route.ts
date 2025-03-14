import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const resolvedParams = await params;


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

    const categoryId = resolvedParams.id;
    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: decoded.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found or unauthorized" },
        { status: 404 }
      );
    }

    const { name, limit } = await req.json();

    // Prepare updated data object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (limit) updateData.limit = limit;

    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: "Error updating category" },
      { status: 500 }
    );
  }
}
