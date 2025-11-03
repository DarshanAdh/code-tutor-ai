import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

export class GeminiAIService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async answerCodingQuestion(question: string, language: string = 'python'): Promise<TutorResponse> {
    const prompt = `You are an expert coding tutor. Answer this coding question in ${language}:

Question: ${question}

Provide a comprehensive response with:
1. A clear explanation of the concept
2. A practical code example
3. Real-world use cases
4. Related topics to explore

Format your response as JSON with these exact fields:
{
  "explanation": "Clear explanation of the concept",
  "codeExample": "Practical code example",
  "visualization": "Description of how to visualize this concept",
  "quiz": [{"question": "...", "options": ["...", "..."], "correctAnswer": 0, "explanation": "...", "difficulty": "easy"}],
  "relatedTopics": ["topic1", "topic2"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON response found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      throw new Error('Failed to get AI response from Gemini');
    }
  }

  async analyzeCode(code: string, language: string = 'python'): Promise<CodeAnalysis> {
    const prompt = `Analyze this ${language} code for errors and provide suggestions:

\`\`\`${language}
${code}
\`\`\`

Provide analysis in JSON format:
{
  "errors": ["list of errors found"],
  "suggestions": ["list of improvement suggestions"],
  "explanation": "explanation of what the code does",
  "fixedCode": "corrected version if errors found"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON response found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error analyzing code with Gemini:', error);
      throw new Error('Failed to analyze code');
    }
  }

  async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<QuizQuestion[]> {
    const prompt = `Generate 3 ${difficulty} quiz questions about ${topic} in programming.

Format as JSON array:
[
  {
    "question": "What is...?",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": 0,
    "explanation": "Explanation of correct answer",
    "difficulty": "${difficulty}"
  }
]`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating quiz with Gemini:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  async explainAlgorithm(algorithm: string, language: string = 'python'): Promise<TutorResponse> {
    const prompt = `Explain the ${algorithm} algorithm in ${language}. Include:

1. Step-by-step explanation
2. Code implementation
3. Time/space complexity
4. Visualization description
5. Practice problems

Format as JSON:
{
  "explanation": "Detailed explanation",
  "codeExample": "Algorithm implementation",
  "visualization": "How to visualize this algorithm",
  "quiz": [quiz questions],
  "relatedTopics": ["related algorithms"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON response found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error explaining algorithm with Gemini:', error);
      throw new Error('Failed to explain algorithm');
    }
  }

  async debugCode(code: string, language: string = 'python'): Promise<{
    issues: string[];
    fixes: string[];
    explanation: string;
  }> {
    const prompt = `Debug this ${language} code and provide fixes:

\`\`\`${language}
${code}
\`\`\`

Format as JSON:
{
  "issues": ["list of issues found"],
  "fixes": ["suggested fixes"],
  "explanation": "explanation of the debugging process"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON response found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error debugging code with Gemini:', error);
      throw new Error('Failed to debug code');
    }
  }

  async generateCodeExplanation(code: string, language: string = 'python'): Promise<{
    explanation: string;
    lineByLine: string[];
    concepts: string[];
  }> {
    const prompt = `Explain this ${language} code line by line:

\`\`\`${language}
${code}
\`\`\`

Format as JSON:
{
  "explanation": "overall explanation",
  "lineByLine": ["explanation for each line"],
  "concepts": ["programming concepts used"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON response found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error explaining code with Gemini:', error);
      throw new Error('Failed to explain code');
    }
  }
}

export const geminiAIService = new GeminiAIService();
