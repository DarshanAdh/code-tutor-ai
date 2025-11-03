import axios from 'axios';

export interface PistonExecutionRequest {
  language: string;
  version: string;
  files: Array<{
    name: string;
    content: string;
  }>;
  stdin?: string;
}

export interface PistonExecutionResult {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
}

export interface SupportedLanguage {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
}

export class PistonExecutionService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';
  }

  async executeCode(request: PistonExecutionRequest): Promise<PistonExecutionResult> {
    try {
      const response = await axios.post(`${this.baseUrl}/execute`, request, {
        timeout: 10000, // 10 second timeout
      });

      return response.data;
    } catch (error) {
      console.error('Piston execution error:', error);
      throw new Error('Failed to execute code');
    }
  }

  async getSupportedLanguages(): Promise<SupportedLanguage[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/runtimes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Piston languages:', error);
      throw new Error('Failed to fetch supported languages');
    }
  }

  getLanguageId(language: string): { language: string; version: string } {
    const languageMap: Record<string, { language: string; version: string }> = {
      'python': { language: 'python', version: '3.10.0' },
      'python3': { language: 'python', version: '3.10.0' },
      'javascript': { language: 'node', version: '18.15.0' },
      'js': { language: 'node', version: '18.15.0' },
      'java': { language: 'java', version: '15.0.2' },
      'cpp': { language: 'cpp', version: '10.2.0' },
      'c': { language: 'c', version: '10.2.0' },
      'csharp': { language: 'csharp', version: '6.12.0' },
      'go': { language: 'go', version: '1.19.0' },
      'rust': { language: 'rust', version: '1.70.0' },
      'php': { language: 'php', version: '8.2.8' },
      'ruby': { language: 'ruby', version: '3.0.0' },
      'swift': { language: 'swift', version: '5.5.3' },
      'kotlin': { language: 'kotlin', version: '1.8.20' },
      'scala': { language: 'scala', version: '3.3.0' },
      'r': { language: 'r', version: '4.3.0' },
      'bash': { language: 'bash', version: '5.1.0' },
      'sql': { language: 'sql', version: 'sqlite3' },
      'typescript': { language: 'typescript', version: '5.0.3' },
    };

    return languageMap[language.toLowerCase()] || { language: 'python', version: '3.10.0' };
  }

  async executeCodeWithTimeout(
    code: string,
    language: string,
    stdin?: string,
    timeoutMs: number = 5000
  ): Promise<PistonExecutionResult> {
    const langInfo = this.getLanguageId(language);
    const fileName = this.getFileName(language);

    const request: PistonExecutionRequest = {
      language: langInfo.language,
      version: langInfo.version,
      files: [{
        name: fileName,
        content: code,
      }],
      stdin: stdin || '',
    };

    try {
      const result = await this.executeCode(request);
      
      // Check for timeout or other issues
      if (result.run.signal === 'SIGKILL' || result.run.signal === 'SIGTERM') {
        throw new Error('Code execution timeout');
      }

      return result;
    } catch (error) {
      console.error('Code execution with timeout error:', error);
      throw new Error('Failed to execute code within timeout');
    }
  }

  private getFileName(language: string): string {
    const fileMap: Record<string, string> = {
      'python': 'main.py',
      'python3': 'main.py',
      'javascript': 'main.js',
      'js': 'main.js',
      'java': 'Main.java',
      'cpp': 'main.cpp',
      'c': 'main.c',
      'csharp': 'Program.cs',
      'go': 'main.go',
      'rust': 'main.rs',
      'php': 'main.php',
      'ruby': 'main.rb',
      'swift': 'main.swift',
      'kotlin': 'Main.kt',
      'scala': 'Main.scala',
      'r': 'main.R',
      'bash': 'script.sh',
      'sql': 'query.sql',
      'typescript': 'main.ts',
    };

    return fileMap[language.toLowerCase()] || 'main.py';
  }

  async validateCode(code: string, language: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const result = await this.executeCodeWithTimeout(code, language, '', 3000);

      const errors: string[] = [];
      const warnings: string[] = [];

      // Check compilation errors
      if (result.compile && result.compile.stderr) {
        errors.push(result.compile.stderr);
      }

      // Check runtime errors
      if (result.run.stderr) {
        errors.push(result.run.stderr);
      }

      // Check for specific error patterns
      if (result.run.signal === 'SIGKILL') {
        errors.push('Code execution timeout');
      } else if (result.run.signal === 'SIGSEGV') {
        errors.push('Segmentation fault');
      } else if (result.run.code !== 0) {
        errors.push(`Process exited with code ${result.run.code}`);
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

  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/runtimes`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.log('Piston API not available:', error);
      return false;
    }
  }
}

export const pistonExecutionService = new PistonExecutionService();
