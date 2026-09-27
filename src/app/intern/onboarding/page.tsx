"use client";

import { useEffect, useState } from "react";

interface OnboardingData {
    nickname: string;
    phone: string;
    emergencyContactName: string;
    emergencyContactRelation: string;
    emergencyContactPhone: string;
    university: string;
    major: string;
    department: string;
    expectedEndDate: string;
    healthNote: string;
}

export default function InternOnboardingPage() {
    const [submitted, setSubmitted] = useState<OnboardingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState<OnboardingData>({
        nickname: "",
        phone: "",
        emergencyContactName: "",
        emergencyContactRelation: "",
        emergencyContactPhone: "",
        university: "",
        major: "",
        department: "",
        expectedEndDate: "",
        healthNote: "",
    });

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/onboarding");
            const data = await res.json();
            if (res.ok && data.onboarding) {
                setSubmitted(data.onboarding.data);
            }
            setLoading(false);
        }
        load();
    }, []);

    function updateField(key: keyof OnboardingData, value: string) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSaving(true);

        const res = await fetch("/api/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        setSaving(false);

        if (!res.ok) {
            setError(data.error);
            return;
        }

        setSubmitted(data.onboarding.data);
    }

    if (loading) return <p>กำลังโหลด...</p>;

    if (submitted) {
        return (
            <div>
                <h1>ข้อมูล Onboarding ของคุณ</h1>
                <p>ชื่อเล่น: {submitted.nickname}</p>
                <p>เบอร์โทร: {submitted.phone}</p>
                <p>ผู้ติดต่อฉุกเฉิน: {submitted.emergencyContactName} ({submitted.emergencyContactRelation}) — {submitted.emergencyContactPhone}</p>
                <p>มหาวิทยาลัย: {submitted.university}</p>
                <p>สาขา: {submitted.major}</p>
                <p>แผนก/ทีมที่ฝึกงาน: {submitted.department}</p>
                <p>คาดว่าจะฝึกงานเสร็จ: {submitted.expectedEndDate}</p>
                {submitted.healthNote && <p>โรคประจำตัว/แพ้อาหาร: {submitted.healthNote}</p>}
            </div>
        );
    }

    return (
        <div>
            <h1>กรอกข้อมูล Onboarding (วันแรก)</h1>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <label>
                    ชื่อเล่น *
                    <input value={form.nickname} onChange={(e) => updateField("nickname", e.target.value)} required />
                </label>
                <label>
                    เบอร์โทรศัพท์ *
                    <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required />
                </label>
                <label>
                    ชื่อผู้ติดต่อฉุกเฉิน *
                    <input value={form.emergencyContactName} onChange={(e) => updateField("emergencyContactName", e.target.value)} required />
                </label>
                <label>
                    ความสัมพันธ์
                    <input value={form.emergencyContactRelation} onChange={(e) => updateField("emergencyContactRelation", e.target.value)} placeholder="เช่น บิดา, มารดา, พี่สาว" />
                </label>
                <label>
                    เบอร์โทรผู้ติดต่อฉุกเฉิน *
                    <input value={form.emergencyContactPhone} onChange={(e) => updateField("emergencyContactPhone", e.target.value)} required />
                </label>
                <label>
                    มหาวิทยาลัย
                    <input value={form.university} onChange={(e) => updateField("university", e.target.value)} />
                </label>
                <label>
                    สาขาวิชา
                    <input value={form.major} onChange={(e) => updateField("major", e.target.value)} />
                </label>
                <label>
                    แผนก/ทีมที่ฝึกงาน
                    <input value={form.department} onChange={(e) => updateField("department", e.target.value)} />
                </label>
                <label>
                    วันที่คาดว่าจะฝึกงานเสร็จ
                    <input type="date" value={form.expectedEndDate} onChange={(e) => updateField("expectedEndDate", e.target.value)} />
                </label>
                <label>
                    โรคประจำตัว/แพ้อาหาร (ถ้ามี)
                    <textarea value={form.healthNote} onChange={(e) => updateField("healthNote", e.target.value)} />
                </label>

                <button type="submit" disabled={saving}>บันทึกข้อมูล</button>
            </form>
        </div>
    );
}