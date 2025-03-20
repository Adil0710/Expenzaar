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

    const { amount, categoryId, description } = await req.json();

    if (!amount || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Amount and category ID are required" },
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

    const totalSpent = await prisma.expense.aggregate({
      where: {
        categoryId,
        userId: decoded.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Filter for current month
        },
      },
      _sum: { amount: true },
    });

    const categoryLimit = Number(category.limit); // Ensure type conversion
    const totalAmountSpent = Number(totalSpent._sum.amount) || 0;
    const amountToAdd = Number(amount);

    const isOverLimit = categoryLimit
      ? totalAmountSpent + amountToAdd > categoryLimit
      : false;

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
