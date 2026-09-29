"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
                setLoading(false);
                return;
            }

            router.push(data.role === "admin" ? "/admin" : "/intern");
        } catch {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg)",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "var(--card)",
                    padding: "40px",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow)",
                    width: "360px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <h1 style={{ color: "var(--indigo)", fontSize: "22px" }}>
                    เข้าสู่ระบบ
                </h1>
                <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "-8px" }}>
                    HR Attendance System
                </p>

                {error && (
                    <div
                        style={{
                            background: "var(--red-soft)",
                            color: "var(--red-text)",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            border: "1px solid var(--red-border)",
                        }}
                    >
                        {error}
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", color: "var(--text)" }}>อีเมล</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            fontSize: "14px",
                            fontFamily: "var(--font-sans)",
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", color: "var(--text)" }}>รหัสผ่าน</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            fontSize: "14px",
                            fontFamily: "var(--font-sans)",
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "var(--indigo-gradient)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginTop: "8px",
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </button>
                <p style={{ textAlign: "center", marginTop: "12px" }}>
                    ยังไม่มีบัญชี?{" "}
                    <Link href="/register" className="auth-link">สมัครสมาชิก</Link>
                </p>
            </form>
        </div>
    );
}