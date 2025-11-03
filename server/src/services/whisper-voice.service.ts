import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

export interface SpeechToTextResult {
  transcript: string;
  confidence: number;
  language: string;
}

export interface TextToSpeechResult {
  audioBuffer: Buffer;
  contentType: string;
}

export class WhisperVoiceService {
  private modelPath: string;
  private isAvailable: boolean;

  constructor() {
    this.modelPath = process.env.WHISPER_MODEL_PATH || 'base';
    this.isAvailable = false;
    this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
    try {
      // Check if whisper is installed
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      await execAsync('whisper --version');
      this.isAvailable = true;
    } catch (error) {
      console.log('Whisper not available. Install with: pip install openai-whisper');
      this.isAvailable = false;
    }
  }

  async speechToText(audioBuffer: Buffer, languageCode: string = 'en'): Promise<SpeechToTextResult> {
    if (!this.isAvailable) {
      throw new Error('Whisper not available. Please install with: pip install openai-whisper');
    }

    try {
      // Save audio buffer to temporary file
      const tempDir = join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });
      
      const tempFile = join(tempDir, `audio_${Date.now()}.wav`);
      await fs.writeFile(tempFile, audioBuffer);

      // Run whisper command
      const result = await this.runWhisper(tempFile, languageCode);
      
      // Clean up temp file
      await fs.unlink(tempFile).catch(() => {});

      return {
        transcript: result.text,
        confidence: result.confidence || 0.8,
        language: languageCode,
      };
    } catch (error) {
      console.error('Whisper speech-to-text error:', error);
      throw new Error('Failed to convert speech to text');
    }
  }

  private async runWhisper(audioFile: string, language: string): Promise<{
    text: string;
    confidence: number;
  }> {
    return new Promise((resolve, reject) => {
      const args = [
        audioFile,
        '--model', this.modelPath,
        '--language', language,
        '--output_format', 'json',
        '--fp16', 'False'
      ];

      const whisper = spawn('whisper', args);
      
      let stdout = '';
      let stderr = '';

      whisper.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      whisper.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      whisper.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Whisper process exited with code ${code}: ${stderr}`));
          return;
        }

        try {
          const result = JSON.parse(stdout);
          resolve({
            text: result.text || '',
            confidence: result.confidence || 0.8,
          });
        } catch (parseError) {
          reject(new Error('Failed to parse Whisper output'));
        }
      });

      whisper.on('error', (error) => {
        reject(new Error(`Failed to start Whisper: ${error.message}`));
      });
    });
  }

  async isServiceAvailable(): Promise<boolean> {
    return this.isAvailable;
  }

  async getSupportedLanguages(): Promise<string[]> {
    return [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
      'ar', 'hi', 'th', 'vi', 'tr', 'pl', 'nl', 'sv', 'da', 'no'
    ];
  }
}

export const whisperVoiceService = new WhisperVoiceService();
