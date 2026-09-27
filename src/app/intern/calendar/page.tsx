"use client";

import { useEffect, useState } from "react";

interface Task {
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    status: string;
}

export default function InternCalendarPage() {
    const [tasks, setTasks] = useState<Task[]>([]);

    async function loadTasks() {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (res.ok) setTasks(data.tasks);
    }

    useEffect(() => {
        loadTasks();
    }, []);

    async function handleMarkDone(id: string) {
        await fetch(`/api/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "done" }),
        });
        await loadTasks();
    }

    return (
        <div>
            <h1>งานที่ได้รับมอบหมาย</h1>
            <ul>
                {tasks.map((t) => (
                    <li key={t.id}>
                        <strong>{t.title}</strong> — กำหนดส่ง{" "}
                        {new Date(t.dueDate).toLocaleDateString("th-TH")}
                        {t.description && <p>{t.description}</p>}
                        <p>สถานะ: {t.status === "done" ? "เสร็จแล้ว" : "ยังไม่เสร็จ"}</p>
                        {t.status !== "done" && (
                            <button onClick={() => handleMarkDone(t.id)}>ทำเสร็จแล้ว</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}