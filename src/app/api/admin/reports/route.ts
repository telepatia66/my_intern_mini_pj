import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@backend/auth/session";

const prisma = new PrismaClient();

const STANDARD_CHECKIN_HOUR = 9;
const STANDARD_CHECKIN_MINUTE = 30;

function isLate(checkIn: Date): boolean {
    const h = checkIn.getHours();
    const m = checkIn.getMinutes();
    return h > STANDARD_CHECKIN_HOUR || (h === STANDARD_CHECKIN_HOUR && m > STANDARD_CHECKIN_MINUTE);
}

function sameDate(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export async function GET(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }
    if (user.role !== "admin") {
        return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);

    // ดึงวันหยุดนักขัตฤกษ์ในเดือนนี้
    const holidays = await prisma.holiday.findMany({
        where: { date: { gte: monthStart, lte: monthEnd } },
    });

    // นับวันทำงาน = จันทร์-ศุกร์ ที่ไม่ใช่วันหยุดนักขัตฤกษ์
    const daysInMonth = new Date(year, month, 0).getDate();
    let totalWeekdays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
        const current = new Date(year, month - 1, d);
        const day = current.getDay();
        const isWeekend = day === 0 || day === 6;
        const isHoliday = holidays.some((h) => sameDate(h.date, current));
        if (!isWeekend && !isHoliday) totalWeekdays++;
    }

    const interns = await prisma.user.findMany({
        where: { role: "intern" },
        select: { id: true, name: true, email: true },
    });

    const report = await Promise.all(
        interns.map(async (intern) => {
            const attendances = await prisma.attendance.findMany({
                where: {
                    userId: intern.id,
                    date: { gte: monthStart, lte: monthEnd },
                },
            });

            const leaveRequests = await prisma.leaveRequest.findMany({
                where: {
                    userId: intern.id,
                    status: "approved",
                    startDate: { lte: monthEnd },
                    endDate: { gte: monthStart },
                },
            });

            const presentDays = attendances.filter((a) => a.checkIn).length;
            const lateCount = attendances.filter((a) => a.checkIn && isLate(a.checkIn)).length;

            let leaveDays = 0;
            for (const lr of leaveRequests) {
                const start = lr.startDate < monthStart ? monthStart : lr.startDate;
                const end = lr.endDate > monthEnd ? monthEnd : lr.endDate;
                const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                leaveDays += Math.max(diffDays, 0);
            }

            const absentDays = Math.max(totalWeekdays - presentDays - leaveDays, 0);

            return {
                internId: intern.id,
                name: intern.name,
                email: intern.email,
                presentDays,
                absentDays,
                leaveDays,
                lateCount,
            };
        })
    );

    return NextResponse.json({ year, month, totalWeekdays, holidayCount: holidays.length, report });
}