import axios from 'axios';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

// Minimal wrapper around OpenRouter's OpenAI-compatible chat API
async function chat(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  // Optional but recommended per OpenRouter guidelines
  if (process.env.OPENROUTER_SITE_URL) headers['HTTP-Referer'] = process.env.OPENROUTER_SITE_URL;
  if (process.env.OPENROUTER_APP_NAME) headers['X-Title'] = process.env.OPENROUTER_APP_NAME;

  const response = await axios.post(
    `${OPENROUTER_BASE_URL}/chat/completions`,
    {
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.4,
    },
    { headers }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenRouter returned no content');
  return content as string;
}

export const openRouterAIService = {
  async isAvailable(): Promise<boolean> {
    return Boolean(process.env.OPENROUTER_API_KEY);
  },

  async answerCodingQuestion(question: string, language: string) {
    const content = await chat([
      { 
        role: 'system', 
        content: 'You are an expert programming tutor specializing in code education. Provide clear, comprehensive explanations with practical code examples. Always include runnable code snippets when relevant.' 
      },
      { 
        role: 'user', 
        content: `Language: ${language}\n\nQuestion: ${question}\n\nPlease provide:\n1. A clear explanation\n2. A practical code example\n3. Related topics to explore` 
      },
    ]);
    
    // Parse response to extract structure
    const codeBlock = content.match(/```[\s\S]*?```/);
    const codeExample = codeBlock ? codeBlock[0].replace(/```/g, '').trim() : undefined;
    
    const topics: string[] = [];
    const topicPattern = /(?:related|topics?|concepts?|learn|explore)[:\s]+([^\n]+)/i;
    const match = content.match(topicPattern);
    if (match) {
      topics.push(...match[1].split(',').map(t => t.trim()));
    }
    
    return {
      explanation: content,
      codeExample,
      relatedTopics: topics,
    };
  },

  async analyzeCode(code: string, language: string) {
    const content = await chat([
      { role: 'system', content: 'You analyze code. Return a short list of issues and suggestions.' },
      { role: 'user', content: `Analyze this ${language} code and provide errors, suggestions, explanation:\n\n${code}` },
    ]);
    return {
      errors: [],
      suggestions: [],
      explanation: content,
    };
  },

  async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard') {
    const content = await chat([
      { role: 'system', content: 'Generate multiple-choice questions. Provide 3 options and indicate the correct answer.' },
      { role: 'user', content: `Create 3 ${difficulty} quiz questions about: ${topic}` },
    ]);
    // Minimal parsing: return as a single question with explanation block
    return [
      {
        question: `Quiz on ${topic}`,
        options: [content.slice(0, 30) + ' A', content.slice(0, 30) + ' B', content.slice(0, 30) + ' C'],
        correctAnswer: 0,
        explanation: content,
        difficulty,
      },
    ];
  },
};


