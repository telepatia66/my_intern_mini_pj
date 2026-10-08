import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }
    if (user.role !== "admin") {
        return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
    }

    const interns = await prisma.user.findMany({
        where: { role: "intern" },
        select: {
            id: true,
            name: true,
            email: true,
            onboarding: true,
        },
        orderBy: { name: "asc" },
    });

    return NextResponse.json({ interns });
}