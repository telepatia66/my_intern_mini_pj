import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user) return { error: "กรุณาเข้าสู่ระบบ", status: 401 as const };
    if (user.role !== "admin") return { error: "ไม่มีสิทธิ์เข้าถึง", status: 403 as const };
    return { user };
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const check = await requireAdmin();
    if ("error" in check) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { id } = await params;
    const { name, email } = await request.json();

    const intern = await prisma.user.update({
        where: { id },
        data: { name, email },
        select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({ intern });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const check = await requireAdmin();
    if ("error" in check) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { id } = await params;
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
}