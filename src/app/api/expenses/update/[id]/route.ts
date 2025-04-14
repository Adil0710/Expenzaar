import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const expenseId = resolvedParams.id;
    if (!expenseId)
      return NextResponse.json(
        { success: false, message: "Expense ID is required" },
        { status: 400 }
      );

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, userId: decoded.id },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { success: false, message: "Expense not found or unauthorized" },
        { status: 404 }
      );
    }

    const { amount, description, categoryId } = await req.json();
    if (!amount || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Amount and category ID are required" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.findFirst({
      where: { id: categoryId, userId: decoded.id },
    });

    if (!newCategory) {
      return NextResponse.json(
        { success: false, message: "New category not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the expense
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: { amount, description, categoryId },
    });

    // Utility function to recalculate `isOverLimit`
    const recalculateCategoryLimit = async (categoryId: string) => {
      const totalSpent = await prisma.expense.aggregate({
        where: {
          categoryId,
          userId: decoded.id,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      });

      const category = await prisma.category.findFirst({
        where: { id: categoryId },
      });
      const categoryLimit = Number(category?.limit) || 0;
      const totalAmountSpent = Number(totalSpent._sum.amount) || 0;

      const isOverLimit = categoryLimit
        ? totalAmountSpent > categoryLimit
        : false;

      await prisma.expense.updateMany({
        where: { categoryId },
        data: { isOverLimit },
      });
    };

    // Recalculate for both old and new categories
    await Promise.all([
      recalculateCategoryLimit(existingExpense.categoryId),
      recalculateCategoryLimit(categoryId),
    ]);

    return NextResponse.json(
      {
        success: true,
        updatedExpense,
        message: "Expense updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { success: false, message: "Error updating expense" },
      { status: 500 }
    );
  }
}
