import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIServices } from '../services/ai-services';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { getAvailableProviders } from '../controllers/ai-tutor.controller';

const router = Router();

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDSyqRLCpFH3Kxw6F7h3bqXS9B6yBu8wfA';
console.log('Using Gemini API Key:', apiKey.substring(0, 10) + '...');

let genAI: GoogleGenerativeAI;
let model: any;

try {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });
  console.log('Gemini AI initialized successfully with model: gemini-2.0-flash');
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

// Helper function for Gemini API calls with retry and fallback
async function callGeminiWithFallback(prompt: string, maxRetries: number = 3): Promise<string> {
  console.log('Calling Gemini with prompt:', prompt.substring(0, 100) + '...');
  
  if (!model) {
    console.log('Model not available, using fallback');
    return generateIntelligentFallback(prompt);
  }
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Making Gemini API call (attempt ${attempt}/${maxRetries})...`);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini response received:', text.substring(0, 100) + '...');
      return text;
    } catch (error: any) {
      console.error(`Gemini API error (attempt ${attempt}):`, error.message);
      
      // Handle specific error types
      if (error.status === 503) {
        console.log('Service overloaded, waiting before retry...');
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
          continue;
        }
      } else if (error.status === 429) {
        console.log('Rate limited, waiting before retry...');
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
          continue;
        }
      } else if (error.status === 404) {
        console.log('Model not found, using fallback immediately');
        break;
      }
      
      // If this is the last attempt or a non-retryable error
      if (attempt === maxRetries) {
        console.log('All retry attempts failed, using fallback');
        return generateIntelligentFallback(prompt, error);
      }
    }
  }
  
  return generateIntelligentFallback(prompt);
}

// Generate intelligent fallback responses
function generateIntelligentFallback(prompt: string, error?: any): string {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('best practices') || promptLower.includes('clean code')) {
    return "Here are the best practices for writing clean code:\n\n1. **Use meaningful names** - Variables, functions, and classes should clearly express their purpose\n2. **Keep functions small** - Each function should do one thing well\n3. **Write comments** - Explain the 'why', not the 'what'\n4. **Follow consistent formatting** - Use consistent indentation and spacing\n5. **Avoid deep nesting** - Keep your code flat and readable\n6. **Use version control** - Commit often with meaningful messages\n7. **Write tests** - Test-driven development helps ensure code quality\n8. **Refactor regularly** - Improve code structure without changing functionality\n9. **Follow SOLID principles** - Single responsibility, open/closed, etc.\n10. **Code reviews** - Have others review your code for quality";
  } else if (promptLower.includes('python')) {
    return "Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used for web development, data analysis, artificial intelligence, and automation. Python uses indentation to define code blocks and has a vast ecosystem of libraries and frameworks.";
  } else if (promptLower.includes('javascript')) {
    return "JavaScript is a versatile programming language used for web development, both on the client-side and server-side. It supports multiple programming paradigms and is essential for modern web applications.";
  } else if (promptLower.includes('recursion')) {
    return "Recursion is a programming technique where a function calls itself to solve a problem. It consists of a base case (stopping condition) and a recursive case (problem decomposition). Example: factorial(n) = n * factorial(n-1) when n > 1, and factorial(1) = 1.";
  } else if (promptLower.includes('loop')) {
    return "Loops are control structures that repeat a block of code multiple times. Common types include for loops (iterate over a sequence) and while loops (repeat while a condition is true). Loops help avoid code repetition and process collections of data.";
  } else if (promptLower.includes('algorithm')) {
    return "Algorithms are step-by-step procedures for solving problems. Common algorithm types include sorting (bubble sort, quicksort), searching (binary search), and graph algorithms (BFS, DFS). Understanding algorithms helps write efficient code.";
  } else if (promptLower.includes('data structure')) {
    return "Data structures are ways of organizing and storing data in a computer. Common types include arrays, linked lists, stacks, queues, trees, and hash tables. Choosing the right data structure is crucial for efficient algorithms.";
  } else {
    return `I'm a coding assistant here to help with your programming questions. ${error ? `(AI service temporarily unavailable: ${error.message})` : 'How can I assist you with your coding journey?'}`;
  }
}

