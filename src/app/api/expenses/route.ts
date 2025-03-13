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

    const expenses = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        expenses: {
          select: {
            id: true,
            category: true,
            amount: true,
            createdAt: true,
            updatedAt: true,
            description: true,
          },
        },
      },
    });

    if (!expenses) {
      return NextResponse.json(
        { success: false, message: "Expenses not found" },
        { status: 404 }
      );
    }

    const { expenses: userExpenses } = expenses;
    return NextResponse.json(
      { success: true, userExpenses, message: "Expenses fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error getting expenses" },
      { status: 500 }
    );
  }
}
