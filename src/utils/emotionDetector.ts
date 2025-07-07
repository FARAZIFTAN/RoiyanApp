import { EmotionResult } from '../types';

interface EmotionKeywords {
  [emotion: string]: {
    keywords: string[];
    emoji: string;
    weight: number;
  };
}

const emotionKeywords: EmotionKeywords = {
  senang: {
    keywords: [
      // Satu kata
      'senang', 'seneng', 'bahagia', 'gembira', 'suka', 'happy', 'mantap', 'keren', 'bagus', 'hebat', 'ceria', 'riang', 'girang', 'asik', 'asyik', 'seru', 'menyenangkan', 'positif', 'uwu', 'good', 'nice', 'sip', 'top', 'mantul', 'ciyee', 'ciee', 'enak', 'nikmat', 'lucu', 'fun', 'enjoy', 'enjoying', 'enjoyed', 'beruntung', 'berhasil', 'puas', 'lega', 'berkualitas', 'wow', 'hore', 'horee', 'yeay', 'yay', 'haha', 'hehe', 'hihi', 'amazing', 'fantastic', 'great', 'super', 'superb', 'excellent', 'wonderful', 'best', 'cool', 'awesome', 'makasih', 'makasi', 'makaci', 'thanks', 'terima kasih', 'love', 'cinta', 'sayang', 'excited', 'antusias', 'alhamdulillah', 'berkah', 'rezeki', 'bersemangat', 'semangat', 'berhasil', 'menang',
      // Frasa
      'luar biasa', 'suka cita', 'good job', 'kerja bagus', 'kerja mantap', 'kabar baik', 'kabar gembira', 'dapat hadiah', 'bisa kok', 'berhasil juga', 'akhirnya berhasil', 'sukses besar', 'dapet bonus', 'dapet rejeki', 'rezeki nomplok', 'semua lancar', 'jalan lancar', 'jalan mulus', 'semua beres', 'semua selesai', 'masuk akal', 'hidup indah', 'hidup bahagia', 'hidup asik', 'hidup berkah', 'hidup penuh warna', 'hidup penuh cinta', 'hidup penuh tawa', 'hidup penuh senyum', 'hidup penuh semangat', 'hidup penuh harapan', 'hidup penuh kebahagiaan', 'hidup penuh keberuntungan', 'hidup penuh kesenangan', 'hidup penuh kegembiraan', 'hidup penuh keceriaan', 'hidup penuh kehangatan', 'hidup penuh kasih sayang', 'hidup penuh keindahan', 'hidup penuh kenikmatan', 'hidup penuh keberhasilan', 'hidup penuh kemenangan',
    ],
    emoji: '😊',
    weight: 1
  },
  semangat: {
    keywords: [
      // Satu kata
      'semangat', 'ayo', 'yuk', 'pasti bisa', 'fight', 'go', 'let\'s go', 'ayok', 'optimis', 'yakin', 'confident', 'motivated', 'passionate', 'energetic', 'enthusiastic', 'siap', 'ready', 'gas', 'push', 'hustle', 'bangkit', 'berjuang', 'maju', 'lanjut', 'pantang menyerah', 'never give up', 'keep going', 'keep fighting', 'keep spirit', 'keep moving', 'tetap semangat', 'jangan menyerah', 'jangan putus asa', 'jangan lelah', 'jangan takut', 'jangan khawatir', 'jangan ragu', 'jangan malas', 'jangan baper', 'jangan galau', 'jangan sedih', 'jangan marah', 'jangan kecewa', 'jangan down', 'jangan stress', 'jangan panik', 'jangan takut gagal', 'jangan takut mencoba', 'jangan takut salah', 'jangan takut rugi', 'jangan takut kehilangan', 'jangan takut ditinggal', 'jangan takut ditolak', 'jangan takut gagal lagi', 'jangan takut gagal terus',
      // Frasa
      'pasti sukses', 'pasti berhasil', 'pasti menang', 'pasti lulus', 'pasti dapat', 'pasti bisa kok', 'pasti bisa bro', 'pasti bisa sis', 'pasti bisa gan', 'pasti bisa dek', 'pasti bisa kak', 'pasti bisa mas', 'pasti bisa mbak', 'pasti bisa bang', 'pasti bisa neng', 'pasti bisa bos', 'pasti bisa pak', 'pasti bisa bu', 'pasti bisa om', 'pasti bisa tante', 'pasti bisa ayah', 'pasti bisa ibu', 'pasti bisa bapak', 'pasti bisa mama', 'pasti bisa papa', 'pasti bisa abang', 'pasti bisa adik', 'pasti bisa kakak', 'pasti bisa teman', 'pasti bisa sahabat', 'pasti bisa saudara', 'pasti bisa keluarga', 'pasti bisa semua', 'pasti bisa siapa saja', 'pasti bisa kapan saja', 'pasti bisa di mana saja', 'pasti bisa di mana pun', 'pasti bisa di mana-mana',
    ],
    emoji: '💪',
    weight: 1
  },
  marah: {
    keywords: [
      // Satu kata
      'marah', 'kesal', 'kesel', 'jengkel', 'dongkol', 'bete', 'sebel', 'emosi', 'emosian', 'angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'geram', 'ngamuk', 'ngambek', 'bete banget', 'bajingan', 'anjing', 'fuck', 'damn', 'shit', 'bodoh', 'stupid', 'tolol', 'idiot', 'menyebalkan', 'sialan', 'kampret', 'brengsek', 'bangsat', 'goblok', 'kzl', 'malesin', 'nyebelin', 'nyusahin', 'sakit hati', 'kesel banget', 'parah', 'parah banget', 'parah sih', 'parah ya', 'parah banget sih', 'parah banget ya', 'parah banget banget', 'parah banget banget banget', 'parah banget banget banget banget', 'parah banget banget banget banget banget',
      // Frasa
      'nggak suka', 'nggak senang', 'nggak happy', 'nggak puas', 'nggak nyaman', 'nggak betah', 'nggak enak', 'nggak asik', 'nggak asyik', 'nggak seru', 'nggak menyenangkan', 'nggak positif', 'nggak baik', 'nggak bagus', 'nggak keren', 'nggak mantap', 'nggak top', 'nggak mantul', 'nggak sip', 'nggak uwu', 'nggak ciee', 'nggak ciyee', 'nggak cie', 'nggak ciee', 'nggak ciee', 'nggak ciee', 'nggak ciee', 'nggak ciee', 'nggak ciee', 'nggak ciee', 'nggak ciee',
    ],
    emoji: '😠',
    weight: 1.2
  },
  sedih: {
    keywords: [
      // Satu kata
      'sedih', 'kecewa', 'down', 'galau', 'depresi', 'stress', 'putus asa', 'hopeless', 'sad', 'disappointed', 'hurt', 'pain', 'broken', 'cry', 'nangis', 'menangis', 'tears', 'lonely', 'kesepian', 'sendiri', 'hampa', 'kosong', 'hancur', 'terpuruk', 'drop', 'patah hati', 'remuk', 'terluka', 'teriris', 'terabaikan', 'ditinggal', 'ditolak', 'sakit', 'sakit hati', 'sakit banget', 'sakit parah', 'sakit luar biasa', 'sakit banget banget',
      // Frasa
      'sedih banget', 'kecewa banget', 'galau banget', 'nangis banget', 'patah hati banget', 'terluka banget', 'teriris banget', 'terabaikan banget', 'ditinggal banget', 'ditolak banget', 'sakit hati banget', 'sakit banget banget', 'sakit parah banget', 'sakit luar biasa banget', 'sakit banget banget banget', 'sakit banget banget banget banget', 'sakit banget banget banget banget banget',
    ],
    emoji: '😢',
    weight: 1.1
  },
  takut: {
    keywords: [
      // Satu kata
      'takut', 'scared', 'afraid', 'fear', 'cemas', 'anxious', 'worry', 'khawatir', 'nervous', 'panic', 'panik', 'was-was', 'deg-degan', 'tegang', 'stress', 'paranoid', 'ngeri', 'serem', 'menakutkan', 'merinding', 'ngilu', 'ngilu banget', 'ngilu parah', 'ngilu luar biasa', 'ngilu banget banget',
      // Frasa
      'takut banget', 'cemas banget', 'khawatir banget', 'deg-degan banget', 'panik banget', 'nervous banget', 'paranoid banget', 'takut luar biasa', 'takut banget banget', 'takut banget banget banget',
    ],
    emoji: '😰',
    weight: 1
  },
  terkejut: {
    keywords: [
      // Satu kata
      'terkejut', 'surprised', 'shock', 'syok', 'kaget', 'amazed', 'wow', 'whoa', 'omg', 'astaga', 'ya ampun', 'gila', 'gak nyangka', 'unexpected', 'suddenly', 'mendadak', 'tiba-tiba', 'terperanjat', 'terpana', 'tercengang', 'melongo', 'terkesima', 'terheran', 'heran', 'wah', 'wah banget', 'wah luar biasa',
      // Frasa
      'nggak nyangka', 'bener-bener kaget', 'kaget banget', 'kaget parah', 'kaget luar biasa', 'terkejut banget', 'terkejut parah', 'terkejut luar biasa', 'syok banget', 'syok parah', 'syok luar biasa', 'terpana banget', 'terpana parah', 'terpana luar biasa',
    ],
    emoji: '😲',
    weight: 1
  },
  netral: {
    keywords: [
      'oke', 'okay', 'baik', 'ya', 'hmm', 'oh', 'ah', 'em', 'well', 'fine', 'normal', 'biasa', 'standar', 'begitu', 'gitu', 'seperti itu', 'understand', 'mengerti', 'paham', 'clear', 'jelas', 'biasa aja', 'biasa saja', 'so-so', 'lumayan', 'gitu aja', 'gitu doang', 'gitu tok', 'gitu aja sih', 'gitu aja kok', 'gitu aja mah', 'gitu aja ya', 'gitu aja deh', 'gitu aja dong', 'gitu aja pun', 'gitu aja tuh', 'gitu aja sih ya', 'gitu aja sih kok', 'gitu aja sih mah', 'gitu aja sih ya deh', 'gitu aja sih ya dong', 'gitu aja sih ya pun', 'gitu aja sih ya tuh',
    ],
    emoji: '😐',
    weight: 0.5
  }
};


