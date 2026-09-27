import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!["open", "done"].includes(status)) {
        return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const task = await prisma.task.update({
        where: { id },
        data: { status },
    });

    return NextResponse.json({ task });
}