import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

interface DecodedToken {
  id: string;
}

interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
    limit: number;
  };
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
      where: {
        userId: decoded.id,
      },
      include: {
        category: {
          select: {
            name: true,
            limit: true,
          },
        },
      },
      orderBy: { createdAt: "desc" } // Oldest first for correct cumulative total
    });

    if (!expenses.length) {
      return NextResponse.json(
        { success: false, message: "No expenses found" },
        { status: 404 }
      );
    }

    // Group expenses by month and category
    const categorySpent: Record<string, Record<string, number>> = {};

    const updatedExpenses = expenses.map((expense) => {
      const monthKey = new Date(expense.createdAt).toISOString().slice(0, 7); // e.g., "2025-04"
      const categoryName = expense.category.name;

      // Initialize month & category if not present
      if (!categorySpent[monthKey]) {
        categorySpent[monthKey] = {};
      }

      // Calculate cumulative totalSpent
      categorySpent[monthKey][categoryName] =
        (categorySpent[monthKey][categoryName] || 0) + expense.amount;

      return {
        ...expense,
        totalSpent: categorySpent[monthKey][categoryName],
        isOverLimit: categorySpent[monthKey][categoryName] > expense.category.limit
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