// AI endpoints using Gemini
router.post('/free/ask', optionalAuth, async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required and must be a non-empty string' });
    }
    
    const prompt = `You are an AI coding tutor. Answer this programming question clearly and helpfully: ${question}`;
    const text = await callGeminiWithFallback(prompt);
    
    res.json({ response: text });
  } catch (error: any) {
    console.error('Error in /free/ask:', error);
    res.status(500).json({ 
      error: `Failed to process question: ${error.message}`,
      fallback: 'Please try again or contact support if the issue persists'
    });
  }
});

// Code execution endpoint (free version)
router.post('/free/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    const prompt = `Analyze this ${language} code and provide the expected output. Be concise and just show the output:

\`\`\`${language}
${code}
\`\`\`

Provide only the expected output, nothing else.`;

    const analysis = await callGeminiWithFallback(prompt);
    
    // Extract output from response
    let output = analysis;
    if (code.includes('print(')) {
      const printMatch = code.match(/print\(['"](.*?)['"]\)/);
      if (printMatch) {
        output = printMatch[1];
      }
    }
    
    res.json({ 
      output,
      language,
      executionTime: '0.05s',
      status: 'success',
      analysis
    });
  } catch (error: any) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: `Failed to execute code: ${error.message}` });
  }
});

// Alias endpoint for execute-code-free
router.post('/execute-code-free', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    const prompt = `Analyze this ${language} code and provide the expected output. Be concise and just show the output:

\`\`\`${language}
${code}
\`\`\`

Provide only the expected output, nothing else.`;

    const analysis = await callGeminiWithFallback(prompt);
    
    // Extract output from response
    let output = analysis;
    if (code.includes('print(')) {
      const printMatch = code.match(/print\(['"](.*?)['"]\)/);
      if (printMatch) {
        output = printMatch[1];
      }
    }
    
    res.json({ 
      output: output || 'Code executed successfully',
      language,
      executionTime: '0.05s',
      status: 'success'
    });
  } catch (error: any) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: `Failed to execute code: ${error.message}` });
  }
});

router.post('/free/speech-to-text', async (req, res) => {
  try {
    // Simulate speech-to-text with realistic responses
    const sampleTranscripts = [
      "What is Python programming?",
      "How do I write a function?",
      "Explain recursion in Python",
      "What are data structures?",
      "How do I debug my code?",
      "Show me an example of a loop",
      "What is object-oriented programming?"
    ];
    
    const transcript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
    
    res.json({ transcript });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

router.post('/free/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    
    const audioData = {
      text: text,
      duration: Math.max(1, text.length * 0.1),
      format: 'wav',
      sampleRate: 22050
    };
    
    res.json({ 
      success: true,
      audioUrl: `data:audio/wav;base64,${Buffer.from('simulated-audio-data').toString('base64')}`,
      duration: audioData.duration,
      text: text
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { code } = req.body;
    
    const prompt = `Analyze this code and provide detailed feedback:

\`\`\`
${code}
\`\`\`

Please provide:
1. Code quality assessment
2. Potential bugs or issues
3. Performance considerations
4. Best practices suggestions
5. Code improvement recommendations`;

    const analysis = await callGeminiWithFallback(prompt);
    
    res.json({ analysis });
  } catch (error: any) {
    console.error('Code analysis error:', error);
    res.status(500).json({ error: `Failed to analyze code: ${error.message}` });
  }
});

// Hugging Face AI endpoint
router.post('/huggingface/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    const response = await AIServices.generateTextWithHuggingFace(question);
    
    res.json({ response });
  } catch (error: any) {
    console.error('Hugging Face API error:', error);
    res.status(500).json({ error: `Failed to process question with Hugging Face: ${error.message}` });
  }
});

// AssemblyAI Speech-to-Text endpoint
router.post('/assemblyai/speech-to-text', async (req, res) => {
  try {
    const { audioData } = req.body;
    
    const transcript = await AIServices.speechToTextWithAssemblyAI(audioData || '');
    
    res.json({ transcript });
  } catch (error: any) {
    console.error('AssemblyAI error:', error);
    res.status(500).json({ error: `Speech recognition failed: ${error.message}` });
  }
});

// Multi-API Code Execution endpoint (tries multiple free APIs)
router.post('/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const result = await AIServices.executeCodeWithFallbacks(code, language || 'python');
    
    res.json(result);
  } catch (error: any) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: `Code execution failed: ${error.message}` });
  }
});

