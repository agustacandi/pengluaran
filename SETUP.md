# Setup Pengluaran App

Panduan lengkap untuk menjalankan aplikasi Pengluaran di lokal Anda.

## Prerequisites

- Node.js 18+ dan pnpm
- Akun Supabase (gratis)

## Langkah Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Supabase

#### A. Buat Project Supabase

1. Kunjungi [supabase.com](https://supabase.com)
2. Sign up atau login
3. Klik "New Project"
4. Isi detail project:
   - Name: Pengluaran (atau nama lain)
   - Database Password: Pilih password yang kuat
   - Region: Pilih yang terdekat dengan Anda

#### B. Jalankan Database Schema

1. Buka project Supabase Anda
2. Klik menu "SQL Editor" di sidebar kiri
3. Klik "New Query"
4. Copy seluruh isi dari file `supabase-schema.sql` di root project ini
5. Paste ke SQL Editor
6. Klik "Run" untuk menjalankan script

Script ini akan membuat:
- Tabel `transactions`, `categories`, dan `profiles`
- Row Level Security (RLS) policies
- Triggers untuk auto-create profile dan default categories
- Indexes untuk performa

#### C. Setup Authentication

1. Di Supabase dashboard, klik "Authentication" > "Providers"
2. Pastikan "Email" provider sudah enabled (default)
3. Optional: Setup email templates di "Email Templates"

#### D. Get API Keys

1. Klik "Settings" > "API"
2. Copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - anon/public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Setup Environment Variables

1. Copy `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` dan isi dengan credentials Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run Development Server

```bash
pnpm dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### 5. Test Aplikasi

1. Buka http://localhost:3000
2. Klik "Daftar" untuk membuat akun baru
3. Isi form pendaftaran
4. Setelah berhasil, Anda akan diarahkan ke dashboard
5. Default categories akan otomatis dibuat!

## Troubleshooting

### Error: "Invalid API Key"

- Pastikan `.env.local` sudah dibuat dan berisi credentials yang benar
- Restart dev server setelah menambah/mengubah env variables

### Error: "relation does not exist"

- Pastikan SQL schema sudah dijalankan dengan benar di Supabase
- Cek di Supabase dashboard > "Table Editor", harusnya ada tabel `transactions`, `categories`, dan `profiles`

### Error: "User not authenticated"

- Pastikan middleware sudah running
- Clear cookies dan coba login lagi
- Cek di Supabase dashboard > "Authentication" > "Users" untuk melihat user yang terdaftar

### Transaksi tidak muncul

- Pastikan RLS policies sudah dibuat (ada di schema SQL)
- Cek console browser untuk error messages

## Struktur Database

```
transactions
├── id (uuid, PK)
├── user_id (uuid, FK -> auth.users)
├── category_id (uuid, FK -> categories)
├── type (enum: income/expense)
├── amount (decimal)
├── description (text)
├── date (date)
└── timestamps

categories
├── id (uuid, PK)
├── user_id (uuid, FK -> auth.users)
├── name (varchar)
├── type (enum: income/expense)
├── icon (varchar)
├── color (varchar)
└── timestamps

profiles
├── id (uuid, PK, FK -> auth.users)
├── full_name (varchar)
├── avatar_url (text)
├── currency (varchar, default: IDR)
└── timestamps
```

## Default Categories

Setiap user baru akan otomatis mendapat 10 kategori default:

**Income:**
- Gaji
- Freelance
- Investasi

**Expense:**
- Makanan
- Transport
- Belanja
- Tagihan
- Hiburan
- Kesehatan
- Lainnya

## Tips Development

- Gunakan `pnpm dev` untuk development dengan hot-reload
- Check error di browser console dan terminal
- Gunakan Supabase dashboard untuk debug database
- Test fitur auth dengan email yang valid (email confirmation bisa di-skip di Supabase settings untuk development)

## Production Deployment

Untuk deploy ke production (Vercel recommended):

1. Push code ke GitHub
2. Import project di Vercel
3. Tambahkan environment variables di Vercel dashboard
4. Deploy!

Untuk Supabase production:
- Pastikan email confirmation enabled
- Setup custom SMTP jika perlu
- Tambahkan domain di Supabase settings untuk authentication

## Bantuan

Jika mengalami masalah:
1. Cek error message di console
2. Cek Supabase logs di dashboard
3. Pastikan semua steps di atas sudah dilakukan dengan benar
4. Check package.json untuk memastikan semua dependencies terinstall

Selamat menggunakan Pengluaran! 🎉
