export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string | Date;
  emotion?: {
    emotion: string;
    emoji?: string;
    confidence?: number;
    keywords?: string[];
  };
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  color?: string;
}

export interface EmotionStats {
  [emotion: string]: number;
}

export interface ReflectionData {
  actualEmotion: string;
  perceivedAccuracy: number;
  feedback: string;
  timestamp: Date;
}
