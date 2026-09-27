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
    user: { name: string; email: string };
}

export default function AdminLeaveRequestsPage() {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);

    async function loadRequests() {
        const res = await fetch("/api/admin/leave-requests");
        const data = await res.json();
        if (res.ok) setRequests(data.leaveRequests);
    }

    useEffect(() => {
        loadRequests();
    }, []);

    async function handleDecision(id: string, status: "approved" | "rejected") {
        const adminNote = prompt("หมายเหตุ (ถ้ามี):") ?? "";
        await fetch(`/api/admin/leave-requests/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, adminNote }),
        });
        await loadRequests();
    }

    const statusLabel: Record<string, string> = {
        pending: "รออนุมัติ",
        approved: "อนุมัติแล้ว",
        rejected: "ปฏิเสธ",
    };

    return (
        <div>
            <h1>อนุมัติการลา</h1>
            <table>
                <thead>
                    <tr>
                        <th>ผู้ขอ</th>
                        <th>วันที่</th>
                        <th>ประเภท</th>
                        <th>เหตุผล</th>
                        <th>สถานะ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => (
                        <tr key={r.id}>
                            <td>{r.user.name} ({r.user.email})</td>
                            <td>
                                {new Date(r.startDate).toLocaleDateString("th-TH")} - {new Date(r.endDate).toLocaleDateString("th-TH")}
                            </td>
                            <td>{r.type}</td>
                            <td>{r.reason}</td>
                            <td>{statusLabel[r.status]}</td>
                            <td>
                                {r.status === "pending" && (
                                    <>
                                        <button onClick={() => handleDecision(r.id, "approved")}>อนุมัติ</button>
                                        <button onClick={() => handleDecision(r.id, "rejected")}>ปฏิเสธ</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}