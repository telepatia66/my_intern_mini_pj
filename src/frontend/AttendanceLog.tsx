"use client";

import { useEffect, useState } from "react";

interface Log {
    id: string;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    user: { name: string };
}

function fmtTime(iso: string | null) {
    return iso
        ? new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
        : "-";
}

function isLate(iso: string | null) {
    if (!iso) return false;
    const d = new Date(iso);
    return d.getHours() > 9 || (d.getHours() === 9 && d.getMinutes() > 30);
}

export default function AttendanceLog() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/attendance/log");
            const data = await res.json();
            if (res.ok) setLogs(data.logs);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div>
            <h2>ประวัติการเข้า-ออกงานล่าสุด</h2>
            <div
                style={{
                    maxHeight: "360px",
                    overflowY: "auto",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                }}
            >
                <table style={{ width: "100%" }}>
                    <thead style={{ position: "sticky", top: 0, background: "var(--card)" }}>
                        <tr>
                            <th>ชื่อ</th>
                            <th>วันที่</th>
                            <th>เข้างาน</th>
                            <th>ออกงาน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan={4}>กำลังโหลด...</td></tr>
                        )}
                        {!loading && logs.length === 0 && (
                            <tr><td colSpan={4}>ยังไม่มีข้อมูล</td></tr>
                        )}
                        {logs.map((l) => (
                            <tr key={l.id}>
                                <td>{l.user.name}</td>
                                <td>{new Date(l.date).toLocaleDateString("th-TH")}</td>
                                <td>
                                    {fmtTime(l.checkIn)}
                                    {isLate(l.checkIn) && <span style={{ color: "red" }}> (สาย)</span>}
                                </td>
                                <td>{fmtTime(l.checkOut)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}