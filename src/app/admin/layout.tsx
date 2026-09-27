import AppShell, { NavItem } from "@frontend/AppShell";

const adminNavItems: NavItem[] = [
    { label: "แดชบอร์ด", href: "/admin" },
    { label: "จัดการนักศึกษาฝึกงาน", href: "/admin/interns" },
    { label: "อนุมัติการลา", href: "/admin/leave-requests" },
    { label: "มอบหมายงาน", href: "/admin/calendar" },
    { label: "Onboarding", href: "/admin/onboarding" },
    { label: "จัดการวันหยุด", href: "/admin/holidays" },
    { label: "รายงานสรุป", href: "/admin/reports" },
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