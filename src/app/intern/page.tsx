"use client";

import { useEffect, useState } from "react";
import AttendanceLog from "@frontend/AttendanceLog";
import AnalogClock from "@frontend/AnalogClock";

interface Attendance {
    id: string;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
}

export default function InternHomePage() {
    const [today, setToday] = useState<Attendance | null>(null);
    const [history, setHistory] = useState<Attendance[]>([]);
    const [showHistory, setShowHistory] = useState(false);
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
            <div className="hero-card">
                <div className="hero-left">
                    <div className="hero-badge">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
                            <path d="M3 9.5h18M9 14l2 2 4-4" />
                        </svg>
                    </div>

                    <h1 className="hero-title">เช็คอิน-เอาท์วันนี้</h1>

                    {error && <p style={{ color: "var(--red-text)", fontSize: "14px" }}>{error}</p>}

                    <div className="hero-meta">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 3" />
                        </svg>
                        <span>เช็คอิน: {timeFmt(today?.checkIn ?? null)}</span>
                        <span className="hero-divider">|</span>
                        <span>เช็คเอาท์: {timeFmt(today?.checkOut ?? null)}</span>
                    </div>

                    <p className="hero-status">
                        {!today?.checkIn && "ยังไม่ได้เช็คอินวันนี้"}
                        {today?.checkIn && !today?.checkOut && "เช็คอินแล้ว รอเช็คเอาท์"}
                        {today?.checkIn && today?.checkOut && "วันนี้เช็คอิน-เอาท์ครบแล้ว"}
                    </p>

                    {!today?.checkIn && (
                        <button className="hero-action" onClick={handleCheckIn} disabled={loading}>
                            เช็คอิน
                        </button>
                    )}
                    {today?.checkIn && !today?.checkOut && (
                        <button className="hero-action" onClick={handleCheckOut} disabled={loading}>
                            เช็คเอาท์
                        </button>
                    )}

                    <button className="hero-pill" onClick={() => setShowHistory((s) => !s)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M5 12l4 4 10-10" />
                        </svg>
                        ประวัติย้อนหลัง
                        <span style={{ marginLeft: "2px" }}>{showHistory ? "︿" : "﹀"}</span>
                    </button>

                    {showHistory && (
                        <ul className="hero-history">
                            {history.map((h) => (
                                <li key={h.id}>
                                    {new Date(h.date).toLocaleDateString("th-TH")} — เข้า {timeFmt(h.checkIn)} ออก {timeFmt(h.checkOut)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="hero-right">
                    <p className="hero-quote">
                        &ldquo; ทุกการเช็คอิน
                        <br />
                        คือก้าวเล็ก ๆ สู่เป้าหมายที่ใหญ่กว่า &rdquo;
                    </p>
                    <div className="clock-illustration">
                        <AnalogClock />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "28px" }}>
                <AttendanceLog />
            </div>

            <style jsx>{`
                .hero-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--hero-card-bg);
                    border: 1px solid var(--hero-card-border);
                    border-radius: 28px;
                    box-shadow: var(--hero-shadow);
                    padding: 40px 44px;
                    gap: 32px;
                    flex-wrap: wrap;
                }
                .hero-left {
                    max-width: 480px;
                }
                .hero-badge {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    background: var(--indigo-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--badge-shadow);
                    margin-bottom: 20px;
                }
                .hero-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text);
                    margin: 0 0 14px;
                }
                .hero-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--indigo-dark);
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 8px;
                }
                .hero-divider {
                    color: var(--muted);
                    margin: 0 2px;
                }
                .hero-status {
                    color: var(--muted);
                    font-size: 14px;
                    margin: 0 0 20px;
                }
                .hero-action {
                    background: var(--indigo-gradient);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 12px 28px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: var(--badge-shadow);
                    margin-right: 12px;
                    margin-bottom: 16px;
                }
                .hero-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .hero-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--pill-bg);
                    color: var(--pill-text);
                    border: 1px solid var(--pill-border);
                    border-radius: 999px;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .hero-history {
                    list-style: none;
                    padding: 0;
                    margin: 14px 0 0;
                    font-size: 13px;
                    color: var(--muted);
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .hero-history li::before {
                    content: "• ";
                    color: var(--indigo);
                }
                .hero-right {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    flex-shrink: 0;
                }
                .hero-quote {
                    color: var(--quote-color);
                    font-size: 13px;
                    text-align: center;
                    line-height: 1.6;
                    margin: 0;
                    max-width: 200px;
                }
                .clock-illustration {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
}