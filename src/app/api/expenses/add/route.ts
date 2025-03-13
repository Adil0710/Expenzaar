import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

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

    const { amount, categoryId, description } = await req.json();

    if (!amount || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Amount and category ID are required" },
        { status: 400 }
      );
    }

    // Verify category ownership and existence
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: decoded.id, // Ensures the category belongs to the logged-in user
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found or unauthorized" },
        { status: 404 }
      );
    }

    // Calculate total spent in this category
    const totalSpent = await prisma.expense.aggregate({
      where: { categoryId, userId: decoded.id }, // Ensures only user's expenses are calculated
      _sum: { amount: true },
    });

    const totalAmountSpent = totalSpent._sum.amount || 0;
    const isOverLimit = totalAmountSpent + amount > (category.limit || 0);

    const newExpense = await prisma.expense.create({
      data: {
        userId: decoded.id,
        categoryId,
        amount,
        description,
        isOverLimit,
      },
    });

    return NextResponse.json(
      { success: true, newExpense, message: "Expense added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json(
      { success: false, message: "Error adding expense" },
      { status: 500 }
    );
  }
}
