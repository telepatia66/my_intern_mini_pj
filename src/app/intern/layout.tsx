import AppShell, { NavItem } from "@frontend/AppShell";
import { HomeIcon, ChartIcon, DocIcon, CalendarStarIcon } from "@frontend/icons";

const internNavItems: NavItem[] = [
    { label: "หน้าแรก", href: "/intern", icon: <HomeIcon /> },
    { label: "แจ้งลา", href: "/intern/leave", icon: <ChartIcon /> },
    { label: "งานที่ได้รับมอบหมาย", href: "/intern/calendar", icon: <DocIcon /> },
    { label: "Onboarding", href: "/intern/onboarding", icon: <CalendarStarIcon /> },
];

export default function InternLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: ดึงชื่อผู้ใช้จริงจาก session/token แทนค่า placeholder นี้
    return (
        <AppShell navItems={internNavItems} userName="Intern User" userRole="intern">
            {children}
        </AppShell>
    );
}