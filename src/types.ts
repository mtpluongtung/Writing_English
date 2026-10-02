export interface WordToken {
  id: string;
  word: string;
  cleanWord: string;
  isUsed?: boolean;
}

export interface VocabHint {
  word: string;
  meaning: string;
  type?: string;
  example?: string;
}

export interface AlternativeAnswer {
  band: number;
  text: string;
  highlight: string;
}

export interface ExerciseItem {
  id: string;
  order: number;
  vietnameseText: string;
  englishAnswer: string;
  tokens: string[];
  vocabHints: VocabHint[];
  grammarNotes: string[];
  alternativeAnswers?: AlternativeAnswer[];
  userAnswer: string;
  isCompleted: boolean;
  accuracyScore: number;
  submittedAt?: string;
}

export interface ExerciseSet {
  id: string;
  title: string;
  topic: string;
  topicVi: string;
  band: number;
  createdAt: string;
  items: ExerciseItem[];
}

export interface GenerationOptions {
  topic: string;
  topicVi: string;
  band: number;
  sentenceCount: number;
  customTopic?: string;
  useGeminiApiKey?: boolean;
  apiKey?: string;
}
