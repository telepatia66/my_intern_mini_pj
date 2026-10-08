import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@backend/auth/password";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json(
            { error: "กรุณากรอกข้อมูลให้ครบ" },
            { status: 400 }
        );
    }

    if (password.length < 6) {
        return NextResponse.json(
            { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
            { status: 400 }
        );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json(
            { error: "อีเมลนี้มีผู้ใช้อยู่แล้ว" },
            { status: 400 }
        );
    }

    const existingRequest = await prisma.registrationRequest.findUnique({ where: { email } });
    if (existingRequest) {
        return NextResponse.json(
            { error: "อีเมลนี้เคยส่งคำขอสมัครไปแล้ว รอแอดมินตรวจสอบ" },
            { status: 400 }
        );
    }

    const passwordHash = await hashPassword(password);

    await prisma.registrationRequest.create({
        data: { name, email, passwordHash },
    });

    return NextResponse.json({ success: true });
}