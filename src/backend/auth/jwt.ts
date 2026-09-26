import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "dev-secret-change-me"
);
const JWT_ALG = "HS256";
const JWT_EXPIRES_IN = "7d"; // token หมดอายุใน 7 วัน

export type UserRole = "admin" | "intern";

export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}

/**
 * สร้าง JWT token หลังจาก login สำเร็จ
 */
export async function signToken(payload: JwtPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: JWT_ALG })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(JWT_SECRET);
}

/**
 * ตรวจสอบและถอดรหัส JWT token
 * คืนค่า payload ถ้า token ถูกต้อง, คืนค่า null ถ้าไม่ถูกต้อง/หมดอายุ
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JwtPayload;
    } catch {
        return null;
    }
}