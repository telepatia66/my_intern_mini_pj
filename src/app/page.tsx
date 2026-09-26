export default function Home() {
  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{ color: "var(--indigo)" }}>ทดสอบธีม HR Attendance</h1>
      <p style={{ color: "var(--text)" }}>
        ถ้าเห็นข้อความนี้เป็นฟอนต์ไทยมนๆ (IBM Plex Sans Thai Looped)
        และหัวข้อด้านบนเป็นสีม่วง แปลว่า tokens.css และฟอนต์ทำงานถูกต้องแล้ว
      </p>
      <button
        style={{
          background: "var(--indigo)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "var(--radius)",
          border: "none",
          marginTop: "16px",
        }}
      >
        ปุ่มทดสอบ
      </button>
    </main>
  );
}