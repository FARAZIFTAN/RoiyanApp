import React, { useState } from 'react';
import { Heart, ThumbsUp, MessageSquare } from 'lucide-react';
import { ReflectionData, EmotionStats } from '../types';

interface ReflectionFormProps {
  emotionStats: EmotionStats;
  onSubmitReflection: (reflection: ReflectionData) => void;
  reflections: ReflectionData[];
}

const ReflectionForm: React.FC<ReflectionFormProps> = ({ 
  emotionStats, 
  onSubmitReflection, 
  reflections 
}) => {
  const [actualEmotion, setActualEmotion] = useState('');
  const [perceivedAccuracy, setPerceivedAccuracy] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalMessages = Object.values(emotionStats).reduce((sum, count) => sum + count, 0);
  const dominantEmotion = Object.entries(emotionStats).reduce((a, b) => 
    emotionStats[a[0]] > emotionStats[b[0]] ? a : b, ['netral', 0]
  )[0];

  const emotions = [
    { value: 'senang', label: 'Senang 😊', color: 'bg-green-100 text-green-800' },
    { value: 'semangat', label: 'Semangat 💪', color: 'bg-blue-100 text-blue-800' },
    { value: 'netral', label: 'Netral 😐', color: 'bg-gray-100 text-gray-800' },
    { value: 'sedih', label: 'Sedih 😢', color: 'bg-purple-100 text-purple-800' },
    { value: 'marah', label: 'Marah 😠', color: 'bg-red-100 text-red-800' },
    { value: 'takut', label: 'Takut 😰', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'terkejut', label: 'Terkejut 😲', color: 'bg-pink-100 text-pink-800' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualEmotion || feedback.trim().length < 5) return; // Validasi: emosi dipilih & feedback minimal 5 karakter

    const reflection: ReflectionData = {
      actualEmotion,
      perceivedAccuracy,
      feedback,
      timestamp: new Date()
    };

    onSubmitReflection(reflection);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setActualEmotion('');
      setPerceivedAccuracy(5);
      setFeedback('');
      setIsSubmitted(false);
    }, 3000);
  };

  if (totalMessages === 0) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-100 text-center">
        <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Belum Ada Diskusi</h3>
        <p className="text-gray-600 text-xs sm:text-base">
          Mulai diskusi di tab Chat terlebih dahulu, kemudian kembali ke sini untuk melakukan refleksi.
        </p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 sm:p-12 rounded-xl border border-green-200 text-center">
        <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ThumbsUp className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2">Terima Kasih!</h3>
        <p className="text-green-700 text-xs sm:text-base">
          Refleksi Anda telah disimpan. Ini membantu kami memahami seberapa akurat deteksi emosi RoiYan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">📊 Ringkasan Diskusi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalMessages}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Pesan</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-indigo-600 capitalize">{dominantEmotion}</p>
            <p className="text-xs sm:text-sm text-gray-600">Emosi Dominan</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{Object.keys(emotionStats).length}</p>
            <p className="text-xs sm:text-sm text-gray-600">Jenis Emosi</p>
          </div>
        </div>
      </div>
      {/* Reflection Form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          Refleksi Emosi
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Actual Emotion */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
              Bagaimana perasaan Anda yang sebenarnya selama diskusi?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {emotions.map((emotion) => (
                <button
                  key={emotion.value}
                  type="button"
                  onClick={() => setActualEmotion(emotion.value)}
                  className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    actualEmotion === emotion.value
                      ? `${emotion.color} ring-2 ring-blue-500 scale-105`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {emotion.label}
                </button>
              ))}
            </div>
          </div>
          {/* Accuracy Rating */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
              Seberapa akurat deteksi emosi RoiYan menurut Anda? ({perceivedAccuracy}/10)
            </label>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-500">Tidak Akurat</span>
              <input
                type="range"
                min="1"
                max="10"
                value={perceivedAccuracy}
                onChange={(e) => setPerceivedAccuracy(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-gray-500">Sangat Akurat</span>
            </div>
            <div className="mt-2 text-center">
              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                perceivedAccuracy >= 8 ? 'bg-green-100 text-green-800' :
                perceivedAccuracy >= 6 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {perceivedAccuracy >= 8 ? '😊 Sangat Baik' :
                 perceivedAccuracy >= 6 ? '😐 Cukup Baik' :
                 '😔 Perlu Perbaikan'}
              </span>
            </div>
          </div>
          {/* Feedback */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
              Saran atau komentar untuk perbaikan RoiYan:
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Misalnya: RoiYan kadang salah deteksi sarkasme, atau deteksi emosi sudah cukup akurat..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              rows={4}
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!actualEmotion}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-base"
          >
            Kirim Refleksi
          </button>
        </form>
      </div>
      {/* Previous Reflections */}
      {reflections.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Refleksi Sebelumnya</h3>
          <div className="space-y-3">
            {reflections.slice(-3).map((reflection, index) => (
              <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 capitalize">
                    Emosi: {reflection.actualEmotion}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Rating: {reflection.perceivedAccuracy}/10
                  </span>
                </div>
                {reflection.feedback && (
                  <p className="text-xs sm:text-sm text-gray-600">{reflection.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionForm;