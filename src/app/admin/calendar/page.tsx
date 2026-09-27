"use client";

import { useEffect, useState } from "react";

interface Task {
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    assignedTo: string | null;
    status: string;
}

export default function AdminCalendarPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function loadTasks() {
        const res = await fetch("/api/admin/tasks");
        const data = await res.json();
        if (res.ok) setTasks(data.tasks);
    }

    useEffect(() => {
        loadTasks();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/admin/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, dueDate, assignedTo: null }),
        });
        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error);
            return;
        }

        setTitle("");
        setDescription("");
        setDueDate("");
        await loadTasks();
    }

    async function handleDelete(id: string) {
        if (!confirm("ยืนยันการลบงานนี้?")) return;
        await fetch(`/api/admin/tasks/${id}`, { method: "DELETE" });
        await loadTasks();
    }

    return (
        <div>
            <h1>ปฏิทิน/มอบหมายงาน</h1>

            <form onSubmit={handleSubmit}>
                <h2>มอบหมายงานใหม่ (ให้ intern ทุกคน)</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input
                    type="text"
                    placeholder="ชื่องาน"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="รายละเอียด (ถ้ามี)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label>
                    กำหนดส่ง
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>มอบหมายงาน</button>
            </form>

            <h2>งานทั้งหมด</h2>
            <table>
                <thead>
                    <tr>
                        <th>ชื่องาน</th>
                        <th>กำหนดส่ง</th>
                        <th>สถานะ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((t) => (
                        <tr key={t.id}>
                            <td>{t.title}</td>
                            <td>{new Date(t.dueDate).toLocaleDateString("th-TH")}</td>
                            <td>{t.status === "done" ? "เสร็จแล้ว" : "ยังไม่เสร็จ"}</td>
                            <td>
                                <button onClick={() => handleDelete(t.id)}>ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}