import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const onboarding = await prisma.onboarding.findUnique({
        where: { userId: user.userId },
    });

    return NextResponse.json({ onboarding });
}

export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const existing = await prisma.onboarding.findUnique({
        where: { userId: user.userId },
    });

    if (existing) {
        return NextResponse.json(
            { error: "กรอกข้อมูล onboarding ไปแล้ว" },
            { status: 400 }
        );
    }

    const body = await request.json();

    const {
        nickname,
        phone,
        emergencyContactName,
        emergencyContactRelation,
        emergencyContactPhone,
        university,
        major,
        department,
        expectedEndDate,
        healthNote,
    } = body;

    if (!nickname || !phone || !emergencyContactName || !emergencyContactPhone) {
        return NextResponse.json(
            { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ" },
            { status: 400 }
        );
    }

    const onboarding = await prisma.onboarding.create({
        data: {
            userId: user.userId,
            data: {
                nickname,
                phone,
                emergencyContactName,
                emergencyContactRelation,
                emergencyContactPhone,
                university,
                major,
                department,
                expectedEndDate,
                healthNote,
            },
        },
    });

    return NextResponse.json({ onboarding });
}