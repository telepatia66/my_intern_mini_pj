"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error);
            return;
        }

        setSuccess(true);
    }

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <h1>ส่งคำขอสมัครสมาชิกแล้ว</h1>
                    <p>กรุณารอแอดมินตรวจสอบและอนุมัติคำขอ เมื่อได้รับการอนุมัติแล้วสามารถเข้าสู่ระบบได้ทันที</p>
                    <Link href="/login" className="auth-link">กลับไปหน้าเข้าสู่ระบบ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>สมัครสมาชิก</h1>
                {error && <p style={{ color: "var(--red-text)" }}>{error}</p>}

                <label>
                    ชื่อ-นามสกุล
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    อีเมล
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    รหัสผ่าน
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </label>

                <button type="submit" disabled={loading}>ส่งคำขอสมัคร</button>

                <p style={{ textAlign: "center", marginTop: "8px" }}>
                    มีบัญชีอยู่แล้ว?{" "}
                    <Link href="/login" className="auth-link">เข้าสู่ระบบ</Link>
                </p>
            </form>
        </div>
    );
}