# HR Attendance System

ระบบลงเวลาเข้า-ออกงานสำหรับนักศึกษาฝึกงาน แยกบทบาทผู้ใช้เป็น 2 แบบ
คือ **admin** และ **intern** ครอบคลุมการเช็คอิน-เอาท์, แจ้งลา,
ปฏิทิน/มอบหมายงาน, บันทึก onboarding วันแรก และรายงานสรุปรายเดือน

> ⚠️ โปรเจกต์นี้ยังอยู่ระหว่างการพัฒนา (work in progress) ดูสถานะ
> ล่าสุดได้ที่หัวข้อ [สถานะโปรเจกต์](#-สถานะโปรเจกต์) ด้านล่าง

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | Next.js 16.3.5 (App Router), React 19.2.8, TypeScript |
| Styling | CSS variables ล้วน (ไม่ใช้ Tailwind) — ดู `src/frontend/styles/tokens.css` |
| ฟอนต์ | IBM Plex Sans Thai Looped (โหลดผ่าน Google Fonts) |
| Backend | Next.js API Routes |
| ORM | Prisma 6.19.3 (generator `prisma-client`) |
| Database | PostgreSQL ผ่าน Supabase |
| Auth | bcryptjs (hash password) + jose (JWT) |
| Deploy (แผน) | Vercel + Vercel Cron |

---

## 📋 Prerequisites

- Node.js (แนะนำเวอร์ชัน LTS ล่าสุด)
- npm
- บัญชี Supabase ที่มี PostgreSQL database พร้อมใช้งานแล้ว

---

## 🚀 เริ่มต้นใช้งาน (Setup)

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ (ห้าม commit ไฟล์นี้ขึ้น git
— อยู่ใน `.gitignore` แล้ว) ใส่ค่าดังนี้:

```env
# Connection ผ่าน pooler โหมด transaction (ใช้งานทั่วไป)
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/postgres?pgbouncer=true"

# Connection ตรง ใช้สำหรับ migrate เท่านั้น
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/postgres"

JWT_SECRET="<ตั้งค่า secret key สำหรับเซ็น JWT>"
```

คัดลอกค่าจริงได้จาก Supabase Dashboard → ปุ่ม **Connect → ORM →
Prisma**

### 3. Generate Prisma Client และ migrate ฐานข้อมูล

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Seed ข้อมูลทดสอบ (สร้าง user เริ่มต้น)

```bash
npx prisma db seed
```

จะได้ user ทดสอบ 2 คน:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | Admin@123 | admin |
| intern@test.com | Intern@123 | intern |

### 5. รัน dev server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000/login](http://localhost:3000/login)

---

## 📁 โครงสร้างโฟลเดอร์

```
attendance-app/
  prisma/
    schema.prisma          # Prisma schema
    prisma.config.ts        # Prisma config (generator ใหม่)
    seed.ts                 # สร้าง user ทดสอบ
  src/
    app/
      admin/                 # หน้าฝั่ง admin
      intern/                # หน้าฝั่ง intern
      login/                 # หน้า login
      api/
        auth/                 # API login/logout
      layout.tsx              # root layout
    backend/
      auth/                   # hash password, JWT, session
    frontend/
      AppShell.tsx             # sidebar + topbar ใช้ร่วมกัน
      styles/
        tokens.css              # design tokens
    generated/
      prisma/                 # auto-generated โดย prisma generate
                                (ห้ามแก้ไขเอง)
    proxy.ts                  # ตรวจสอบสิทธิ์เข้าถึงหน้า (คือ
                                middleware ของ Next.js 16)
```

---

## 🧰 คำสั่งที่ใช้บ่อย

```bash
npm run dev              # รัน dev server
npm run build             # build สำหรับ production
npx prisma studio          # เปิด GUI ดูข้อมูลในฐานข้อมูล
npx prisma migrate dev     # สร้าง/รัน migration ใหม่
npx prisma db seed         # รัน seed script ใหม่
```

---

## ⚠️ ข้อควรระวังสำคัญ

- **รันคำสั่งทุกตัวจากโฟลเดอร์ `attendance-app` เท่านั้น** อย่ารัน
  จากโฟลเดอร์แม่ ไม่งั้น `npx` อาจดึงแพ็กเกจเวอร์ชันผิดมาใช้
- import `PrismaClient` ต้องใช้ path `@/generated/prisma/client`
  เท่านั้น (ยกเว้น script ที่รันนอก Next.js bundler เช่น `seed.ts`
  ให้ใช้ relative path แทน)
- ต้องติดตั้ง `@prisma/client` ให้ตรงเวอร์ชันกับ `prisma` CLI เป๊ะๆ
  (`npm install @prisma/client@6.19.3`)
- `prisma.config.ts` ต้องมีทั้ง `url` และ `directUrl` ใน
  `datasource` block เสมอ ไม่งั้น migration จะล้มเหลว
- Tailwind CSS ถูกถอดออกจากโปรเจกต์แล้วโดยตั้งใจ — ใช้ CSS
  variables จาก `tokens.css` แทน

---

## 📊 สถานะโปรเจกต์

อัปเดตล่าสุด: 26 กันยายน 2569

| ขั้นตอน | สถานะ |
|---------|--------|
| Setup โปรเจกต์ + โครงสร้างโฟลเดอร์ | ✅ เสร็จ |
| เชื่อมต่อฐานข้อมูล (Prisma + Supabase) | ✅ เสร็จ |
| ระบบ Authentication (login/logout) | ✅ เสร็จ ทดสอบผ่านแล้ว |
| Design Token / Styling | ✅ เสร็จ |
| โครงหน้าเว็บหลัก (AppShell) | ✅ เสร็จ ทดสอบผ่านแล้ว |
| Seed script | ✅ เสร็จ |
| **Business Logic หลัก** (เช็คอิน-เอาท์, แจ้งลา, ปฏิทิน, onboarding, รายงาน) | ⏳ กำลังพัฒนา |
| ส่งอีเมลแจ้งเตือน | ❌ ยังไม่เริ่ม |
| Deploy ขึ้น Vercel | ❌ ยังไม่เริ่ม |
| ตั้งค่า Cron Job | ❌ ยังไม่เริ่ม |

---

## 📄 License

Internal project — ยังไม่ได้กำหนด license