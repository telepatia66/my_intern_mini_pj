import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const logs = await prisma.attendance.findMany({
        // ถ้าอยากให้ intern เห็นเฉพาะของตัวเอง ให้เปิดบรรทัดนี้:
        // where: user.role === "intern" ? { userId: user.userId } : {},
        include: { user: { select: { name: true } } },
        orderBy: [{ date: "desc" }, { checkIn: "desc" }],
        take: 100,
    });

    return NextResponse.json({ logs });
}