import type { Request, Response } from 'express';
import type { Multer } from 'multer';
import { z } from 'zod';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
import { aiTutorService } from '../services/ai-tutor.service';
import { voiceService } from '../services/voice.service';
import { codeExecutionService } from '../services/code-execution.service';
import { geminiAIService } from '../services/gemini-ai.service';
import { multiAIService } from '../services/multi-ai.service';

const askQuestionSchema = z.object({
  question: z.string().min(1),
  language: z.string().optional().default('python'),
  context: z.string().optional(),
  provider: z.string().optional(),
});

const analyzeCodeSchema = z.object({
  code: z.string().min(1),
  language: z.string().optional().default('python'),
});

const generateQuizSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  count: z.number().min(1).max(10).optional().default(3),
});

const explainAlgorithmSchema = z.object({
  algorithm: z.string().min(1),
  language: z.string().optional().default('python'),
});

export async function askQuestion(req: Request, res: Response) {
  try {
    const parsed = askQuestionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
    }

    const { question, language, context, provider } = parsed.data;
    const fullQuestion = context ? `${context}\n\n${question}` : question;
    
    const response = await multiAIService.answerCodingQuestion(fullQuestion, language, provider);
    res.json(response);
  } catch (error) {
    console.error('Error in askQuestion:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
}

export async function analyzeCode(req: Request, res: Response) {
  try {
    const parsed = analyzeCodeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
    }

    const { code, language } = parsed.data;
    const analysis = await aiTutorService.analyzeCode(code, language);
    res.json(analysis);
  } catch (error) {
    console.error('Error in analyzeCode:', error);
    res.status(500).json({ error: 'Failed to analyze code' });
  }
}

export async function generateQuiz(req: Request, res: Response) {
  try {
    const parsed = generateQuizSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
    }

    const { topic, difficulty, count } = parsed.data;
    const quizzes = await aiTutorService.generateQuiz(topic, difficulty);
    
    // Limit to requested count
    const limitedQuizzes = quizzes.slice(0, count);
    res.json(limitedQuizzes);
  } catch (error) {
    console.error('Error in generateQuiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
}

export async function explainAlgorithm(req: Request, res: Response) {
  try {
    const parsed = explainAlgorithmSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
    }

    const { algorithm, language } = parsed.data;
    const explanation = await multiAIService.explainAlgorithm(algorithm, language);
    res.json(explanation);
  } catch (error) {
    console.error('Error in explainAlgorithm:', error);
    res.status(500).json({ error: 'Failed to explain algorithm' });
  }
}

export async function getAvailableProviders(req: Request, res: Response) {
  try {
    const providers = multiAIService.getAvailableProviders();
    const primaryProvider = multiAIService.getPrimaryProvider();
    
    res.json({
      availableProviders: providers,
      primaryProvider,
      providerInfo: {
        gemini: {
          name: 'Google Gemini',
          description: 'Advanced AI model by Google',
          features: ['Code generation', 'Analysis', 'Explanation']
        },
        openai: {
          name: 'OpenAI GPT',
          description: 'Advanced AI model by OpenAI',
          features: ['Code generation', 'Analysis', 'Explanation']
        },
        huggingface: {
          name: 'Hugging Face',
          description: 'Open-source AI models',
          features: ['Code generation', 'Analysis']
        },
        ollama: {
          name: 'Ollama',
          description: 'Local AI models',
          features: ['Code generation', 'Analysis', 'Privacy-focused']
        }
      }
    });
  } catch (error) {
    console.error('Error getting available providers:', error);
    res.status(500).json({ error: 'Failed to get available providers' });
  }
}

export async function speechToText(req: MulterRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { language } = req.query;
    const audioBuffer = req.file.buffer;
    
    const result = await voiceService.speechToText(
      audioBuffer, 
      (language as string) || 'en-US'
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error in speechToText:', error);
    res.status(500).json({ error: 'Failed to convert speech to text' });
  }
}

