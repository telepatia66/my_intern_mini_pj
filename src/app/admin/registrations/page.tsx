"use client";

import { useEffect, useState } from "react";

interface Reg {
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
}

export default function AdminRegistrationsPage() {
    const [requests, setRequests] = useState<Reg[]>([]);

    async function load() {
        const res = await fetch("/api/admin/registrations");
        const data = await res.json();
        if (res.ok) setRequests(data.requests);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleAction(id: string, action: "approve" | "reject") {
        await fetch(`/api/admin/registrations/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        await load();
    }

    const statusLabel: Record<string, string> = {
        pending: "รออนุมัติ",
        approved: "อนุมัติแล้ว",
        rejected: "ปฏิเสธ",
    };

    return (
        <div>
            <h1>คำขอสมัครสมาชิก</h1>
            <table>
                <thead>
                    <tr>
                        <th>ชื่อ</th>
                        <th>อีเมล</th>
                        <th>วันที่ส่งคำขอ</th>
                        <th>สถานะ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => (
                        <tr key={r.id}>
                            <td>{r.name}</td>
                            <td>{r.email}</td>
                            <td>{new Date(r.createdAt).toLocaleDateString("th-TH")}</td>
                            <td>{statusLabel[r.status]}</td>
                            <td>
                                {r.status === "pending" && (
                                    <>
                                        <button onClick={() => handleAction(r.id, "approve")}>อนุมัติ</button>
                                        <button onClick={() => handleAction(r.id, "reject")}>ปฏิเสธ</button>
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