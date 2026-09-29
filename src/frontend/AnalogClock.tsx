"use client";

import { useEffect, useState } from "react";

export default function AnalogClock() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!now) {
        // ป้องกัน hydration mismatch — ยังไม่ render จนกว่าจะอยู่ฝั่ง client
        return <div style={{ width: "180px", height: "180px" }} />;
    }

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourAngle = ((hours % 12) + minutes / 60) * 30;
    const minuteAngle = (minutes + seconds / 60) * 6;
    const secondAngle = seconds * 6;

    const timeText = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <svg viewBox="0 0 200 200" width="170" height="170">
                <defs>
                    <linearGradient id="clockHandGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7b4bff" />
                        <stop offset="100%" stopColor="#5a2fe0" />
                    </linearGradient>
                </defs>

                {/* หน้าปัด */}
                <circle cx="100" cy="100" r="72" fill="var(--clock-face)" stroke="var(--clock-ring)" strokeWidth="10" />

                {/* ขีดบอกชั่วโมง 12 ตำแหน่ง */}
                {Array.from({ length: 12 }).map((_, i) => {
                    const angle = i * 30;
                    return (
                        <line
                            key={i}
                            x1="100"
                            y1="34"
                            x2="100"
                            y2={i % 3 === 0 ? "42" : "38"}
                            stroke="var(--muted)"
                            strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                            strokeLinecap="round"
                            transform={`rotate(${angle} 100 100)`}
                        />
                    );
                })}

                {/* เข็มชั่วโมง */}
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="68"
                    stroke="url(#clockHandGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    transform={`rotate(${hourAngle} 100 100)`}
                />

                {/* เข็มนาที */}
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="50"
                    stroke="url(#clockHandGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform={`rotate(${minuteAngle} 100 100)`}
                />

                {/* เข็มวินาที */}
                <line
                    x1="100"
                    y1="112"
                    x2="100"
                    y2="42"
                    stroke="var(--indigo)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    transform={`rotate(${secondAngle} 100 100)`}
                    opacity="0.75"
                />

                <circle cx="100" cy="100" r="5" fill="#5a2fe0" />
            </svg>

            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.5px" }}>
                {timeText}
            </div>
        </div>
    );
}