export async function textToSpeech(req: Request, res: Response) {
  try {
    const { text, language, voice } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const result = await voiceService.textToSpeech(
      text, 
      language || 'en-US', 
      voice
    );
    
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Length', result.audioBuffer.length);
    res.send(result.audioBuffer);
  } catch (error) {
    console.error('Error in textToSpeech:', error);
    res.status(500).json({ error: 'Failed to convert text to speech' });
  }
}

export async function executeCode(req: Request, res: Response) {
  try {
    const { code, language, stdin, expectedOutput } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const languageId = codeExecutionService.getLanguageId(language);
    const result = await codeExecutionService.executeCodeWithTimeout({
      source_code: code,
      language_id: languageId,
      stdin: stdin || '',
      expected_output: expectedOutput,
    });

    res.json(result);
  } catch (error) {
    console.error('Error in executeCode:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
}

export async function validateCode(req: Request, res: Response) {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const validation = await codeExecutionService.validateCode(code, language);
    res.json(validation);
  } catch (error) {
    console.error('Error in validateCode:', error);
    res.status(500).json({ error: 'Failed to validate code' });
  }
}

export async function getSupportedLanguages(req: Request, res: Response) {
  try {
    const languages = await codeExecutionService.getSupportedLanguages();
    res.json(languages);
  } catch (error) {
    console.error('Error in getSupportedLanguages:', error);
    res.status(500).json({ error: 'Failed to get supported languages' });
  }
}

export async function getAvailableVoices(req: Request, res: Response) {
  try {
    const { language } = req.query;
    const voices = await voiceService.getAvailableVoices(language as string);
    res.json(voices);
  } catch (error) {
    console.error('Error in getAvailableVoices:', error);
    res.status(500).json({ error: 'Failed to get available voices' });
  }
}

// Gemini-specific endpoints
export async function debugCode(req: Request, res: Response) {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const debugResult = await geminiAIService.debugCode(code, language);
    res.json(debugResult);
  } catch (error) {
    console.error('Error in debugCode:', error);
    res.status(500).json({ error: 'Failed to debug code' });
  }
}

export async function explainCode(req: Request, res: Response) {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const explanation = await geminiAIService.generateCodeExplanation(code, language);
    res.json(explanation);
  } catch (error) {
    console.error('Error in explainCode:', error);
    res.status(500).json({ error: 'Failed to explain code' });
  }
}

// Free service endpoints
export async function askQuestionFree(req: Request, res: Response) {
  try {
    const parsed = askQuestionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
    }

    const { question, language, context } = parsed.data;
    const fullQuestion = context ? `${context}\n\n${question}` : question;
    
    const response = await multiAIService.answerCodingQuestion(fullQuestion, language);
    res.json(response);
  } catch (error) {
    console.error('Error in askQuestionFree:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
}

export async function executeCodeFree(req: Request, res: Response) {
  try {
    const { code, language, stdin } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const result = await multiAIService.executeCode(code, language, stdin);
    res.json(result);
  } catch (error) {
    console.error('Error in executeCodeFree:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
}

export async function speechToTextFree(req: MulterRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { language } = req.query;
    const audioBuffer = req.file.buffer;
    
    const result = await multiAIService.speechToText(
      audioBuffer, 
      (language as string) || 'en-US'
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error in speechToTextFree:', error);
    res.status(500).json({ error: 'Failed to convert speech to text' });
  }
}

export async function textToSpeechFree(req: Request, res: Response) {
  try {
    const { text, language, voice } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const result = await multiAIService.textToSpeech(
      text, 
      language || 'en-US', 
      voice
    );
    
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Length', result.audioBuffer.length);
    res.send(result.audioBuffer);
  } catch (error) {
    console.error('Error in textToSpeechFree:', error);
    res.status(500).json({ error: 'Failed to convert text to speech' });
  }
}

export async function getServiceStatus(req: Request, res: Response) {
  try {
    const status = await multiAIService.getServiceStatus();
    res.json(status);
  } catch (error) {
    console.error('Error in getServiceStatus:', error);
    res.status(500).json({ error: 'Failed to get service status' });
  }
}
