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

    const tasks = await prisma.task.findMany({
        orderBy: { dueDate: "asc" },
    });

    return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }
    if (user.role !== "admin") {
        return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
    }

    const { title, description, dueDate, assignedTo } = await request.json();

    if (!title || !dueDate) {
        return NextResponse.json(
            { error: "กรุณากรอกชื่องานและวันที่กำหนดส่ง" },
            { status: 400 }
        );
    }

    const task = await prisma.task.create({
        data: {
            title,
            description: description || null,
            dueDate: new Date(dueDate),
            assignedTo: assignedTo || null, // null = มอบหมายให้ทุกคน
            createdBy: user.userId,
        },
    });

    return NextResponse.json({ task });
}