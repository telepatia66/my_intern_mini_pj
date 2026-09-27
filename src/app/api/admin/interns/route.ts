import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { hashPassword } from "@backend/auth/password";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user) return { error: "กรุณาเข้าสู่ระบบ", status: 401 as const };
    if (user.role !== "admin") return { error: "ไม่มีสิทธิ์เข้าถึง", status: 403 as const };
    return { user };
}

export async function GET() {
    const check = await requireAdmin();
    if ("error" in check) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const interns = await prisma.user.findMany({
        where: { role: "intern" },
        select: { id: true, email: true, name: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ interns });
}

export async function POST(request: NextRequest) {
    const check = await requireAdmin();
    if ("error" in check) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { email, name, password } = await request.json();

    if (!email || !name || !password) {
        return NextResponse.json(
            { error: "กรุณากรอกข้อมูลให้ครบ" },
            { status: 400 }
        );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json(
            { error: "อีเมลนี้มีผู้ใช้อยู่แล้ว" },
            { status: 400 }
        );
    }

    const passwordHash = await hashPassword(password);

    const intern = await prisma.user.create({
        data: { email, name, passwordHash, role: "intern" },
        select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({ intern });
}