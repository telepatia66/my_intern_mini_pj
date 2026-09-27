import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ leaveRequests });
}

export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { startDate, endDate, type, reason } = await request.json();

    if (!startDate || !endDate || !type || !reason) {
        return NextResponse.json(
            { error: "กรุณากรอกข้อมูลให้ครบ" },
            { status: 400 }
        );
    }

    const leaveRequest = await prisma.leaveRequest.create({
        data: {
            userId: user.userId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            type,
            reason,
        },
    });

    return NextResponse.json({ leaveRequest });
}