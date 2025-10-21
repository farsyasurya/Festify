# 🏆 Info Lomba Inline — Backend API

Backend aplikasi **Info Lomba Inline** dibangun menggunakan **Express.js + TypeScript + Prisma ORM** dan terhubung dengan database **PostgreSQL**.  
Aplikasi ini menyediakan endpoint untuk autentikasi **Admin** dan **Peserta (User)**, serta manajemen data kompetisi dan peserta lomba.

----
- 🧑‍💼 **Admin** → mengelola kompetisi & peserta  
- 🧍‍♂️ **User (Peserta)** → mendaftar dan melihat lomba yang tersedia  
----

```
├── controllers/
├── middleware/
├── routes/
├── types/
└── app.ts
```



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

## Cara Menjalankan Project
1. npm install
2. npm run dev

## Dependensi Utama
- Express
- PostgreSQL
- Multer
- TypeScript




