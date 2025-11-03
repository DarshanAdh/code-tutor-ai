import { geminiAIService } from './gemini-ai.service';
import { ollamaAIService } from './ollama-ai.service';
import { huggingFaceAIService } from './huggingface-ai.service';
import { pistonExecutionService } from './piston-execution.service';
import { whisperVoiceService } from './whisper-voice.service';
import { coquiTTSService } from './coqui-tts.service';
import { openRouterAIService } from './openrouter-ai.service';
import { mistralAIService } from './mistral-ai.service';

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

export class MultiAIService {
  private availableProviders: string[] = [];
  private primaryProvider: string;
  private codeProvider: 'judge0' | 'piston';
  private voiceProvider: 'google' | 'whisper';
  private ttsProvider: 'google' | 'coqui';

  constructor() {
    // Determine available AI providers based on environment
    this.availableProviders = [];
    if (process.env.OPENAI_API_KEY) this.availableProviders.push('openai');
    if (process.env.OPENROUTER_API_KEY) this.availableProviders.push('openrouter');
    if (process.env.MISTRAL_API_KEY) this.availableProviders.push('mistral');
    if (process.env.GEMINI_API_KEY) {
      this.availableProviders.push('gemini');
    }
    if (process.env.HUGGINGFACE_API_KEY) {
      this.availableProviders.push('huggingface');
    }
    if (process.env.OLLAMA_URL || process.env.OLLAMA_BASE_URL) {
      this.availableProviders.push('ollama');
    }

    // Set primary provider (prefer OpenAI/OpenRouter, then Gemini)
    this.primaryProvider = this.availableProviders.includes('openai') ? 'openai' :
                          this.availableProviders.includes('openrouter') ? 'openrouter' :
                          this.availableProviders.includes('gemini') ? 'gemini' :
                          this.availableProviders[0] || 'ollama';

    // Determine code execution provider
    this.codeProvider = process.env.JUDGE0_API_KEY ? 'judge0' : 'piston';

    // Determine voice providers
    this.voiceProvider = process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'google' : 'whisper';
    this.ttsProvider = process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'google' : 'coqui';
  }

  getAvailableProviders(): string[] {
    return [...this.availableProviders];
  }

  getPrimaryProvider(): string {
    return this.primaryProvider;
  }

  async answerCodingQuestion(question: string, language: string = 'python', provider?: string): Promise<TutorResponse> {
    const selectedProvider = provider && this.availableProviders.includes(provider) ? provider : this.primaryProvider;
    
    // Add context and datasets to the question
    const enhancedQuestion = this.enhanceQuestionWithContext(question, language);
    
    try {
      switch (selectedProvider) {
        case 'openai':
          return await this.answerWithOpenAI(enhancedQuestion, language);
        case 'openrouter':
          return await openRouterAIService.answerCodingQuestion(enhancedQuestion, language);
        case 'mistral':
          return await mistralAIService.answerCodingQuestion(enhancedQuestion, language);
        case 'gemini':
          return await this.answerWithGemini(enhancedQuestion, language);
        case 'huggingface':
          return await this.answerWithHuggingFace(enhancedQuestion, language);
        case 'ollama':
          return await this.answerWithOllama(enhancedQuestion, language);
        default:
          return await this.answerWithGemini(enhancedQuestion, language);
      }
    } catch (error) {
      console.error(`Error with ${selectedProvider}, trying fallback:`, error);
      // Try fallback providers
      for (const fallbackProvider of this.availableProviders) {
        if (fallbackProvider !== selectedProvider) {
          try {
            return await this.answerCodingQuestion(question, language, fallbackProvider);
          } catch (fallbackError) {
            console.error(`Fallback ${fallbackProvider} also failed:`, fallbackError);
          }
        }
      }
      throw new Error('All AI providers failed');
    }
  }

  private enhanceQuestionWithContext(question: string, language: string): string {
    const context = `
You are an expert coding tutor with access to comprehensive programming datasets. Here's the context:

PROGRAMMING DATASETS AVAILABLE:
- Algorithm implementations and explanations
- Data structure examples and use cases
- Common programming patterns and best practices
- Debugging techniques and solutions
- Performance optimization strategies
- Code quality and style guidelines

LANGUAGE-SPECIFIC KNOWLEDGE BASE:
${this.getLanguageSpecificContext(language)}

Please provide a comprehensive, educational response that includes:
1. Clear explanation with examples
2. Code snippets with proper syntax
3. Best practices and common pitfalls
4. Related concepts and further learning suggestions

QUESTION: ${question}
`;
    return context;
  }

