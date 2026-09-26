"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
    label: string;
    href: string;
    icon?: ReactNode;
}

interface AppShellProps {
    children: ReactNode;
    navItems: NavItem[];
    userName: string;
    userRole: "admin" | "intern";
}

export default function AppShell({
    children,
    navItems,
    userName,
    userRole,
}: AppShellProps) {
    const pathname = usePathname();

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: "260px",
                    background: "var(--surface-dark)",
                    color: "var(--text-on-dark)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px 16px",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "white",
                        marginBottom: "32px",
                        paddingLeft: "8px",
                    }}
                >
                    HR Attendance
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "10px 12px",
                                    borderRadius: "10px",
                                    color: isActive ? "white" : "var(--text-on-dark)",
                                    background: isActive
                                        ? "var(--indigo-gradient)"
                                        : "transparent",
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: "14px",
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: "auto", paddingTop: "24px" }}>
                    <div
                        style={{
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                            paddingTop: "16px",
                            fontSize: "13px",
                        }}
                    >
                        <div style={{ color: "white", fontWeight: 500 }}>{userName}</div>
                        <div style={{ color: "var(--indigo-on-dark)", marginTop: "2px" }}>
                            {userRole === "admin" ? "ผู้ดูแลระบบ" : "นักศึกษาฝึกงาน"}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Topbar */}
                <header
                    style={{
                        height: "64px",
                        background: "var(--card)",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: "0 24px",
                        boxShadow: "var(--shadow)",
                    }}
                >
                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            style={{
                                background: "var(--red-soft)",
                                color: "var(--red-text)",
                                border: "none",
                                borderRadius: "10px",
                                padding: "8px 16px",
                                fontSize: "13px",
                                fontWeight: 500,
                            }}
                        >
                            ออกจากระบบ
                        </button>
                    </form>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: "32px", background: "var(--bg)" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}