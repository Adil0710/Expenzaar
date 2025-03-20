import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface DecodedToken {
  id: string;
}

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token) as DecodedToken | string;
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const expenses = await prisma.expense.findMany({
      where: { userId: decoded.id },
      include: {
        category: {
          select: {
            name: true,
            limit: true,
          },
        },
      },
      orderBy: { createdAt: "asc" }, // Order by ascending to track cumulative total correctly
    });

    if (!expenses.length) {
      return NextResponse.json(
        { success: false, message: "No expenses found" },
        { status: 404 }
      );
    }

    // Calculate total spent for each month and category
    const categorySpent: Record<string, Record<string, number>> = {};

    expenses.forEach((expense) => {
      const monthKey = new Date(expense.createdAt).toISOString().slice(0, 7); // e.g., "2025-04"
      const categoryName = expense.category.name;

      if (!categorySpent[monthKey]) {
        categorySpent[monthKey] = {};
      }

      categorySpent[monthKey][categoryName] =
        (categorySpent[monthKey][categoryName] || 0) + expense.amount;
    });

    // Map expenses with correct `totalSpent` and `isOverLimit`
    const updatedExpenses = expenses.map((expense) => {
      const monthKey = new Date(expense.createdAt).toISOString().slice(0, 7);
      const categoryName = expense.category.name;

      const totalSpent = categorySpent[monthKey][categoryName] || 0;
      const isOverLimit = totalSpent > expense.category.limit;

      return {
        ...expense,
        totalSpent,
        isOverLimit,
      };
    });

    return NextResponse.json(
      { success: true, expenses: updatedExpenses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching expenses" },
      { status: 500 }
    );
  }
}
