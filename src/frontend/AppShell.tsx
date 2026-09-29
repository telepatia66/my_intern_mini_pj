"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon, LogoutIcon, BadgeIcon } from "./icons";

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
    const theme = userRole === "admin" ? "dark" : "light";

    return (
        <div data-theme={theme} style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
            {/* Sidebar — always dark, both themes */}
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
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "36px",
                        paddingLeft: "8px",
                    }}
                >
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "var(--indigo-gradient)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            boxShadow: "var(--badge-shadow)",
                        }}
                    >
                        <BadgeIcon />
                    </div>
                    <div style={{ fontSize: "19px", fontWeight: 700, color: "white" }}>
                        HR <span style={{ fontWeight: 400, opacity: 0.85 }}>Attendance</span>
                    </div>
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
                                    background: isActive ? "var(--indigo-gradient)" : "transparent",
                                    boxShadow: isActive ? "var(--badge-shadow)" : "none",
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: "14px",
                                    transition: "background 0.15s ease",
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
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "13px",
                        }}
                    >
                        <div
                            style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                flexShrink: 0,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-on-dark)" strokeWidth="2">
                                <circle cx="12" cy="8" r="3.5" />
                                <path d="M4.5 20c1-4 3.8-6 7.5-6s6.5 2 7.5 6" />
                            </svg>
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: "0",
                                    right: "0",
                                    width: "9px",
                                    height: "9px",
                                    borderRadius: "50%",
                                    background: "#22c55e",
                                    border: "2px solid var(--surface-dark)",
                                }}
                            />
                        </div>
                        <div>
                            <div style={{ color: "white", fontWeight: 500 }}>{userName}</div>
                            <div style={{ color: "var(--indigo-on-dark)", marginTop: "2px" }}>
                                {userRole === "admin" ? "ผู้ดูแลระบบ" : "นักศึกษาฝึกงาน"}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--page-bg)" }}>
                {/* Topbar */}
                <header
                    style={{
                        height: "72px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "12px",
                        padding: "0 32px",
                    }}
                >
                    <button
                        type="button"
                        aria-label="การแจ้งเตือน"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "var(--topbar-icon-bg)",
                            border: "1px solid var(--hero-card-border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text)",
                            position: "relative",
                            cursor: "pointer",
                        }}
                    >
                        <BellIcon />
                        <span
                            style={{
                                position: "absolute",
                                top: "8px",
                                right: "9px",
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "var(--indigo)",
                            }}
                        />
                    </button>

                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "var(--logout-bg)",
                                color: "var(--logout-text)",
                                border: "1px solid var(--logout-border)",
                                borderRadius: "12px",
                                padding: "10px 18px",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            <LogoutIcon />
                            ออกจากระบบ
                        </button>
                    </form>
                </header>

                {/* Page content */}
                <main className="app-main" style={{ flex: 1, padding: "8px 32px 32px" }}>{children}</main>
            </div>
        </div>
    );
}