export function detectEmotion(text: string): EmotionResult {
  if (!text || text.trim().length === 0) {
    return {
      emotion: 'netral',
      emoji: '😐',
      confidence: 0.5,
      keywords: []
    };
  }

  const lowerText = text.toLowerCase();
  const emotionScores: { [emotion: string]: { score: number; matchedKeywords: string[] } } = {};

  // Initialize emotion scores
  Object.keys(emotionKeywords).forEach(emotion => {
    emotionScores[emotion] = { score: 0, matchedKeywords: [] };
  });

  // Check for keyword matches
  Object.entries(emotionKeywords).forEach(([emotion, data]) => {
    data.keywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        emotionScores[emotion].score += data.weight;
        emotionScores[emotion].matchedKeywords.push(keyword);
      }
    });
  });

  // Find the emotion with the highest score
  let detectedEmotion = 'netral';
  let maxScore = 0;
  let matchedKeywords: string[] = [];

  Object.entries(emotionScores).forEach(([emotion, data]) => {
    if (data.score > maxScore) {
      maxScore = data.score;
      detectedEmotion = emotion;
      matchedKeywords = data.matchedKeywords;
    }
  });

  // Deteksi negasi (penyangkalan)
  const negations = ['tidak', 'nggak', 'gak', 'bukan', 'tak'];
  let isNegated = false;
  if (detectedEmotion !== 'netral' && matchedKeywords.length > 0) {
    matchedKeywords.forEach(keyword => {
      negations.forEach(neg => {
        // Cek pola negasi sebelum keyword, misal: 'tidak marah', 'nggak sedih'
        const negPattern = new RegExp(`${neg} +${keyword}`, 'i');
        if (negPattern.test(text)) {
          isNegated = true;
        }
      });
    });
  }
  if (isNegated) {
    detectedEmotion = 'netral';
    matchedKeywords = [];
  }

  // Calculate confidence based on score and text length
  const textLength = text.split(' ').length;
  const confidence = Math.min(0.9, Math.max(0.3, maxScore / Math.max(1, textLength * 0.5)));

  return {
    emotion: detectedEmotion,
    emoji: emotionKeywords[detectedEmotion].emoji,
    confidence: Math.round(confidence * 100) / 100,
    keywords: matchedKeywords
  };
}

export function getEmotionColor(emotion: string): string {
  const colors: { [key: string]: string } = {
    senang: 'text-green-600 bg-green-50',
    semangat: 'text-blue-600 bg-blue-50',
    marah: 'text-red-600 bg-red-50',
    sedih: 'text-purple-600 bg-purple-50',
    takut: 'text-yellow-600 bg-yellow-50',
    terkejut: 'text-pink-600 bg-pink-50',
    netral: 'text-gray-600 bg-gray-50'
  };
  return colors[emotion] || colors.netral;
}

export function getBackgroundGradient(dominantEmotion: string): string {
  const gradients: { [key: string]: string } = {
    senang: 'from-green-100 to-emerald-50',
    semangat: 'from-blue-100 to-cyan-50',
    marah: 'from-red-100 to-orange-50',
    sedih: 'from-purple-100 to-indigo-50',
    takut: 'from-yellow-100 to-amber-50',
    terkejut: 'from-pink-100 to-rose-50',
    netral: 'from-gray-100 to-slate-50'
  };
  return gradients[dominantEmotion] || gradients.netral;
}