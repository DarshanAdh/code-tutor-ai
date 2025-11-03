import { multiAIService } from './multi-ai.service';

export interface CodeAnalysis {
  errors: string[];
  suggestions: string[];
  explanation: string;
  fixedCode?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TutorResponse {
  explanation: string;
  codeExample?: string;
  visualization?: string;
  quiz?: QuizQuestion[];
  relatedTopics: string[];
}

export class AITutorService {
  async answerCodingQuestion(question: string, language: string = 'python'): Promise<TutorResponse> {
    return await multiAIService.answerCodingQuestion(question, language);
  }

  async analyzeCode(code: string, language: string = 'python'): Promise<CodeAnalysis> {
    return await multiAIService.analyzeCode(code, language);
  }

  async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<QuizQuestion[]> {
    return await multiAIService.generateQuiz(topic, difficulty);
  }

  async explainAlgorithm(algorithm: string, language: string = 'python'): Promise<TutorResponse> {
    return await multiAIService.explainAlgorithm(algorithm, language);
  }
}

export const aiTutorService = new AITutorService();