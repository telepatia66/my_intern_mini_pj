"use client";

import { useEffect, useState } from "react";

interface Attendance {
    id: string;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
}

export default function InternHomePage() {
    const [today, setToday] = useState<Attendance | null>(null);
    const [history, setHistory] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function loadStatus() {
        const res = await fetch("/api/attendance/status");
        const data = await res.json();
        if (res.ok) {
            setToday(data.today);
            setHistory(data.history);
        }
    }

    useEffect(() => {
        loadStatus();
    }, []);

    async function handleCheckIn() {
        setLoading(true);
        setError("");
        const res = await fetch("/api/attendance/check-in", { method: "POST" });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            setError(data.error);
            return;
        }
        await loadStatus();
    }

    async function handleCheckOut() {
        setLoading(true);
        setError("");
        const res = await fetch("/api/attendance/check-out", { method: "POST" });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            setError(data.error);
            return;
        }
        await loadStatus();
    }

    const timeFmt = (iso: string | null) =>
        iso ? new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : "-";

    return (
        <div>
            <h1>เช็คอิน-เอาท์วันนี้</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>
                เช็คอิน: {timeFmt(today?.checkIn ?? null)} | เช็คเอาท์: {timeFmt(today?.checkOut ?? null)}
            </p>

            {!today?.checkIn && (
                <button onClick={handleCheckIn} disabled={loading}>
                    เช็คอิน
                </button>
            )}

            {today?.checkIn && !today?.checkOut && (
                <button onClick={handleCheckOut} disabled={loading}>
                    เช็คเอาท์
                </button>
            )}

            {today?.checkIn && today?.checkOut && <p>วันนี้เช็คอิน-เอาท์ครบแล้ว</p>}

            <h2>ประวัติย้อนหลัง</h2>
            <ul>
                {history.map((h) => (
                    <li key={h.id}>
                        {new Date(h.date).toLocaleDateString("th-TH")} — เข้า {timeFmt(h.checkIn)} ออก {timeFmt(h.checkOut)}
                    </li>
                ))}
            </ul>
        </div>
    );
}