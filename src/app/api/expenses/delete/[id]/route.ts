import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const expenseId = resolvedParams.id;

    if (!expenseId) {
      return NextResponse.json(
        { success: false, message: "expense ID is required" },
        { status: 400 }
      );
    }

    // Check if expense exists and belongs to the logged-in user
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: decoded.id,
      },
    });

    if (!expense) {
      return NextResponse.json(
        { success: false, message: "expense not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the expense
    await prisma.expense.delete({
      where: { id: expenseId },
    });



    return NextResponse.json(
      { success: true, message: "expense deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting expense" },
      { status: 500 }
    );
  }
}
