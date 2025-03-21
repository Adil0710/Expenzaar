import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
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

    const categories = await prisma.category.findMany({
      where: { userId },
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
      const totalSpent = category.expenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
      );
      const remaining = category.limit - totalSpent;

      return {
        ...category,
        remaining,
      };
    });

    return NextResponse.json(
      { success: true, categories: updatedCategories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching categories" },
      { status: 500 }
    );
  }
}
