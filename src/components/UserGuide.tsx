import React from 'react';
import { BookOpen, MessageCircle, BarChart3, Bot, Download, RefreshCw } from 'lucide-react';

const UserGuide: React.FC = () => {
  const steps = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Pilih Peran atau Simulasi",
      description: "Masuk sebagai User 1, User 2, atau jalankan Simulasi Otomatis (Bot)."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Ketikkan Pesan Diskusi",
      description: "Contoh: \"Bagus banget jawabannya!\" atau \"Aku kesal, gak dimengerti.\""
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Lihat Emosi dan Statistik",
      description: "Emosi muncul sebagai emoji + label. Lihat grafik ringkasan di tab Statistik."
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Lakukan Refleksi",
      description: "Isi pertanyaan singkat untuk membandingkan perasaan dan deteksi RoiYan."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Simpan atau Reset",
      description: "Unduh hasil diskusi (.txt/.pdf) atau tekan 🔄 Reset untuk sesi baru."
    }
  ];

  const examples = [
    { text: "Ayo kita pasti bisa selesaikan tugas ini!", emotion: "💪 Semangat" },
    { text: "Aku kesal banget, kenapa kamu gitu sih?", emotion: "😠 Marah" },
    { text: "Terima kasih ya udah bantuin!", emotion: "😊 Senang" },
    { text: "Aku kecewa banget dengan hasil kita…", emotion: "😢 Sedih" },
    { text: "Oke, selanjutnya kita bahas apa nih?", emotion: "😐 Netral" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-8">
      {/* Header */}
      <div className="text-center px-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Panduan Menggunakan RoiYan
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          "Rasakan Emosimu, Bangun Kolaborasimu" - Membantu memahami dinamika emosi 
          dalam kerja tim dengan menganalisis pesan teks secara real-time.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="bg-blue-100 text-blue-600 p-2 sm:p-3 rounded-lg">
                {step.icon}
              </div>
              <span className="ml-2 sm:ml-3 bg-blue-600 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full">
                {index + 1}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">{step.title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Examples */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-8 overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          👨‍🏫 Contoh Kalimat & Deteksi Emosi
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] bg-white rounded-xl shadow-sm text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 sm:px-6 py-2 sm:py-4 text-left font-semibold text-gray-900">Chat yang Diketik</th>
                <th className="px-3 sm:px-6 py-2 sm:py-4 text-left font-semibold text-gray-900">Deteksi Emosi</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((example, index) => (
                <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-gray-700">"{example.text}"</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                      {example.emotion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">📌 Tips Penggunaan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 text-xs sm:text-sm">Jangan takut mengetik emosi nyata — RoiYan tidak menyimpan data apa pun.</p>
            </div>
            <div className="flex items-start">
              <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 text-xs sm:text-sm">Coba ketik kalimat positif dan negatif untuk melihat reaksi visual RoiYan.</p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 text-xs sm:text-sm">Gunakan fitur mode pameran untuk presentasi otomatis.</p>
            </div>
            <div className="flex items-start">
              <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 text-xs sm:text-sm">Manfaatkan bot simulator untuk demo yang lebih interaktif.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">💡 Fitur-fitur RoiYan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Chat Multi-User</h3>
            <p className="text-xs sm:text-sm text-gray-600">Simulasi diskusi tim dengan berbagai peran pengguna</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Analisis Real-time</h3>
            <p className="text-xs sm:text-sm text-gray-600">Deteksi emosi instan dengan visualisasi interaktif</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Bot Cerdas</h3>
            <p className="text-xs sm:text-sm text-gray-600">Simulasi otomatis yang responsif terhadap suasana tim</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Download className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Export Data</h3>
            <p className="text-xs sm:text-sm text-gray-600">Unduh hasil analisis dalam format TXT atau PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;