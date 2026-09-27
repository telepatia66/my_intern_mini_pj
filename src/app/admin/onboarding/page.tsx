"use client";

import { Fragment, useEffect, useState } from "react";

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

interface InternRow {
    id: string;
    name: string;
    email: string;
    onboarding: { data: OnboardingData } | null;
}

export default function AdminOnboardingPage() {
    const [interns, setInterns] = useState<InternRow[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/admin/onboarding");
            const data = await res.json();
            if (res.ok) setInterns(data.interns);
        }
        load();
    }, []);

    return (
        <div>
            <h1>สถานะ Onboarding</h1>
            <table>
                <thead>
                    <tr>
                        <th>ชื่อ</th>
                        <th>อีเมล</th>
                        <th>สถานะ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {interns.map((i) => (
                        <Fragment key={i.id}>
                            <tr key={i.id}>
                                <td>{i.name}</td>
                                <td>{i.email}</td>
                                <td>{i.onboarding ? "กรอกแล้ว" : "ยังไม่กรอก"}</td>
                                <td>
                                    {i.onboarding && (
                                        <button onClick={() => setExpanded(expanded === i.id ? null : i.id)}>
                                            {expanded === i.id ? "ซ่อน" : "ดูรายละเอียด"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                            {expanded === i.id && i.onboarding && (
                                <tr key={`${i.id}-detail`}>
                                    <td colSpan={4}>
                                        <p>ชื่อเล่น: {i.onboarding.data.nickname}</p>
                                        <p>เบอร์โทร: {i.onboarding.data.phone}</p>
                                        <p>ผู้ติดต่อฉุกเฉิน: {i.onboarding.data.emergencyContactName} ({i.onboarding.data.emergencyContactRelation}) — {i.onboarding.data.emergencyContactPhone}</p>
                                        <p>มหาวิทยาลัย: {i.onboarding.data.university}</p>
                                        <p>สาขา: {i.onboarding.data.major}</p>
                                        <p>แผนก/ทีม: {i.onboarding.data.department}</p>
                                        <p>คาดว่าจะฝึกงานเสร็จ: {i.onboarding.data.expectedEndDate}</p>
                                        {i.onboarding.data.healthNote && <p>โรคประจำตัว/แพ้อาหาร: {i.onboarding.data.healthNote}</p>}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}