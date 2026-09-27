"use client";

import { useEffect, useState } from "react";

interface LeaveRequest {
    id: string;
    startDate: string;
    endDate: string;
    type: string;
    reason: string;
    status: string;
    adminNote: string | null;
}

export default function InternLeavePage() {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [type, setType] = useState("ลาป่วย");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function loadRequests() {
        const res = await fetch("/api/leave");
        const data = await res.json();
        if (res.ok) setRequests(data.leaveRequests);
    }

    useEffect(() => {
        loadRequests();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/leave", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ startDate, endDate, type, reason }),
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error);
            return;
        }

        setStartDate("");
        setEndDate("");
        setReason("");
        await loadRequests();
    }

    const statusLabel: Record<string, string> = {
        pending: "รออนุมัติ",
        approved: "อนุมัติแล้ว",
        rejected: "ปฏิเสธ",
    };

    return (
        <div>
            <h1>แจ้งลา</h1>

            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <label>
                    วันที่เริ่มลา
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </label>
                <label>
                    วันที่สิ้นสุด
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </label>
                <label>
                    ประเภทการลา
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="ลาป่วย">ลาป่วย</option>
                        <option value="ลากิจ">ลากิจ</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                </label>
                <label>
                    เหตุผล
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
                </label>
                <button type="submit" disabled={loading}>ส่งคำขอลา</button>
            </form>

            <h2>ประวัติคำขอลา</h2>
            <table>
                <thead>
                    <tr>
                        <th>วันที่</th>
                        <th>ประเภท</th>
                        <th>เหตุผล</th>
                        <th>สถานะ</th>
                        <th>หมายเหตุจาก admin</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => (
                        <tr key={r.id}>
                            <td>
                                {new Date(r.startDate).toLocaleDateString("th-TH")} - {new Date(r.endDate).toLocaleDateString("th-TH")}
                            </td>
                            <td>{r.type}</td>
                            <td>{r.reason}</td>
                            <td>{statusLabel[r.status]}</td>
                            <td>{r.adminNote ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}