# HR Attendance System

ระบบลงเวลาเข้า-ออกงานสำหรับนักศึกษาฝึกงาน แยกบทบาทผู้ใช้เป็น 2 แบบ
คือ **admin** และ **intern** ครอบคลุมการเช็คอิน-เอาท์, แจ้งลา,
ปฏิทิน/มอบหมายงาน, บันทึก onboarding วันแรก, รายงานสรุปรายเดือน
และระบบสมัครสมาชิกที่ต้องรอ admin อนุมัติก่อนถึงจะเข้าใช้งานได้

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

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)
— ระบบจะเด้งไปหน้า `/login` โดยอัตโนมัติถ้ายังไม่ได้เข้าสู่ระบบ

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
      admin/                 # หน้าฝั่ง admin (ธีมมืด)
        interns/               # จัดการนักศึกษาฝึกงาน
        leave-requests/        # อนุมัติการลา
        calendar/               # มอบหมายงาน
        onboarding/             # ดูสถานะ onboarding
        holidays/               # จัดการวันหยุดนักขัตฤกษ์
        reports/                # รายงานสรุปรายเดือน (+ export CSV/PDF)
        registrations/          # อนุมัติคำขอสมัครสมาชิก
      intern/                # หน้าฝั่ง intern (ธีมสว่าง)
        leave/                  # แจ้งลา
        calendar/               # งานที่ได้รับมอบหมาย
        onboarding/             # กรอกข้อมูลวันแรก
      login/                 # หน้า login
      register/              # หน้าสมัครสมาชิก (รอ admin อนุมัติ)
      api/
        auth/                   # login, logout, register
        admin/                  # API เฉพาะ admin ทั้งหมด
        attendance/             # check-in, check-out, status, log
        leave/                  # แจ้งลา (ฝั่ง intern)
        tasks/                  # งานที่ได้รับมอบหมาย (ฝั่ง intern)
        onboarding/             # onboarding (ฝั่ง intern)
      layout.tsx              # root layout (โหลดฟอนต์)
      page.tsx                 # หน้าแรก — redirect ตาม role/สถานะ login
    backend/
      auth/                   # hash password, JWT, session (getCurrentUser)
    frontend/
      AppShell.tsx             # sidebar + topbar ใช้ร่วมกัน (สลับธีมตาม role)
      AnalogClock.tsx           # นาฬิกาเข็มแบบ real-time
      AttendanceLog.tsx         # ตาราง log การเข้า-ออกงาน (ใช้ทั้ง 2 ฝั่ง)
      icons.tsx                 # ไอคอน SVG กลาง
      styles/
        tokens.css               # design tokens (สี, ฟอนต์, เงา, radius,
                                    ตัวแปรธีม light/dark)
    generated/
      prisma/                 # auto-generated โดย prisma generate
                                (ห้ามแก้ไขเอง)
    proxy.ts                  # ตรวจสอบสิทธิ์เข้าถึงหน้า (คือ
                                middleware ของ Next.js 16)
```

---

## 🎨 ระบบ Theme

หน้า **admin** ใช้ธีมมืด (dark navy + gradient ม่วง) และหน้า
**intern** ใช้ธีมสว่าง (ขาว-ลาเวนเดอร์อ่อน) โดย sidebar เป็นสีมืด
เหมือนกันทั้งสองฝั่งเพื่อรักษา brand identity ควบคุมผ่าน
`data-theme="dark"/"light"` ที่ `AppShell.tsx` เซ็ตอัตโนมัติตาม
`userRole` และตัวแปร CSS ใน `tokens.css`

ทุกหน้าใน `src/app/admin/*` และ `src/app/intern/*` ได้ style กลาง
จาก class `.app-main` (นิยามไว้ใน `globals.css`) โดยอัตโนมัติ
ครอบคลุม heading, form, table, list ไม่ต้องเขียน style เพิ่มเองใน
แต่ละหน้า เว้นแต่ต้องการ layout พิเศษเฉพาะหน้า

**เปลี่ยนฟอนต์:** แก้ 2 จุด — ลิงก์ Google Fonts ใน
`src/app/layout.tsx` และตัวแปร `--font-sans` ใน
`src/frontend/styles/tokens.css` (ต้องตรงชื่อกัน)

---

## 🔐 ระบบสมัครสมาชิก

ผู้ใช้ใหม่กรอกฟอร์มที่ `/register` → บันทึกเป็นคำขอรอตรวจสอบ (ยัง
login ไม่ได้) → admin เข้า `/admin/registrations` กดอนุมัติ/ปฏิเสธ
→ อนุมัติแล้วระบบจะสร้างบัญชี intern จริงให้อัตโนมัติ

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
- Path alias ของ backend/frontend คือ `@backend/...` และ
  `@frontend/...` (ไม่ใช่ `@/backend/...`)
- `page.tsx` กับ `route.ts` ห้ามอยู่โฟลเดอร์เดียวกันสำหรับ path
  เดียวกัน
- ทุกครั้งที่สร้างหน้าใหม่ ต้องอัปเดต `navItems` ใน
  `src/app/admin/layout.tsx` และ/หรือ `src/app/intern/layout.tsx`
  ด้วย และเช็ค `href` ให้ตรงกับ path ไฟล์จริงเป๊ะๆ
- Tailwind CSS ถูกถอดออกจากโปรเจกต์แล้วโดยตั้งใจ — ใช้ CSS
  variables จาก `tokens.css` แทน

---

## 📊 สถานะโปรเจกต์

อัปเดตล่าสุด: 29 กันยายน 2569

| ขั้นตอน | สถานะ |
|---------|--------|
| Setup โปรเจกต์ + โครงสร้างโฟลเดอร์ | ✅ เสร็จ |
| เชื่อมต่อฐานข้อมูล (Prisma + Supabase) | ✅ เสร็จ |
| ระบบ Authentication (login/logout) | ✅ เสร็จ ทดสอบผ่านแล้ว |
| Design Token / Styling + ระบบ Theme แยก role | ✅ เสร็จ |
| โครงหน้าเว็บหลัก (AppShell) | ✅ เสร็จ ทดสอบผ่านแล้ว |
| Seed script | ✅ เสร็จ |
| **Business Logic หลัก** (เช็คอิน-เอาท์, จัดการ intern, แจ้งลา, ปฏิทิน, onboarding, รายงาน, วันหยุดนักขัตฤกษ์) | ✅ เสร็จ ครบทุกฟีเจอร์ |
| ทดสอบระบบครบทุกฟีเจอร์ | ✅ เสร็จ |
| **ระบบสมัครสมาชิกแบบรออนุมัติ** | ✅ เขียนโค้ดเสร็จ ⏳ รอทดสอบจริง |
| ส่งอีเมลแจ้งเตือน | ❌ ยังไม่เริ่ม |
| Deploy ขึ้น Vercel | ❌ ยังไม่เริ่ม |
| ตั้งค่า Cron Job | ❌ ยังไม่เริ่ม |

---

## 📄 License

Internal project — ยังไม่ได้กำหนด license