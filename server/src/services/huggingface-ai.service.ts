import { HfInference } from '@huggingface/inference';

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

export class HuggingFaceAIService {
  private hf: HfInference;
  private model: string;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.model = process.env.HUGGINGFACE_MODEL || 'tiiuae/falcon-7b-instruct';
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
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        }
      });

      const text = response.generated_text;
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        // Fallback if JSON parsing fails
        return {
          explanation: text,
          codeExample: '',
          visualization: '',
          quiz: [],
          relatedTopics: [],
        };
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error calling Hugging Face:', error);
      throw new Error('Failed to get AI response from Hugging Face');
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
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.3,
          return_full_text: false,
        }
      });

      const text = response.generated_text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON response found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error analyzing code with Hugging Face:', error);
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
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 600,
          temperature: 0.5,
          return_full_text: false,
        }
      });

      const text = response.generated_text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating quiz with Hugging Face:', error);
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
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1200,
          temperature: 0.6,
          return_full_text: false,
        }
      });

      const text = response.generated_text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON response found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error explaining algorithm with Hugging Face:', error);
      throw new Error('Failed to explain algorithm');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Test with a simple request
      await this.hf.textGeneration({
        model: this.model,
        inputs: 'Hello',
        parameters: {
          max_new_tokens: 10,
        }
      });
      return true;
    } catch (error) {
      console.log('Hugging Face not available:', error);
      return false;
    }
  }
}

export const huggingFaceAIService = new HuggingFaceAIService();
