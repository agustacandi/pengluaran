# Pengluaran - Aplikasi Manajemen Keuangan Pribadi

Aplikasi web modern untuk mencatat dan mengelola keuangan pribadi dengan fitur lengkap dan UI yang menarik.

## Fitur Utama

- **Dashboard Interaktif**: Visualisasi data keuangan dengan grafik dan chart
- **Manajemen Transaksi**: Catat pemasukan dan pengeluaran dengan mudah
- **Laporan Lengkap**: Analisis keuangan dengan filter dan export ke CSV
- **Kategori Custom**: Kelola kategori transaksi sesuai kebutuhan
- **Autentikasi**: Login dan register dengan Supabase Auth
- **Responsive Design**: Tampilan optimal di semua perangkat

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Database + Auth)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL script di `supabase-schema.sql` pada SQL Editor Supabase
3. Copy `.env.example` ke `.env.local` dan isi dengan credentials Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Database Schema

Aplikasi menggunakan 3 tabel utama:

- **transactions**: Menyimpan data transaksi (pemasukan/pengeluaran)
- **categories**: Menyimpan kategori transaksi
- **profiles**: Menyimpan profil user tambahan

Semua tabel dilengkapi dengan Row Level Security (RLS) untuk keamanan data.

## Clean Code Architecture

Project ini menerapkan **clean code principles** dengan struktur yang terorganisir dan maintainable:

### 📁 Struktur Folder

```
src/
├── app/                      # Next.js App Router
│   ├── dashboard/            # Dashboard & sub-pages
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   └── auth/                 # Auth callback
│
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── charts/               # Reusable chart components
│   ├── layout/               # Layout components
│   └── [feature]/            # Feature-specific components
│
└── lib/
    ├── constants/            # Application constants
    ├── validations/          # Form validation schemas (Zod)
    ├── services/             # Business logic layer
    ├── hooks/                # Custom React hooks
    ├── utils/                # Utility functions
    ├── supabase/             # Supabase integration
    └── types.ts              # TypeScript types
```

### 🎯 Design Patterns

1. **Service Layer Pattern**: Business logic terpisah dari UI
2. **Custom Hooks**: Reusable stateful logic
3. **Constants Configuration**: Centralized magic values
4. **Validation Schemas**: Type-safe form validation
5. **Component Composition**: Reusable, composable components

Lihat [CLEAN_CODE_GUIDE.md](./CLEAN_CODE_GUIDE.md) untuk detail lengkap tentang arsitektur dan best practices.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Documentation

- **[SETUP.md](./SETUP.md)**: Panduan setup lengkap step-by-step
- **[CLEAN_CODE_GUIDE.md](./CLEAN_CODE_GUIDE.md)**: Arsitektur dan best practices
- **[CLAUDE.md](./CLAUDE.md)**: Panduan untuk Claude Code

## Fitur Mendatang

- [ ] Dark mode
- [ ] Notifikasi reminder
- [ ] Budget planning
- [ ] Export PDF
- [ ] Multi-currency support
- [ ] Recurring transactions

## License

MIT

## Author

Built with ❤️ using Next.js and Supabase
