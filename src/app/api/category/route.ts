import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request) {
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

    const categories = await prisma.category.findMany({
      where: { userId: decoded.id },
      select: {
        id: true,
        name: true,
        limit: true,
        expenses: {
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          select: { amount: true },
        },
      },
      orderBy: { name: "asc" },
    });
    
    // Add remaining balance calculation
    const updatedCategories = categories.map((category) => {
      const totalSpent = category.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const remaining = Math.max(category.limit - totalSpent, 0);
    
      return {
        ...category,
        remaining,
      };
    });
    
    return NextResponse.json({ success: true, categories: updatedCategories }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching categories" },
      { status: 500 }
    );
  }
}