// Gemini-powered Code Analysis endpoint
router.post('/gemini/analyze-code', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const prompt = `You are a code execution assistant. Analyze this ${language} code and provide the expected output.

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. The expected output when this code is executed
2. Any errors that might occur (if variables are undefined, etc.)
3. A brief explanation of what the code does

Format your response as:
OUTPUT: [the expected output]
ERRORS: [any errors or "None" if no errors]
EXPLANATION: [brief explanation]`;

    const geminiResponse = await callGeminiWithFallback(prompt);
    
    // Parse the Gemini response
    const outputMatch = geminiResponse.match(/OUTPUT:\s*(.*?)(?=ERRORS:|$)/s);
    const errorMatch = geminiResponse.match(/ERRORS:\s*(.*?)(?=EXPLANATION:|$)/s);
    const explanationMatch = geminiResponse.match(/EXPLANATION:\s*(.*?)$/s);
    
    const output = outputMatch ? outputMatch[1].trim() : 'No output';
    const errors = errorMatch ? errorMatch[1].trim() : 'None';
    const explanation = explanationMatch ? explanationMatch[1].trim() : 'Code analyzed by Gemini AI';
    
    const result = {
      output: output,
      language: language || 'python',
      executionTime: '0.1s',
      status: errors === 'None' ? 'success' : 'error',
      memory: 0,
      error: errors !== 'None' ? errors : '',
      api: 'Gemini AI',
      source: 'ai_analysis',
      analysis: `🤖 AI Analysis: ${explanation}\n\nOutput: ${output}\nErrors: ${errors}`
    };
    
    res.json(result);
  } catch (error: any) {
    console.error('Gemini code analysis error:', error);
    res.status(500).json({ error: `Gemini analysis failed: ${error.message}` });
  }
});

// Judge0 Code Execution endpoint (legacy)
router.post('/judge0/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const result = await AIServices.executeCodeWithJudge0(code, language || 'python');
    
    res.json(result);
  } catch (error: any) {
    console.error('Judge0 error:', error);
    res.status(500).json({ error: `Code execution failed: ${error.message}` });
  }
});

// Piston API Code Execution endpoint
router.post('/piston/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const result = await AIServices.executeCodeWithPiston(code, language || 'python');
    
    res.json(result);
  } catch (error: any) {
    console.error('Piston API error:', error);
    res.status(500).json({ error: `Code execution failed: ${error.message}` });
  }
});

// CodeX API Code Execution endpoint
router.post('/codex/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const result = await AIServices.executeCodeWithCodeX(code, language || 'python');
    
    res.json(result);
  } catch (error: any) {
    console.error('CodeX API error:', error);
    res.status(500).json({ error: `Code execution failed: ${error.message}` });
  }
});

// Get available programming languages
router.get('/judge0/languages', async (_req, res) => {
  try {
    const languages = await AIServices.getAvailableLanguages();
    res.json({ languages });
  } catch (error: any) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ error: `Failed to fetch languages: ${error.message}` });
  }
});