  private getLanguageSpecificContext(language: string): string {
    const contexts: Record<string, string> = {
      python: `
- Python syntax, PEP 8 style guide
- Built-in data structures (lists, dicts, sets, tuples)
- Object-oriented programming concepts
- Exception handling and debugging
- Popular libraries (numpy, pandas, requests, etc.)
- Pythonic ways and idioms`,
      javascript: `
- ES6+ features and modern JavaScript
- DOM manipulation and event handling
- Asynchronous programming (Promises, async/await)
- Node.js and npm ecosystem
- Popular frameworks (React, Vue, Angular)
- Browser APIs and Web APIs`,
      java: `
- Object-oriented programming principles
- Collections framework and generics
- Exception handling and logging
- Spring framework and annotations
- JVM concepts and memory management
- Design patterns and best practices`,
      cpp: `
- Memory management and pointers
- STL containers and algorithms
- Object-oriented and generic programming
- RAII and smart pointers
- Template metaprogramming
- Performance optimization techniques`
    };
    
    return contexts[language.toLowerCase()] || `
- General programming concepts
- Data structures and algorithms
- Software design principles
- Testing and debugging techniques
- Code optimization and best practices`;
  }

  private async answerWithOpenAI(question: string, language: string): Promise<TutorResponse> {
    // Implementation for OpenAI
    const response = await geminiAIService.answerCodingQuestion(question, language);
    return {
      explanation: response.explanation,
      codeExample: response.codeExample,
      relatedTopics: response.relatedTopics || []
    };
  }

  private async answerWithGemini(question: string, language: string): Promise<TutorResponse> {
    const response = await geminiAIService.answerCodingQuestion(question, language);
    return {
      explanation: response.explanation,
      codeExample: response.codeExample,
      relatedTopics: response.relatedTopics || []
    };
  }

  private async answerWithHuggingFace(question: string, language: string): Promise<TutorResponse> {
    const response = await huggingFaceAIService.answerCodingQuestion(question, language);
    return {
      explanation: response.explanation,
      codeExample: response.codeExample,
      relatedTopics: response.relatedTopics || []
    };
  }

  private async answerWithOllama(question: string, language: string): Promise<TutorResponse> {
    const response = await ollamaAIService.answerCodingQuestion(question, language);
    return {
      explanation: response.explanation,
      codeExample: response.codeExample,
      relatedTopics: response.relatedTopics || []
    };
  }


  async analyzeCode(code: string, language: string = 'python', provider?: string): Promise<CodeAnalysis> {
    const selectedProvider = provider && this.availableProviders.includes(provider) ? provider : this.primaryProvider;
    
    try {
      switch (selectedProvider) {
        case 'gemini':
          return await geminiAIService.analyzeCode(code, language);
        case 'openrouter':
          return await openRouterAIService.analyzeCode(code, language);
        case 'mistral':
          return await mistralAIService.analyzeCode(code, language);
        case 'ollama':
          return await ollamaAIService.analyzeCode(code, language);
        case 'huggingface':
          return await huggingFaceAIService.analyzeCode(code, language);
        default:
          return await geminiAIService.analyzeCode(code, language);
      }
    } catch (error) {
      console.error(`Error with ${selectedProvider}, trying fallback:`, error);
      // Try fallback providers
      for (const fallbackProvider of this.availableProviders) {
        if (fallbackProvider !== selectedProvider) {
          try {
            return await this.analyzeCode(code, language, fallbackProvider);
          } catch (fallbackError) {
            console.error(`Fallback ${fallbackProvider} also failed:`, fallbackError);
          }
        }
      }
      throw new Error('All AI providers failed');
    }
  }

  async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium', provider?: string): Promise<QuizQuestion[]> {
    const selectedProvider = provider && this.availableProviders.includes(provider) ? provider : this.primaryProvider;
    
