import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/backend/auth/session";

const prisma = new PrismaClient();

function todayDateOnly(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function POST() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const date = todayDateOnly();

    const existing = await prisma.attendance.findUnique({
        where: { userId_date: { userId: user.userId, date } },
    });

    if (existing?.checkIn) {
        return NextResponse.json(
            { error: "เช็คอินวันนี้ไปแล้ว" },
            { status: 400 }
        );
    }

    const attendance = await prisma.attendance.upsert({
        where: { userId_date: { userId: user.userId, date } },
        update: { checkIn: new Date() },
        create: { userId: user.userId, date, checkIn: new Date() },
    });

    return NextResponse.json({ attendance });
}