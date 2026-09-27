"use client";

import { useEffect, useState } from "react";

interface Intern {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export default function InternsPage() {
    const [interns, setInterns] = useState<Intern[]>([]);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function loadInterns() {
        const res = await fetch("/api/admin/interns");
        const data = await res.json();
        if (res.ok) setInterns(data.interns);
    }

    useEffect(() => {
        loadInterns();
    }, []);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/admin/interns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, password }),
        });
        const data = await res.json();

        setLoading(false);

        if (!res.ok) {
            setError(data.error);
            return;
        }

        setEmail("");
        setName("");
        setPassword("");
        await loadInterns();
    }

    async function handleDelete(id: string) {
        if (!confirm("ยืนยันการลบ intern คนนี้?")) return;
        await fetch(`/api/admin/interns/${id}`, { method: "DELETE" });
        await loadInterns();
    }

    return (
        <div>
            <h1>จัดการนักศึกษาฝึกงาน</h1>

            <form onSubmit={handleAdd}>
                <h2>เพิ่มนักศึกษาฝึกงานใหม่</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input
                    type="text"
                    placeholder="ชื่อ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="อีเมล"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="รหัสผ่านเริ่มต้น"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    เพิ่ม
                </button>
            </form>

            <h2>รายชื่อนักศึกษาฝึกงาน</h2>
            <table>
                <thead>
                    <tr>
                        <th>ชื่อ</th>
                        <th>อีเมล</th>
                        <th>วันที่เพิ่ม</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {interns.map((i) => (
                        <tr key={i.id}>
                            <td>{i.name}</td>
                            <td>{i.email}</td>
                            <td>{new Date(i.createdAt).toLocaleDateString("th-TH")}</td>
                            <td>
                                <button onClick={() => handleDelete(i.id)}>ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}