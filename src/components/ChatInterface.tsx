import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Trash2 } from 'lucide-react';
import { detectEmotion, getEmotionColor } from '../utils/emotionDetector';
import { useToast } from './ToastProvider';

const highlightKeywords = (text: string, keywords: string[] = []) => {
  if (!keywords || keywords.length === 0) return text;
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  let result: (string | JSX.Element)[] = [text];
  sortedKeywords.forEach(keyword => {
    result = result.flatMap(part => {
      if (typeof part !== 'string') return [part];
      const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return part.split(regex).map((chunk, idx) =>
        regex.test(chunk)
          ? <span key={chunk + idx} className="bg-yellow-200 font-semibold rounded px-1 text-gray-900 animate-pulse" style={{ animationDuration: '1s' }}>{chunk}</span>
          : chunk
      );
    });
  });
  return result;
};

import { Message } from '../types';

interface UserType {
  id: string;
  name: string;
  avatar: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  users: UserType[];
  currentUser: string;
  onSendMessage: (message: Message) => void;
  onClearMessages: () => void;
  onSwitchUser: (userId: string) => void;
  onDeleteMessage: (id: string) => void;
} // Message is now imported from '../types' and always has id: string

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  users,
  currentUser,
  onSendMessage,
  onClearMessages,
  onSwitchUser,
  onDeleteMessage
}) => {
  const [inputText, setInputText] = useState('');
  // Hapus state lokal chatMessages, gunakan langsung props.messages untuk sinkronisasi reset
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserData = users.find(u => u.id === currentUser);
  // Cari lawan chat (selain currentUser)
  const opponentUser = users.find(u => u.id !== currentUser);

  // Fetch & subscribe messages from backend
  // (Nonaktifkan sinkronisasi lokal, gunakan messages dari props)
  // Jika ingin sinkronisasi server, lakukan di parent (App) dan teruskan via props
  // Tidak perlu lagi efek untuk socket, karena sinkronisasi data dilakukan di parent
  // dan tidak ada socket lokal di komponen ini.
  // useEffect(() => {}, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Tidak perlu fetch atau socket di sini, sudah real-time dari parent

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentUserData) return;
    const emotion = detectEmotion(inputText);
    const message: Message = {
      id: Date.now().toString(),
      user: currentUserData.id,
      content: inputText.trim(),
      timestamp: new Date(),
      emotion: {
        emotion: emotion.emotion,
        emoji: emotion.emoji,
        confidence: emotion.confidence,
        keywords: emotion.keywords || [],
      }
    };
    onSendMessage(message);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Perbaiki parsing keywords emosi
  const parseKeywords = (keywords: string | string[] | undefined) => {
    if (!keywords) return [];
    if (Array.isArray(keywords)) return keywords;
    if (typeof keywords === 'string') return keywords.split(',').map(k => k.trim());
    return [];
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 min-h-[70vh]">
      {/* Header */}
      <div className="bg-blue-200 p-2 sm:p-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/60 shadow text-lg">
            <Bot className="w-7 h-7 text-white" />
          </span>
          <button
            onClick={onClearMessages}
            className="ml-1 bg-gray-200 hover:bg-blue-100 text-gray-700 p-1 rounded-full transition-colors shadow-sm"
            title="Hapus semua pesan"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col gap-1 items-end mt-1">
          {/* Tampilkan identitas user yang login saja, tanpa tombol switch user */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentUserData?.avatar}</span>
            <span className="font-semibold text-blue-700 text-sm sm:text-base">{currentUserData?.name}</span>
          </div>
          {/* Tanda lawan chat */}
          {opponentUser && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 bg-white/70 rounded px-2 py-0.5 mt-1 border border-blue-100 shadow-sm">
              <span className="opacity-70">Sedang chat dengan:</span>
              <span className="text-base">{opponentUser.avatar}</span>
              <span className="font-semibold text-blue-800">{opponentUser.name}</span>
            </div>
          )}
        </div>
      </div>
      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-2 bg-blue-50" style={{ minHeight: 0 }}>
        {messages.map((message) => {
          // Support message.user atau message.user_id
          const userId = message.user || message.user_id;
          const isCurrentUser = userId === currentUser;
          const senderData = users.find(u => u.id === userId);
          const avatar = senderData?.avatar || '👤';
          const emotion = message.emotion;
          const keywords = parseKeywords(emotion?.keywords);
          return (
            <div
              key={message.id}
              className={`flex w-full mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Flex row: avatar & bubble, urutan tergantung user aktif */}
              <div className={`flex gap-1 sm:gap-2 items-end ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                style={{ width: 'fit-content', maxWidth: '100%' }}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${isCurrentUser ? 'bg-blue-400' : 'bg-purple-400'} text-lg font-bold shadow border border-white`}>
                    {avatar}
                  </span>
                </div>
                {/* Message Content */}
                <div className={`flex flex-col gap-0.5 ${isCurrentUser ? 'items-end text-right' : 'items-start text-left'}`}
                  style={{ alignItems: isCurrentUser ? 'flex-end' : 'flex-start' }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-gray-800 font-bold text-sm sm:text-base tracking-wide">{senderData?.name || userId}</span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp instanceof Date
                        ? message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        : new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={
                    `relative whitespace-pre-line text-sm py-2 px-3 sm:px-4 pr-12 sm:pr-14 md:pr-16 rounded-2xl shadow-sm mb-1 max-w-[70vw] sm:max-w-[400px] md:max-w-[520px] border-2 ` +
                    (isCurrentUser
                      ? 'bg-blue-100 text-blue-900 border-blue-400'
                      : 'bg-gray-100 text-gray-900 border-purple-300')
                  }>
                    {highlightKeywords(message.content, keywords)}
                    {/* Tombol hapus untuk semua pesan, baik milik user aktif maupun lawan chat */}
                    <button
                      className="absolute top-2 right-2 sm:top-2 sm:right-3 md:top-2 md:right-4 p-1 rounded-full hover:bg-red-100 text-red-500"
                      title="Hapus pesan ini"
                      onClick={() => onDeleteMessage(message.id)}
                      style={{ zIndex: 2 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-normal shadow-sm bg-white/80 border border-gray-200`}>
                    <span className="text-sm">{emotion?.emoji || '🙂'}</span>
                    <span className="capitalize">{emotion?.emotion || '-'}</span>
                    <span className="opacity-60">{emotion?.confidence ? `(${Math.round(Number(emotion.confidence) * 100)}%)` : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Quick Reply modern grid + emoji picker */}
      <div className="px-1 sm:px-2 pt-1 pb-0 bg-white border-t border-gray-200 flex flex-wrap gap-1 items-center relative">
        {/* Emoji picker trigger */}
        <button
          className="p-1 rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 transition shadow-sm"
          title="Buka Emoji Picker"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg>
        </button>
        <div className="flex flex-wrap gap-1 sm:gap-2 overflow-x-auto max-w-[80vw]">
          {[
            '👍', '😊', '🔥', '🙏', 'Terima kasih!', 'Setuju!', 'Semangat!', 'Mantap!', '😂', '😢', '😡', '😱'
          ].map((preset, i) => (
            <button
              key={i}
              className="px-1.5 py-0.5 rounded-full bg-gray-100 hover:bg-blue-100 text-xs font-medium transition shadow"
              onClick={() => setInputText(inputText ? inputText + ' ' + preset : preset)}
              type="button"
              title={`Kirim ${preset}`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
      {/* Input modern */}
      <div className="p-2 sm:p-3 bg-white border-t border-gray-200 flex items-end gap-1 sm:gap-2 sticky bottom-0 z-10">
        <div className="flex-1 relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ketik pesan sebagai ${currentUserData?.name}...`}
            className="w-full px-2 sm:px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none shadow-sm bg-white text-sm"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 text-white p-2 rounded-xl shadow transition-colors flex-shrink-0 text-base font-bold"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
