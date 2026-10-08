import { NextRequest, NextResponse } from "next/server";
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

    const holidays = await prisma.holiday.findMany({
        orderBy: { date: "asc" },
    });

    return NextResponse.json({ holidays });
}

export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }
    if (user.role !== "admin") {
        return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
    }

    const { date, name } = await request.json();

    if (!date || !name) {
        return NextResponse.json(
            { error: "กรุณากรอกวันที่และชื่อวันหยุด" },
            { status: 400 }
        );
    }

    const existing = await prisma.holiday.findUnique({ where: { date: new Date(date) } });
    if (existing) {
        return NextResponse.json(
            { error: "วันนี้ถูกเพิ่มเป็นวันหยุดไปแล้ว" },
            { status: 400 }
        );
    }

    const holiday = await prisma.holiday.create({
        data: { date: new Date(date), name },
    });

    return NextResponse.json({ holiday });
}