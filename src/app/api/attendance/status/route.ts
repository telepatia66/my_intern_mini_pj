import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@/backend/auth/session";

const prisma = new PrismaClient();

function todayDateOnly(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const date = todayDateOnly();

    const today = await prisma.attendance.findUnique({
        where: { userId_date: { userId: user.userId, date } },
    });

    const history = await prisma.attendance.findMany({
        where: { userId: user.userId },
        orderBy: { date: "desc" },
        take: 14,
    });

    return NextResponse.json({ today, history });
}