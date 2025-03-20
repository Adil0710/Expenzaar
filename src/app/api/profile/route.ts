import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    // First, try NextAuth session (for web)
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (user) {
        return NextResponse.json({ success: true, user });
      }
    }

    // If no session, try JWT token (for mobile)
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (token) {
      const decoded = verifyToken(token);

      if (!decoded || typeof decoded === "string") {
        return NextResponse.json(
          { success: false, message: "Invalid token" },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (user) {
        return NextResponse.json({ success: true, user });
      }
    }

    // If both session and token are missing or invalid
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error getting profile" },
      { status: 500 }
    );
  }
}
