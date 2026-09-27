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
    if (user.role !== "admin") {
        return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
    }

    const { id } = await params;
    const { status, adminNote } = await request.json();

    if (!["approved", "rejected"].includes(status)) {
        return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const leaveRequest = await prisma.leaveRequest.update({
        where: { id },
        data: { status, adminNote },
    });

    return NextResponse.json({ leaveRequest });
}