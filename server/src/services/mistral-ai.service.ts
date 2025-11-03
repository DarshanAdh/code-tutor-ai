import axios from 'axios';

const MISTRAL_BASE_URL = process.env.MISTRAL_BASE_URL || 'https://api.mistral.ai/v1';
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';

async function chat(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('MISTRAL_API_KEY is not set');

  const response = await axios.post(
    `${MISTRAL_BASE_URL}/chat/completions`,
    {
      model: MISTRAL_MODEL,
      messages,
      temperature: 0.4,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Mistral returned no content');
  return content as string;
}

export const mistralAIService = {
  async isAvailable(): Promise<boolean> {
    return Boolean(process.env.MISTRAL_API_KEY);
  },

  async answerCodingQuestion(question: string, language: string) {
    const content = await chat([
      { 
        role: 'system', 
        content: 'You are an expert programming tutor. Provide clear, comprehensive explanations with practical code examples. Always include runnable code snippets when relevant.' 
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
      { role: 'system', content: 'Analyze code and summarize issues and improvements.' },
      { role: 'user', content: `Analyze this ${language} code:\n\n${code}` },
    ]);
    return {
      errors: [],
      suggestions: [],
      explanation: content,
    };
  },

  async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard') {
    const content = await chat([
      { role: 'system', content: 'Generate multiple-choice questions.' },
      { role: 'user', content: `Create 3 ${difficulty} quiz questions about: ${topic}` },
    ]);
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


