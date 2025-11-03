import { promises as fs } from 'fs';
import { join } from 'path';

// Optional Google Cloud imports - only use if available
let SpeechClient: any;
let TextToSpeechClient: any;
let speechClient: any;
let ttsClient: any;

try {
  const speech = require('@google-cloud/speech');
  const tts = require('@google-cloud/text-to-speech');
  SpeechClient = speech.SpeechClient;
  TextToSpeechClient = tts.TextToSpeechClient;
  
  speechClient = new SpeechClient(
    process.env.GOOGLE_APPLICATION_CREDENTIALS ? {
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    } : {}
  );

  ttsClient = new TextToSpeechClient(
    process.env.GOOGLE_APPLICATION_CREDENTIALS ? {
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    } : {}
  );
} catch (error) {
  console.warn('Google Cloud Speech/TTS not available. Install with: npm install @google-cloud/speech @google-cloud/text-to-speech');
}

export interface SpeechToTextResult {
  transcript: string;
  confidence: number;
  language: string;
}

export interface TextToSpeechResult {
  audioBuffer: Buffer;
  contentType: string;
}

export class VoiceService {
  async speechToText(audioBuffer: Buffer, languageCode: string = 'en-US'): Promise<SpeechToTextResult> {
    if (!speechClient) {
      throw new Error('Google Cloud Speech client not available. Please install @google-cloud/speech');
    }
    
    try {
      const audio = {
        content: audioBuffer.toString('base64'),
      };

      const config = {
        encoding: 'WEBM_OPUS' as const,
        sampleRateHertz: 48000,
        languageCode: languageCode,
        enableAutomaticPunctuation: true,
        model: 'latest_long',
      };

      const request = {
        audio: audio,
        config: config,
      };

      const [response] = await speechClient.recognize(request);
      const result = response.results?.[0];

      if (!result || !result.alternatives?.[0]) {
        throw new Error('No speech detected');
      }

      return {
        transcript: result.alternatives[0].transcript || '',
        confidence: result.alternatives[0].confidence || 0,
        language: languageCode,
      };
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw new Error('Failed to convert speech to text');
    }
  }

  async textToSpeech(text: string, languageCode: string = 'en-US', voiceName?: string): Promise<TextToSpeechResult> {
    if (!ttsClient) {
      throw new Error('Google Cloud Text-to-Speech client not available. Please install @google-cloud/text-to-speech');
    }
    
    try {
      const request = {
        input: { text: text },
        voice: {
          languageCode: languageCode,
          name: voiceName || this.getDefaultVoice(languageCode),
          ssmlGender: 'NEUTRAL' as const,
        },
        audioConfig: {
          audioEncoding: 'MP3' as const,
          speakingRate: 1.0,
          pitch: 0.0,
        },
      };

      const [response] = await ttsClient.synthesizeSpeech(request);
      
      if (!response.audioContent) {
        throw new Error('No audio content generated');
      }

      return {
        audioBuffer: Buffer.from(response.audioContent),
        contentType: 'audio/mpeg',
      };
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw new Error('Failed to convert text to speech');
    }
  }

  private getDefaultVoice(languageCode: string): string {
    const voiceMap: Record<string, string> = {
      'en-US': 'en-US-Neural2-A',
      'en-GB': 'en-GB-Neural2-A',
      'es-ES': 'es-ES-Neural2-A',
      'fr-FR': 'fr-FR-Neural2-A',
      'de-DE': 'de-DE-Neural2-A',
    };
    return voiceMap[languageCode] || 'en-US-Neural2-A';
  }

  async getAvailableVoices(languageCode?: string): Promise<any[]> {
    if (!ttsClient) {
      return [];
    }
    
    try {
      const [result] = await ttsClient.listVoices({
        languageCode: languageCode || null,
      });

      return result.voices || [];
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  }
}

export const voiceService = new VoiceService();
