import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
        where: {
            OR: [{ assignedTo: user.userId }, { assignedTo: null }],
        },
        orderBy: { dueDate: "asc" },
    });

    return NextResponse.json({ tasks });
}