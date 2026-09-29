import AppShell, { NavItem } from "@frontend/AppShell";
import { HomeIcon, UsersIcon, ChartIcon, DocIcon, CalendarStarIcon } from "@frontend/icons";

const adminNavItems: NavItem[] = [
    { label: "แดชบอร์ด", href: "/admin", icon: <HomeIcon /> },
    { label: "จัดการนักศึกษาฝึกงาน", href: "/admin/interns", icon: <UsersIcon /> },
    { label: "อนุมัติการลา", href: "/admin/leave-requests", icon: <ChartIcon /> },
    { label: "มอบหมายงาน", href: "/admin/calendar", icon: <DocIcon /> },
    { label: "Onboarding", href: "/admin/onboarding", icon: <CalendarStarIcon /> },
    { label: "จัดการวันหยุด", href: "/admin/holidays", icon: <CalendarStarIcon /> },
    { label: "รายงานสรุป", href: "/admin/reports", icon: <ChartIcon /> },
    { label: "คำขอสมัครสมาชิก", href: "/admin/registrations", icon: <UsersIcon /> },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: ดึงชื่อผู้ใช้จริงจาก session/token แทนค่า placeholder นี้
    return (
        <AppShell navItems={adminNavItems} userName="Admin User" userRole="admin">
            {children}
        </AppShell>
    );
}