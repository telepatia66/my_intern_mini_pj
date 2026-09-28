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

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
        return NextResponse.json(
            { error: "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มลา" },
            { status: 400 }
        );
    }

    const leaveRequest = await prisma.leaveRequest.create({
        data: { userId: user.userId, startDate: start, endDate: end, type, reason },
    });

    return NextResponse.json({ leaveRequest });
}