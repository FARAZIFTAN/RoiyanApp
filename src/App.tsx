import { Suspense, lazy, useState, useEffect } from 'react';
import { MessageCircle, BarChart3, Heart, BookOpen, Download, RotateCcw } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { Message, User, EmotionStats, ReflectionData } from './types';
import { io, Socket } from 'socket.io-client';

import { downloadChatLog, downloadEmotionReport } from './utils/downloadManager';
import { getBackgroundGradient, detectEmotion } from './utils/emotionDetector';
import { ToastProvider, useToast } from './components/ToastProvider';
import Login from './components/Login';

const ChatInterface = lazy(() => import('./components/ChatInterface'));
const StatisticsPanel = lazy(() => import('./components/StatisticsPanel'));
const ReflectionForm = lazy(() => import('./components/ReflectionForm'));
const UserGuide = lazy(() => import('./components/UserGuide'));

import jsPDF from 'jspdf';

function App() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('currentUser') || 'user1');
  const [emotionStats, setEmotionStats] = useState<EmotionStats>({});
  const [reflections, setReflections] = useState<ReflectionData[]>([]);
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('loggedIn') === 'true');
  const [chatNotif, setChatNotif] = useState(false);
  const [lastSeenMessageId, setLastSeenMessageId] = useState<string | null>(null);

  const { showToast } = useToast();

  const users: User[] = [
    { id: 'user1', name: 'Alex', avatar: '👨‍💼', color: 'blue' },
    { id: 'user2', name: 'Sarah', avatar: '👩‍💻', color: 'purple' },
    { id: 'bot', name: 'RoiBot', avatar: '🤖', color: 'green' }
  ];

  // Reset notif dan update lastSeenMessageId saat tab chat dibuka
  useEffect(() => {
    if (activeTab === 'chat') {
      if (messages.length > 0) {
        setLastSeenMessageId(messages[messages.length - 1].id);
      }
      setChatNotif(false);
    }
  }, [activeTab, messages]);

  // Notifikasi chat: true jika ada pesan dari lawan chat yang lebih baru dari lastSeenMessageId
  useEffect(() => {
    if (activeTab !== 'chat') {
      const lastIdx = messages.findIndex(msg => msg.id === lastSeenMessageId);
      const newMessages = lastIdx === -1 ? messages : messages.slice(lastIdx + 1);
      const hasNew = newMessages.some(msg => {
        const userId = msg.user || msg.user_id;
        return userId && userId !== currentUser;
      });
      setChatNotif(hasNew);
    }
  }, [messages, activeTab, currentUser, lastSeenMessageId]);

  // Calculate dominant emotion for background
  const dominantEmotion = Object.entries(emotionStats).reduce((a, b) => 
    (emotionStats[a[0]] || 0) > (emotionStats[b[0]] || 0) ? a : b, ['netral', 0]
  )[0];


  // Update emotion statistics when messages change
  useEffect(() => {
    const stats: EmotionStats = {};
    messages
      .filter(message => message.emotion && typeof message.emotion.emotion === 'string')
      .forEach(message => {
        const emotion = message.emotion?.emotion;
        if (emotion !== undefined) {
          stats[emotion] = (stats[emotion] || 0) + 1;
        }
      });
    setEmotionStats(stats);
  }, [messages]);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    // Fetch pesan awal dari backend
    fetch('http://localhost:4000/api/messages')
      .then(res => res.json())
      .then(data => {
        // Tambahkan deteksi emosi jika belum ada
        const processed = data.map((msg: any) => ({
          ...msg,
          emotion: msg.emotion && typeof msg.emotion === 'object'
            ? msg.emotion
            : detectEmotion(msg.content)
        }));
        setMessages(processed);
      });
    // Listener pesan baru
    newSocket.on('new_message', (message: Message) => {
      // Tambahkan deteksi emosi jika belum ada
      const processed = {
        ...message,
        emotion: message.emotion && typeof message.emotion === 'object'
          ? message.emotion
          : detectEmotion(message.content)
      };
      setMessages(prev => [...prev, processed]);
    });
    // Listener hapus semua pesan
    newSocket.on('clear_messages', () => {
      setMessages([]);
      setEmotionStats({});
      setReflections([]);
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = (message: Message) => {
    if (!message.content.trim()) {
      showToast('Pesan tidak boleh kosong!', 'error');
      return;
    }
    // Kirim ke backend
    fetch('http://localhost:4000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: message.user,
        user_name: users.find(u => u.id === message.user)?.name || '',
        avatar: users.find(u => u.id === message.user)?.avatar || '',
        content: message.content,
        emotion: message.emotion?.emotion,
        emoji: message.emotion?.emoji,
        confidence: message.emotion?.confidence,
        keywords: message.emotion && Array.isArray(message.emotion.keywords) ? message.emotion.keywords.join(',') : '',
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Gagal mengirim pesan');
      return res.json();
    })
    .then(() => {
      showToast('Pesan berhasil dikirim!', 'success');
    })
    .catch(() => showToast('Gagal mengirim pesan ke server!', 'error'));
  };

  const handleClearMessages = () => {
    // Hapus hanya pesan milik user yang sedang login
    setMessages(prev => prev.filter(msg => {
      const userId = msg.user || msg.user_id;
      return userId !== currentUser;
    }));
    showToast('Semua pesan Anda telah dihapus dari tampilan ini.', 'info');
  };

  const handleSwitchUser = (userId: string) => {
    setCurrentUser(userId);
  };

  const handleSubmitReflection = (reflection: ReflectionData) => {
    setReflections(prev => [...prev, reflection]);
  };

  const handleLogin = (userId: string) => {
    setCurrentUser(userId);
    setLoggedIn(true);
    setActiveTab('guide'); // Pindah ke halaman Panduan setelah login
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUser', userId);
    localStorage.setItem('activeTab', 'guide');
  };
  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('activeTab');
  };

  // Download PDF Custom sesuai layout permintaan user
  const handleDownloadPDFCustom = () => {
    if (messages.length === 0) {
      showToast('Belum ada pesan untuk diunduh!', 'error');
      return;
    }
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;
    const sectionGap = 18;
    const lineGap = 13;
    const border = '------------------------------------------------';

    // Header rata tengah
    doc.setFont('courier', 'bold');
    doc.setFontSize(13);
    doc.text(border, pageWidth / 2, y, { align: 'center' }); y += lineGap;
    doc.text('ROIYAN CHAT REPORT', pageWidth / 2, y, { align: 'center' }); y += lineGap;
    doc.text(border, pageWidth / 2, y, { align: 'center' }); y += sectionGap;

    // Tanggal dan Peserta
    doc.setFont('courier', 'normal');
    doc.setFontSize(11);
    const today = new Date();
    const tanggal = today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Tanggal: ${tanggal}`, 40, y); y += lineGap;
    const peserta = users.map(u => u.name).join(', ');
    doc.text(`Peserta: ${peserta}`, 40, y); y += sectionGap;

    // Section Riwayat Chat
    doc.setFont('courier', 'bold');
    doc.text(border, 40, y); y += lineGap;
    doc.text('Riwayat Chat:', 40, y); y += lineGap;
    doc.text(border, 40, y); y += lineGap;
    doc.setFont('courier', 'normal');
    messages.forEach(msg => {
      const user = users.find(u => u.id === msg.user);
      const time = new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const emotion = msg.emotion?.emotion || '-';
      const emoji = msg.emotion?.emoji || '';
      // Format: [08:00] User1 (🙂 Netral): Halo semua!
      const text = `[${time}] ${user?.name || msg.user} (${emoji} ${capitalize(emotion)}): ${msg.content}`;
      const split = doc.splitTextToSize(text, pageWidth - 80);
      split.forEach((line: string) => {
        doc.text(line, 40, y);
        y += lineGap;
        if (y > 780) { doc.addPage(); y = 40; }
      });
    });
    y += sectionGap / 2;

    // Section Statistik Emosi
    doc.setFont('courier', 'bold');
    doc.text(border, 40, y); y += lineGap;
    doc.text('Statistik Emosi:', 40, y); y += lineGap;
    doc.text(border, 40, y); y += lineGap;
    doc.setFont('courier', 'normal');
    Object.entries(emotionStats).forEach(([emotion, count]) => {
      const statLine = `${capitalize(emotion)}: ${count} pesan`;
      doc.text(statLine, 40, y);
      y += lineGap;
      if (y > 780) { doc.addPage(); y = 40; }
    });

    doc.save('riwayat_chat.pdf');
    showToast('Download chat berhasil!', 'success');
  };

  // Helper agar emosi huruf besar di awal
  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  const handleDownload = (format: 'txt' | 'pdf') => {
    if (messages.length === 0) {
      showToast('Belum ada pesan untuk diunduh!', 'error');
      return;
    }
    downloadChatLog(messages, format);
    showToast('Download chat berhasil!', 'success');
  };


  const handleDownloadReport = () => {
    if (messages.length === 0) {
      showToast('Belum ada data untuk laporan!', 'error');
      return;
    }
    downloadEmotionReport(emotionStats, messages, reflections);
    showToast('Download laporan berhasil!', 'success');
  };

  // Hapus satu pesan berdasarkan id
  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const tabs = [
    { id: 'guide', label: 'Panduan', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'chat', label: 'Chat', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'stats', label: 'Statistik', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'reflection', label: 'Refleksi', icon: <Heart className="w-5 h-5" /> }
  ];

  return (
    <ToastProvider>
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(dominantEmotion)} transition-all duration-1000`}>
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm shadow-lg sm:sticky sm:top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">RoiYan</h1>
                      <p className="text-xs text-gray-600">Rasakan Emosimu, Bangun Kolaborasimu</p>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
              <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-8">
                <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent gap-1 sm:gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center px-2 sm:px-4 py-2 sm:py-3 mx-0.5 sm:mx-1 border-b-2 font-medium text-[10px] xs:text-xs sm:text-sm transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-t-md min-w-[56px] sm:min-w-[80px] ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      style={{ flex: '0 0 auto', position: 'relative' }}
                    >
                      {tab.id === 'chat' ? (
                        <span className="relative">
                          {tab.icon}
                          {chatNotif && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" title="Ada chat baru" />
                          )}
                        </span>
                      ) : tab.icon}
                      <span className="hidden xs:inline mt-1">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <ErrorBoundary>
              <Suspense fallback={<div className="text-center py-12 text-blue-600">Memuat...</div>}>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="h-full">
                    {activeTab === 'guide' && UserGuide && <UserGuide />}
                    {activeTab === 'chat' && ChatInterface && (
                      <div className="h-[600px] flex flex-col">

                        <ChatInterface
                          messages={messages}
                          users={users}
                          currentUser={currentUser}
                          onSendMessage={handleSendMessage}
                          onClearMessages={handleClearMessages}
                          onSwitchUser={handleSwitchUser}
                          onDeleteMessage={handleDeleteMessage}
                        />
                      </div>
                    )}
                    {activeTab === 'stats' && StatisticsPanel && (
                      <StatisticsPanel emotionStats={emotionStats} messages={messages} />
                    )}
                    {activeTab === 'reflection' && ReflectionForm && (
                      <ReflectionForm
                        emotionStats={emotionStats}
                        onSubmitReflection={handleSubmitReflection}
                        reflections={reflections}
                      />
                    )}
                  </div>
                </main>
              </Suspense>
            </ErrorBoundary>

            {/* Footer */}
            <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center text-sm text-gray-600">
                  <p>© 2025 RoiYan - Platform Edukatif Deteksi Emosi | 100% Client-Side & Privasi Terjamin</p>
                  <p className="mt-1">Dibuat dengan ❤️ untuk edukasi dan pelatihan kolaborasi tim</p>
                </div>
              </div>
            </footer>
          </div>
        </>
      )}
    </ToastProvider>
  );
}

export default App;