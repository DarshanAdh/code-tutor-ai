import axios from 'axios';

export interface CodeExecutionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  compile_output: string;
  message: string;
  time: string;
  memory: string;
  status: {
    id: number;
    description: string;
  };
  exit_code: number;
  exit_signal: number;
}

export interface SupportedLanguage {
  id: number;
  name: string;
  version: string;
}

export class CodeExecutionService {
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor() {
    this.baseUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
    this.apiKey = process.env.JUDGE0_API_KEY;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-RapidAPI-Key'] = this.apiKey;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    return headers;
  }

  async getSupportedLanguages(): Promise<SupportedLanguage[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/languages`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw new Error('Failed to fetch supported languages');
    }
  }

  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/submissions`,
        {
          ...request,
          wait: true,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Code execution error:', error);
      throw new Error('Failed to execute code');
    }
  }

  async getSubmissionResult(token: string): Promise<CodeExecutionResult> {
    try {
      const response = await axios.get(`${this.baseUrl}/submissions/${token}`, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching submission result:', error);
      throw new Error('Failed to get submission result');
    }
  }

  getLanguageId(language: string): number {
    const languageMap: Record<string, number> = {
      'python': 71,
      'python3': 71,
      'javascript': 63,
      'java': 62,
      'cpp': 54,
      'c': 50,
      'csharp': 51,
      'go': 60,
      'rust': 73,
      'php': 68,
      'ruby': 72,
      'swift': 83,
      'kotlin': 78,
      'scala': 81,
      'r': 80,
      'bash': 46,
      'sql': 82,
      'typescript': 74,
    };

    return languageMap[language.toLowerCase()] || 71; // Default to Python
  }

  async executeCodeWithTimeout(
    request: CodeExecutionRequest,
    timeoutMs: number = 5000
  ): Promise<CodeExecutionResult> {
    try {
      // Submit code for execution
      const submitResponse = await axios.post(
        `${this.baseUrl}/submissions`,
        request,
        {
          headers: this.getHeaders(),
        }
      );

      const token = submitResponse.data.token;
      if (!token) {
        throw new Error('No token received from Judge0');
      }

      // Poll for results with timeout
      const startTime = Date.now();
      while (Date.now() - startTime < timeoutMs) {
        const result = await this.getSubmissionResult(token);
        
        // Check if execution is complete
        if (result.status.id !== 1 && result.status.id !== 2) {
          return result;
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      throw new Error('Code execution timeout');
    } catch (error) {
      console.error('Code execution with timeout error:', error);
      throw new Error('Failed to execute code within timeout');
    }
  }

  async validateCode(code: string, language: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const languageId = this.getLanguageId(language);
      const result = await this.executeCodeWithTimeout({
        source_code: code,
        language_id: languageId,
      }, 3000);

      const errors: string[] = [];
      const warnings: string[] = [];

      if (result.compile_output) {
        errors.push(result.compile_output);
      }

      if (result.stderr) {
        errors.push(result.stderr);
      }

      if (result.status.id === 3) {
        // Accepted - no errors
      } else if (result.status.id === 4) {
        errors.push('Wrong Answer');
      } else if (result.status.id === 5) {
        errors.push('Time Limit Exceeded');
      } else if (result.status.id === 6) {
        errors.push('Compilation Error');
      } else if (result.status.id === 7) {
        errors.push('Runtime Error');
      } else if (result.status.id === 8) {
        errors.push('Memory Limit Exceeded');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to validate code'],
        warnings: [],
      };
    }
  }
}

export const codeExecutionService = new CodeExecutionService();