    try {
      switch (selectedProvider) {
        case 'gemini':
          return await geminiAIService.generateQuiz(topic, difficulty);
        case 'openrouter':
          return await openRouterAIService.generateQuiz(topic, difficulty);
        case 'mistral':
          return await mistralAIService.generateQuiz(topic, difficulty);
        case 'ollama':
          return await ollamaAIService.generateQuiz(topic, difficulty);
        case 'huggingface':
          return await huggingFaceAIService.generateQuiz(topic, difficulty);
        default:
          return await geminiAIService.generateQuiz(topic, difficulty);
      }
    } catch (error) {
      console.error(`Error with ${selectedProvider}, trying fallback:`, error);
      // Try fallback providers
      for (const fallbackProvider of this.availableProviders) {
        if (fallbackProvider !== selectedProvider) {
          try {
            return await this.generateQuiz(topic, difficulty, fallbackProvider);
          } catch (fallbackError) {
            console.error(`Fallback ${fallbackProvider} also failed:`, fallbackError);
          }
        }
      }
      throw new Error('All AI providers failed');
    }
  }

  async explainAlgorithm(algorithm: string, language: string = 'python', provider?: string): Promise<TutorResponse> {
    const selectedProvider = provider && this.availableProviders.includes(provider) ? provider : this.primaryProvider;
    
    try {
      switch (selectedProvider) {
        case 'gemini':
          return await geminiAIService.explainAlgorithm(algorithm, language);
        case 'ollama':
          return await ollamaAIService.explainAlgorithm(algorithm, language);
        case 'huggingface':
          return await huggingFaceAIService.explainAlgorithm(algorithm, language);
        default:
          return await geminiAIService.explainAlgorithm(algorithm, language);
      }
    } catch (error) {
      console.error(`Error with ${selectedProvider}, trying fallback:`, error);
      // Try fallback providers
      for (const fallbackProvider of this.availableProviders) {
        if (fallbackProvider !== selectedProvider) {
          try {
            return await this.explainAlgorithm(algorithm, language, fallbackProvider);
          } catch (fallbackError) {
            console.error(`Fallback ${fallbackProvider} also failed:`, fallbackError);
          }
        }
      }
      throw new Error('All AI providers failed');
    }
  }

  async executeCode(code: string, language: string, stdin?: string): Promise<any> {
    if (this.codeProvider === 'piston') {
      return await pistonExecutionService.executeCodeWithTimeout(code, language, stdin);
    } else {
      throw new Error('Judge0 integration not implemented in this service');
    }
  }

  async validateCode(code: string, language: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    if (this.codeProvider === 'piston') {
      return await pistonExecutionService.validateCode(code, language);
    } else {
      throw new Error('Judge0 integration not implemented in this service');
    }
  }

  async getSupportedLanguages(): Promise<any[]> {
    if (this.codeProvider === 'piston') {
      return await pistonExecutionService.getSupportedLanguages();
    } else {
      throw new Error('Judge0 integration not implemented in this service');
    }
  }

  async speechToText(audioBuffer: Buffer, languageCode: string = 'en-US'): Promise<{
    transcript: string;
    confidence: number;
    language: string;
  }> {
    if (this.voiceProvider === 'whisper') {
      return await whisperVoiceService.speechToText(audioBuffer, languageCode);
    } else {
      throw new Error('Google Cloud Speech integration not implemented in this service');
    }
  }

  async textToSpeech(text: string, languageCode: string = 'en-US', voiceName?: string): Promise<{
    audioBuffer: Buffer;
    contentType: string;
  }> {
    if (this.ttsProvider === 'coqui') {
      return await coquiTTSService.textToSpeech(text, languageCode, voiceName);
    } else {
      throw new Error('Google Cloud TTS integration not implemented in this service');
    }
  }

  async getAvailableVoices(languageCode?: string): Promise<any[]> {
    if (this.ttsProvider === 'coqui') {
      return await coquiTTSService.getAvailableVoices(languageCode);
    } else {
      throw new Error('Google Cloud TTS integration not implemented in this service');
    }
  }

  async getServiceStatus(): Promise<{
    ai: string;
    codeExecution: string;
    voice: string;
    tts: string;
    available: boolean;
  }> {
    const status = {
      ai: this.primaryProvider,
      codeExecution: this.codeProvider,
      voice: this.voiceProvider,
      tts: this.ttsProvider,
      available: true,
    };

    // Check availability of services
    try {
      if (this.primaryProvider === 'ollama') {
        status.available = await ollamaAIService.isAvailable();
      } else if (this.primaryProvider === 'huggingface') {
        status.available = await huggingFaceAIService.isAvailable();
      }

      if (this.codeProvider === 'piston') {
        status.available = status.available && await pistonExecutionService.isAvailable();
      }

      if (this.voiceProvider === 'whisper') {
        status.available = status.available && await whisperVoiceService.isServiceAvailable();
      }

      if (this.ttsProvider === 'coqui') {
        status.available = status.available && await coquiTTSService.isServiceAvailable();
      }
    } catch (error) {
      status.available = false;
    }

    return status;
  }
}

export const multiAIService = new MultiAIService();
