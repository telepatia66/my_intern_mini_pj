import AppShell, { NavItem } from "@frontend/AppShell";

const internNavItems: NavItem[] = [
    { label: "หน้าแรก", href: "/intern" },
    { label: "เช็คอิน-เอาท์", href: "/intern/attendance" },
    { label: "แจ้งลา", href: "/intern/leave" },
    { label: "งานที่ได้รับมอบหมาย", href: "/intern/tasks" },
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