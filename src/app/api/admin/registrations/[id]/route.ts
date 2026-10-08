import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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
    const { action } = await request.json(); // "approve" | "reject"

    const reg = await prisma.registrationRequest.findUnique({ where: { id } });
    if (!reg) {
        return NextResponse.json({ error: "ไม่พบคำขอนี้" }, { status: 404 });
    }
    if (reg.status !== "pending") {
        return NextResponse.json({ error: "คำขอนี้ถูกดำเนินการไปแล้ว" }, { status: 400 });
    }

    if (action === "approve") {
        await prisma.$transaction([
            prisma.user.create({
                data: {
                    name: reg.name,
                    email: reg.email,
                    passwordHash: reg.passwordHash,
                    role: "intern",
                },
            }),
            prisma.registrationRequest.update({
                where: { id },
                data: { status: "approved" },
            }),
        ]);
        return NextResponse.json({ success: true });
    }

    if (action === "reject") {
        await prisma.registrationRequest.update({
            where: { id },
            data: { status: "rejected" },
        });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "action ไม่ถูกต้อง" }, { status: 400 });
}