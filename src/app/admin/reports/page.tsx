"use client";

import { useEffect, useState } from "react";

interface ReportRow {
    internId: string;
    name: string;
    email: string;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    lateCount: number;
}

export default function AdminReportsPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [report, setReport] = useState<ReportRow[]>([]);
    const [totalWeekdays, setTotalWeekdays] = useState(0);
    const [loading, setLoading] = useState(false);

    async function loadReport() {
        setLoading(true);
        const res = await fetch(`/api/admin/reports?year=${year}&month=${month}`);
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
            setReport(data.report);
            setTotalWeekdays(data.totalWeekdays);
        }
    }

    useEffect(() => {
        loadReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, month]);

    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
    ];

    function handleExportCSV() {
        const header = ["ชื่อ", "อีเมล", "มาทำงาน (วัน)", "ขาด (วัน)", "ลา (วัน)", "มาสาย (ครั้ง)"];
        const rows = report.map((r) => [
            r.name,
            r.email,
            r.presentDays,
            r.absentDays,
            r.leaveDays,
            r.lateCount,
        ]);

        const csvContent = [header, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");

        // ใส่ BOM เพื่อให้ Excel เปิดภาษาไทยได้ถูกต้อง
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `report-${year}-${String(month).padStart(2, "0")}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function handleExportPDF() {
        window.print();
    }

    return (
        <div>
            <div className="no-print">
                <h1>รายงานสรุปรายเดือน</h1>

                <div>
                    <label>
                        เดือน
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                            {monthNames.map((m, idx) => (
                                <option key={idx} value={idx + 1}>{m}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        ปี (พ.ศ.)
                        <input
                            type="number"
                            value={year + 543}
                            onChange={(e) => setYear(Number(e.target.value) - 543)}
                        />
                    </label>
                </div>

                <div style={{ marginTop: "12px" }}>
                    <button onClick={handleExportCSV} disabled={report.length === 0}>
                        ดาวน์โหลด CSV
                    </button>
                    <button onClick={handleExportPDF} disabled={report.length === 0} style={{ marginLeft: "8px" }}>
                        ดาวน์โหลด PDF
                    </button>
                </div>
            </div>

            <div id="print-area">
                <h2 style={{ marginTop: "16px" }}>
                    รายงานประจำเดือน {monthNames[month - 1]} {year + 543}
                </h2>
                <p>จำนวนวันทำงานทั้งหมดในเดือนนี้: {totalWeekdays} วัน</p>

                {loading ? (
                    <p>กำลังโหลด...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ชื่อ</th>
                                <th>มาทำงาน (วัน)</th>
                                <th>ขาด (วัน)</th>
                                <th>ลา (วัน)</th>
                                <th>มาสาย (ครั้ง)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((r) => (
                                <tr key={r.internId}>
                                    <td>{r.name}</td>
                                    <td>{r.presentDays}</td>
                                    <td>{r.absentDays}</td>
                                    <td>{r.leaveDays}</td>
                                    <td>{r.lateCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    aside,
                    header {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}