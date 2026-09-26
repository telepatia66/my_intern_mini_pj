import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { verifyPassword } from "@backend/auth/password";
import { signToken } from "@backend/auth/jwt";
import { setSessionCookie } from "@backend/auth/session";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "กรุณากรอกอีเมลและรหัสผ่าน" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json(
                { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role as "admin" | "intern",
        });

        await setSessionCookie(token);

        return NextResponse.json({
            success: true,
            role: user.role,
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
            { status: 500 }
        );
    }
}