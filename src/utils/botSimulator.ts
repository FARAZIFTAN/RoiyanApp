import { Message, EmotionStats, User } from '../types';
import { detectEmotion } from './emotionDetector';

interface BotResponse {
  content: string;
  delay: number;
}

const botResponses: { [context: string]: BotResponse[] } = {
  positive: [
    { content: "Setuju banget! Ide yang luar biasa!", delay: 2000 },
    { content: "Iya nih, aku juga excited sama ini!", delay: 1500 },
    { content: "Mantap! Semangat terus ya tim!", delay: 2500 },
    { content: "Bagus banget progress kita hari ini", delay: 2000 }
  ],
  negative: [
    { content: "Hey, santai aja. Kita bisa selesaikan ini bareng-bareng", delay: 3000 },
    { content: "Aku paham sih perasaanmu. Gimana kalau kita coba approach lain?", delay: 2500 },
    { content: "Jangan menyerah dulu. Kita masih bisa kok!", delay: 2000 },
    { content: "Aku di sini kalau butuh bantuan ya", delay: 1800 }
  ],
  neutral: [
    { content: "Oke, selanjutnya gimana nih?", delay: 2000 },
    { content: "Btw, ada update dari project kita gak?", delay: 2500 },
    { content: "Hmm, interesting point...", delay: 1800 },
    { content: "Let me think about that", delay: 2200 }
  ],
  question: [
    { content: "Oh iya, aku ada pertanyaan nih. Gimana kalau kita coba dari sudut pandang yang berbeda?", delay: 3000 },
    { content: "Menurut kalian, apa challenge terbesar kita sekarang?", delay: 2500 },
    { content: "Ada yang punya ide kreatif gak buat solve masalah ini?", delay: 2800 }
  ]
};

export class BotSimulator {
  private isActive: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private onMessage: (message: Message) => void;
  private getEmotionStats: () => EmotionStats;
  private botUser: User;

  constructor(
    onMessage: (message: Message) => void,
    getEmotionStats: () => EmotionStats,
    botUser: User
  ) {
    this.onMessage = onMessage;
    this.getEmotionStats = getEmotionStats;
    this.botUser = botUser;
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.scheduleNextMessage();
  }

  stop() {
    this.isActive = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  private scheduleNextMessage() {
    if (!this.isActive) return;

    const delay = Math.random() * 15000 + 5000; // 5-20 seconds
    
    this.intervalId = setTimeout(() => {
      this.sendBotMessage();
      this.scheduleNextMessage();
    }, delay);
  }

  private sendBotMessage() {
    const stats = this.getEmotionStats();
    const context = this.determineContext(stats);
    const responses = botResponses[context];
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    const botMessage: Message = {
      id: `bot-${Date.now()}-${Math.random()}`,
      user: this.botUser.name,
      content: selectedResponse.content,
      timestamp: new Date(),
      emotion: detectEmotion(selectedResponse.content),
      avatar: this.botUser.avatar
    };

    setTimeout(() => {
      if (this.isActive) {
        this.onMessage(botMessage);
      }
    }, selectedResponse.delay);
  }

  private determineContext(stats: EmotionStats): string {
    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 'neutral';

    const positiveEmotions = (stats.senang || 0) + (stats.semangat || 0);
    const negativeEmotions = (stats.marah || 0) + (stats.sedih || 0) + (stats.takut || 0);
    
    const positiveRatio = positiveEmotions / total;
    const negativeRatio = negativeEmotions / total;

    if (positiveRatio > 0.4) return 'positive';
    if (negativeRatio > 0.3) return 'negative';
    if (Math.random() < 0.2) return 'question';
    return 'neutral';
  }
}