"use client";

import { useEffect, useState } from "react";

interface Holiday {
    id: string;
    date: string;
    name: string;
}

export default function AdminHolidaysPage() {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [date, setDate] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function loadHolidays() {
        const res = await fetch("/api/admin/holidays");
        const data = await res.json();
        if (res.ok) setHolidays(data.holidays);
    }

    useEffect(() => {
        loadHolidays();
    }, []);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/admin/holidays", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, name }),
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error);
            return;
        }

        setDate("");
        setName("");
        await loadHolidays();
    }

    async function handleDelete(id: string) {
        if (!confirm("ยืนยันการลบวันหยุดนี้?")) return;
        await fetch(`/api/admin/holidays/${id}`, { method: "DELETE" });
        await loadHolidays();
    }

    return (
        <div>
            <h1>จัดการวันหยุดนักขัตฤกษ์</h1>

            <form onSubmit={handleAdd}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <label>
                    วันที่
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
                <label>
                    ชื่อวันหยุด
                    <input
                        type="text"
                        placeholder="เช่น วันสงกรานต์"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>เพิ่มวันหยุด</button>
            </form>

            <h2>รายการวันหยุด</h2>
            <table>
                <thead>
                    <tr>
                        <th>วันที่</th>
                        <th>ชื่อวันหยุด</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {holidays.map((h) => (
                        <tr key={h.id}>
                            <td>{new Date(h.date).toLocaleDateString("th-TH")}</td>
                            <td>{h.name}</td>
                            <td>
                                <button onClick={() => handleDelete(h.id)}>ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}