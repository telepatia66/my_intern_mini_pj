import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * เข้ารหัส (hash) รหัสผ่านก่อนเก็บลงฐานข้อมูล
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * ตรวจสอบรหัสผ่านที่กรอกเข้ามา กับรหัสผ่านที่ hash ไว้ในฐานข้อมูล
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}