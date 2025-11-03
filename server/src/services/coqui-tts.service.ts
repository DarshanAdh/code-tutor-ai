import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

export interface TextToSpeechResult {
  audioBuffer: Buffer;
  contentType: string;
}

export class CoquiTTSService {
  private modelName: string;
  private isAvailable: boolean;

  constructor() {
    this.modelName = process.env.COQUI_MODEL || 'tts_models/en/ljspeech/tacotron2-DDC';
    this.isAvailable = false;
    this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
    try {
      // Check if TTS is installed
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      await execAsync('tts --version');
      this.isAvailable = true;
    } catch (error) {
      console.log('Coqui TTS not available. Install with: pip install TTS');
      this.isAvailable = false;
    }
  }

  async textToSpeech(text: string, languageCode: string = 'en-US', voiceName?: string): Promise<TextToSpeechResult> {
    if (!this.isAvailable) {
      throw new Error('Coqui TTS not available. Please install with: pip install TTS');
    }

    try {
      // Create temporary files
      const tempDir = join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });
      
      const textFile = join(tempDir, `text_${Date.now()}.txt`);
      const audioFile = join(tempDir, `audio_${Date.now()}.wav`);
      
      await fs.writeFile(textFile, text);

      // Run TTS command
      await this.runTTS(textFile, audioFile, languageCode, voiceName);
      
      // Read the generated audio file
      const audioBuffer = await fs.readFile(audioFile);
      
      // Clean up temp files
      await fs.unlink(textFile).catch(() => {});
      await fs.unlink(audioFile).catch(() => {});

      return {
        audioBuffer,
        contentType: 'audio/wav',
      };
    } catch (error) {
      console.error('Coqui TTS error:', error);
      throw new Error('Failed to convert text to speech');
    }
  }

  private async runTTS(
    textFile: string, 
    outputFile: string, 
    language: string, 
    voiceName?: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const args = [
        '--text', `"$(cat ${textFile})"`,
        '--out_path', outputFile,
        '--model_name', this.modelName,
      ];

      // Add voice selection if provided
      if (voiceName) {
        args.push('--speaker_idx', voiceName);
      }

      const tts = spawn('tts', args, { shell: true });
      
      let stderr = '';

      tts.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      tts.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`TTS process exited with code ${code}: ${stderr}`));
          return;
        }
        resolve();
      });

      tts.on('error', (error) => {
        reject(new Error(`Failed to start TTS: ${error.message}`));
      });
    });
  }

  async getAvailableVoices(languageCode?: string): Promise<any[]> {
    // Coqui TTS voices are model-specific
    const voices = [
      {
        name: 'default',
        language: 'en-US',
        gender: 'neutral',
        description: 'Default voice'
      }
    ];

    return voices;
  }

  async isServiceAvailable(): Promise<boolean> {
    return this.isAvailable;
  }

  async getSupportedLanguages(): Promise<string[]> {
    return [
      'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 
      'pt-PT', 'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN'
    ];
  }
}

export const coquiTTSService = new CoquiTTSService();
