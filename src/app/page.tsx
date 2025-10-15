import Link from 'next/link'
import { Wallet, BarChart3, TrendingUp, Shield, Smartphone, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-4 py-6 lg:px-8">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Pengluaran</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Daftar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Kelola Keuangan Anda dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Lebih Mudah</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Aplikasi pencatatan keuangan yang modern dan intuitif. Lacak pemasukan, pengeluaran, dan analisis keuangan Anda dalam satu tempat.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
            >
              Mulai Gratis
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition border-2 border-gray-200"
            >
              Masuk
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Visualisasi Data</h3>
            <p className="text-gray-600">Lihat grafik dan laporan keuangan yang mudah dipahami untuk membantu keputusan finansial Anda.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analisis Otomatis</h3>
            <p className="text-gray-600">Dapatkan insight otomatis tentang pola pengeluaran dan pemasukan Anda setiap bulan.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aman & Privat</h3>
            <p className="text-gray-600">Data keuangan Anda terenkripsi dan tersimpan dengan aman di cloud.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Responsive Design</h3>
            <p className="text-gray-600">Akses dari perangkat apapun - desktop, tablet, atau smartphone dengan tampilan optimal.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cepat & Mudah</h3>
            <p className="text-gray-600">Interface yang intuitif membuat pencatatan transaksi jadi cepat dan tidak merepotkan.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Kategori Custom</h3>
            <p className="text-gray-600">Buat dan kelola kategori transaksi sesuai kebutuhan Anda sendiri.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Siap Mengelola Keuangan Lebih Baik?</h2>
          <p className="text-xl mb-8 opacity-90">Bergabung sekarang dan mulai perjalanan finansial yang lebih terorganisir.</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-xl transition shadow-lg"
          >
            Daftar Sekarang - Gratis!
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 Pengluaran. Aplikasi manajemen keuangan pribadi.</p>
        </div>
      </footer>
    </div>
  )
}
