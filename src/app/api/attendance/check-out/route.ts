import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
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

    if (!existing?.checkIn) {
        return NextResponse.json(
            { error: "ยังไม่ได้เช็คอินวันนี้" },
            { status: 400 }
        );
    }

    if (existing.checkOut) {
        return NextResponse.json(
            { error: "เช็คเอาท์วันนี้ไปแล้ว" },
            { status: 400 }
        );
    }

    const attendance = await prisma.attendance.update({
        where: { userId_date: { userId: user.userId, date } },
        data: { checkOut: new Date() },
    });

    return NextResponse.json({ attendance });
}