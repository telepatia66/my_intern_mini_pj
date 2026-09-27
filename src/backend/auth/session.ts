import { cookies } from "next/headers";
import { verifyToken, type JwtPayload } from "./jwt";

const COOKIE_NAME = "token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 วัน

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: MAX_AGE,
        path: "/",
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * อ่าน token จาก cookie แล้วตรวจสอบ คืนค่า payload ถ้า login อยู่
 * คืนค่า null ถ้าไม่ได้ login หรือ token หมดอายุ/ไม่ถูกต้อง
 */
export async function getCurrentUser(): Promise<JwtPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}