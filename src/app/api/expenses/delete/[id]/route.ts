import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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
        userId,
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
