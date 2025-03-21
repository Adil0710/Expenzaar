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
   

    const categoryId = resolvedParams.id;

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category exists and belongs to the logged-in user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: categoryId },
    });

    const categories = await prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true, limit: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      { success: true, message: "Category deleted successfully", categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting category" },
      { status: 500 }
    );
  }
}
