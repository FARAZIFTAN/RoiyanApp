import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { EmotionStats, Message } from '../types';
import { BarChart3, Users, MessageCircle, TrendingUp } from 'lucide-react';
import DownloadPDFButton from './DownloadPDFButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatisticsPanelProps {
  emotionStats: EmotionStats;
  messages: Message[];
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ emotionStats, messages }) => {
  const emotionLabels = Object.keys(emotionStats);
  const emotionData = Object.values(emotionStats);
  const totalMessages = emotionData.reduce((sum, count) => sum + count, 0);

  const emotionColors = {
    senang: '#10B981',
    semangat: '#3B82F6',
    marah: '#EF4444',
    sedih: '#8B5CF6',
    takut: '#F59E0B',
    terkejut: '#EC4899',
    netral: '#6B7280'
  };

  const barChartData = {
    labels: emotionLabels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
    datasets: [
      {
        label: 'Jumlah Pesan',
        data: emotionData,
        backgroundColor: emotionLabels.map(emotion => emotionColors[emotion as keyof typeof emotionColors] || '#6B7280'),
        borderColor: emotionLabels.map(emotion => emotionColors[emotion as keyof typeof emotionColors] || '#6B7280'),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: emotionLabels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
    datasets: [
      {
        data: emotionData,
        backgroundColor: emotionLabels.map(emotion => emotionColors[emotion as keyof typeof emotionColors] || '#6B7280'),
        borderColor: '#fff',
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Calculate statistics
  const dominantEmotion = emotionLabels.reduce((a, b) => 
    (emotionStats[a] || 0) > (emotionStats[b] || 0) ? a : b, 'netral'
  );

  const positiveEmotions = (emotionStats.senang || 0) + (emotionStats.semangat || 0);
  // const negativeEmotions = (emotionStats.marah || 0) + (emotionStats.sedih || 0) + (emotionStats.takut || 0); // Tidak dipakai
  const positivityRatio = totalMessages > 0 ? Math.round((positiveEmotions / totalMessages) * 100) : 0;

  const averageConfidence = messages.length > 0 
    ? Math.round(messages.reduce((sum, msg) => sum + (msg.emotion?.confidence || 0), 0) / messages.length * 100)
    : 0;

  const uniqueUsers = new Set(messages.map(msg => msg.user)).size;

  return (
    <div className="space-y-6">
      {/* Download Button */}
      <div className="flex justify-end">
        <DownloadPDFButton messages={messages} users={[]} emotionStats={emotionStats} />
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs sm:text-sm font-medium">Total Pesan</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">{totalMessages}</p>
            </div>
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-xs sm:text-sm font-medium">Pengguna Aktif</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-900">{uniqueUsers}</p>
            </div>
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-xs sm:text-sm font-medium">Positivitas</p>
              <p className="text-xl sm:text-2xl font-bold text-green-900">{positivityRatio}%</p>
            </div>
            <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-xs sm:text-sm font-medium">Akurasi Rata-rata</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-900">{averageConfidence}%</p>
            </div>
            <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
          </div>
        </div>
      </div>
      {/* Dominant Emotion */}
      {totalMessages > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-indigo-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Emosi Dominan Tim</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="text-3xl sm:text-4xl">
              {messages.find(m => m.emotion && m.emotion.emotion === dominantEmotion)?.emotion?.emoji || '😐'}
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-gray-900 capitalize">{dominantEmotion}</p>
              <p className="text-gray-600 text-xs sm:text-base">
                {emotionStats[dominantEmotion] || 0} dari {totalMessages} pesan 
                ({Math.round(((emotionStats[dominantEmotion] || 0) / totalMessages) * 100)}%)
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Charts */}
      {totalMessages > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Distribusi Emosi (Bar Chart)</h3>
            <Bar data={barChartData} options={chartOptions} />
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Proporsi Emosi (Pie Chart)</h3>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-100 text-center">
          <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Belum Ada Data</h3>
          <p className="text-gray-600 text-xs sm:text-base">
            Mulai kirim pesan di tab Chat untuk melihat analisis emosi tim secara real-time.
          </p>
        </div>
      )}
      {/* Detailed Breakdown */}
      {totalMessages > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Detail Analisis Emosi</h3>
          <div className="space-y-3">
            {Object.entries(emotionStats).map(([emotion, count]) => {
              const percentage = Math.round((count / totalMessages) * 100);
              const emoji = messages.find(m => m.emotion && m.emotion.emotion === emotion)?.emotion?.emoji || '😐';
              return (
                <div key={emotion} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{emoji}</span>
                    <span className="font-medium capitalize text-gray-900 text-sm sm:text-base">{emotion}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="w-20 sm:w-24 md:w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: emotionColors[emotion as keyof typeof emotionColors] || '#6B7280'
                        }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 w-10 sm:w-12 text-right">
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;