# 🏆 Info Lomba Inline — Backend API

Backend aplikasi **Info Lomba Inline** dibangun menggunakan **Express.js + TypeScript + Prisma ORM** dan terhubung dengan database **PostgreSQL**.  
Aplikasi ini menyediakan endpoint untuk autentikasi **Admin** dan **Peserta (User)**, serta manajemen data kompetisi dan peserta lomba.

----
- 🧑‍💼 **Admin** → mengelola kompetisi & peserta  
- 🧍‍♂️ **User (Peserta)** → mendaftar dan melihat lomba yang tersedia  
----

## 🚀 Tech Stack

| Bagian | Teknologi |
|--------|------------|
| Server | Express.js (TypeScript) |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + Bcrypt |
| Environment | dotenv |
| Validation | Zod / Custom Validator (opsional) |

---

## 📂 Struktur Folder

src/
├── controllers/
│   ├── auth.ts
│   ├── competitions.ts
│   └── participant.ts
├── middleware/
├── routes/
├── types/
├── utils/
├── app.ts
prisma/
├── migrations/
└── schema.prisma
.env