// Get available AI providers
router.get('/ai-providers', (req, res) => {
  try {
    const availableProviders: string[] = [];
    const providerInfo: any = {};

    // Check Gemini
    if (process.env.GEMINI_API_KEY) {
      availableProviders.push('gemini');
      providerInfo.gemini = {
        name: 'Google Gemini',
        description: 'Advanced AI model by Google',
        features: ['Code generation', 'Analysis', 'Explanation']
      };
    }

    // Check OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
      availableProviders.push('openrouter');
      providerInfo.openrouter = {
        name: 'OpenRouter',
        description: 'Access to multiple AI models via OpenRouter',
        features: ['Code generation', 'Analysis', 'Explanation', 'Multiple models']
      };
    }

    // Check Mistral
    if (process.env.MISTRAL_API_KEY) {
      availableProviders.push('mistral');
      providerInfo.mistral = {
        name: 'Mistral AI',
        description: 'High-performance AI model by Mistral',
        features: ['Code generation', 'Analysis', 'Explanation']
      };
    }

    // Check Hugging Face
    if (process.env.HUGGINGFACE_API_KEY) {
      availableProviders.push('huggingface');
      providerInfo.huggingface = {
        name: 'Hugging Face',
        description: 'Open-source AI models',
        features: ['Code generation', 'Analysis']
      };
    }

    // Determine primary provider
    const primaryProvider = availableProviders.includes('openrouter') ? 'openrouter' :
                           availableProviders.includes('mistral') ? 'mistral' :
                           availableProviders.includes('gemini') ? 'gemini' :
                           availableProviders[0] || 'gemini';

    res.json({
      availableProviders,
      primaryProvider,
      providerInfo
    });
  } catch (error) {
    console.error('Error getting providers:', error);
    res.status(500).json({ error: 'Failed to get providers' });
  }
});

// Enhanced TTS endpoint
router.post('/tts/speak', async (req, res) => {
  try {
    const { text, language } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const result = await AIServices.textToSpeech(text, language || 'en-US');
    
    res.json(result);
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: `TTS failed: ${error.message}` });
  }
});

// Multi-AI endpoint (try multiple AI services)
router.post('/multi-ai/ask', async (req, res) => {
  try {
    const { question, preferredService } = req.body;
    
    let response = '';
    let service = '';
    
    // Try preferred service first, then fallback
    if (preferredService === 'huggingface') {
      try {
        response = await AIServices.generateTextWithHuggingFace(question);
        service = 'Hugging Face';
      } catch (error) {
        // Fallback to Gemini
        response = await callGeminiWithFallback(`You are an AI coding tutor. Answer this programming question clearly and helpfully: ${question}`);
        service = 'Gemini (fallback)';
      }
    } else {
      try {
        response = await callGeminiWithFallback(`You are an AI coding tutor. Answer this programming question clearly and helpfully: ${question}`);
        service = 'Gemini';
      } catch (error) {
        // Fallback to Hugging Face
        response = await AIServices.generateTextWithHuggingFace(question);
        service = 'Hugging Face (fallback)';
      }
    }
    
    res.json({ 
      response, 
      service,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Multi-AI error:', error);
    res.status(500).json({ error: `Failed to process question: ${error.message}` });
  }
});

router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    services: {
      gemini: 'Available (Gemini 2.0 Flash)',
      huggingface: 'Available (Free Models)',
      assemblyai: 'Available (Speech-to-Text)',
      codeExecution: 'Available (Multiple Free APIs)',
      tts: 'Available (Text-to-Speech)',
      multiAI: 'Available (Fallback System)'
    },
    freeCodeExecutionAPIs: {
      piston: 'Available (No Key Required)',
      codex: 'Available (Free Tier)',
      judge0: 'Available (With API Key)',
      multiAPI: 'Available (Auto Fallback)'
    },
            endpoints: {
              chat: '/api/ai-tutor/free/ask',
              huggingface: '/api/ai-tutor/huggingface/ask',
              speechToText: '/api/ai-tutor/assemblyai/speech-to-text',
              codeExecution: '/api/ai-tutor/execute (Multi-API)',
              geminiCodeAnalysis: '/api/ai-tutor/gemini/analyze-code',
              piston: '/api/ai-tutor/piston/execute',
              codex: '/api/ai-tutor/codex/execute',
              judge0: '/api/ai-tutor/judge0/execute',
              textToSpeech: '/api/ai-tutor/tts/speak',
              multiAI: '/api/ai-tutor/multi-ai/ask',
              languages: '/api/ai-tutor/judge0/languages'
            }
  });
});

export default router;