import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mic, MicOff, Volume2, VolumeX, Play, Square, Code, MessageSquare, Brain, Zap } from 'lucide-react';

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  service?: string;
}

interface Language {
  id: number;
  name: string;
  version: string;
}

const EnhancedAITutorInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAIService, setSelectedAIService] = useState('gemini');
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [inputMode, setInputMode] = useState<'chat' | 'code' | 'voice'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchLanguages();
    loadVoices();
    loadProviders();
  }, []);

  const loadVoices = () => {
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Set default voice (prefer English voices)
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      if (englishVoices.length > 0) {
        setSelectedVoice(englishVoices[0].name);
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0].name);
      }
    }
  };

  const loadProviders = async () => {
    try {
      const response = await fetch('/api/ai-tutor/ai-providers');
      if (response.ok) {
        const data = await response.json();
        setAvailableProviders(data.availableProviders || ['gemini']);
        if (data.primaryProvider) {
          setSelectedAIService(data.primaryProvider);
        }
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
      setAvailableProviders(['gemini']);
    }
  };

  // Load voices when they become available
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/ai-tutor/judge0/languages');
      const data = await response.json();
      setLanguages(data.languages || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const handleAskQuestion = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let endpoint = '/api/ai-tutor/free/ask';
      let body = { question: input, provider: selectedAIService };

      // Choose the appropriate endpoint based on AI service
      if (selectedAIService === 'huggingface') {
        endpoint = '/api/ai-tutor/huggingface/ask';
        body = { question: input };
      } else if (selectedAIService === 'multi') {
        endpoint = '/api/ai-tutor/multi-ai/ask';
        body = { question: input, preferredService: 'gemini' };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || 'Sorry, I could not process your request.',
        timestamp: new Date(),
        service: data.service || selectedAIService
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-speak AI response if enabled
      if (autoSpeak && data.response) {
        setTimeout(() => {
          handleTextToSpeech(data.response);
        }, 1000); // Wait 1 second before speaking
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setError('Failed to get response from AI tutor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeExecution = async () => {
    if (!codeInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-tutor/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify({ 
          code: codeInput, 
          language: selectedLanguage 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExecutionResult(data);

      // Add execution result to chat
      const executionMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `**Code Execution Result:**\n\n**Output:** ${data.output}\n**Status:** ${data.status}\n**Execution Time:** ${data.executionTime}\n**Memory:** ${data.memory}KB\n**API Used:** ${data.api}\n**Source:** ${data.source}\n\n**Analysis:** ${data.analysis}`,
        timestamp: new Date(),
        service: data.api || 'Code Execution'
      };

      setMessages(prev => [...prev, executionMessage]);
    } catch (error) {
      console.error('Error executing code:', error);
      setError('Failed to execute code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeminiCodeAnalysis = async () => {
    if (!codeInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-tutor/gemini/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify({ 
          code: codeInput, 
          language: selectedLanguage 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExecutionResult(data);

      // Add Gemini analysis result to chat
      const analysisMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `**🤖 Gemini AI Code Analysis:**\n\n**Output:** ${data.output}\n**Status:** ${data.status}\n**Execution Time:** ${data.executionTime}\n**Errors:** ${data.error || 'None'}\n\n**AI Analysis:** ${data.analysis}`,
        timestamp: new Date(),
        service: 'Gemini AI'
      };

      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Error analyzing code with Gemini:', error);
      setError('Failed to analyze code with Gemini');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechToText = async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        const errorMsg: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.',
          timestamp: new Date(),
          service: 'Speech Recognition'
        };
        setMessages(prev => [...prev, errorMsg]);
        setError('Speech recognition not supported in this browser');
        return;
      }

      setIsRecording(true);
      setError(null);

      // Add recording status message
      const recordingMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '🎤 Listening... Please speak clearly.',
        timestamp: new Date(),
        service: 'Speech Recognition'
      };
      setMessages(prev => [...prev, recordingMessage]);

      // Use browser's built-in speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        
        if (transcript.trim()) {
          setInput(transcript);
          
          // Show success message
          const successMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: `🎤 Speech recognized: "${transcript}"`,
            timestamp: new Date(),
            service: 'Speech Recognition'
          };
          setMessages(prev => [...prev, successMessage]);
        } else {
          // No speech detected
          const noSpeechMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: '❌ No speech detected. Please try speaking again.',
            timestamp: new Date(),
            service: 'Speech Recognition'
          };
          setMessages(prev => [...prev, noSpeechMessage]);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Speech recognition failed';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
        }
        
        setError(errorMessage);
        
        const errorMsg: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `❌ ${errorMessage}`,
          timestamp: new Date(),
          service: 'Speech Recognition'
        };
        setMessages(prev => [...prev, errorMsg]);
      };

      recognition.onend = () => {
        setIsRecording(false);
        console.log('Speech recognition ended');
      };

      // Start recognition
      recognition.start();
      
      // Set a timeout to stop recognition after 10 seconds
      setTimeout(() => {
        if (isRecording) {
          recognition.stop();
          setIsRecording(false);
        }
      }, 10000);

    } catch (err) {
      console.error('Speech recognition error:', err);
      setError('Speech recognition not available');
      setIsRecording(false);
    }
  };

  const stopTextToSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleTextToSpeech = async (text: string) => {
    if (isPlaying) {
      stopTextToSpeech();
      return;
    }

    try {
      // Check if browser supports speech synthesis
      if (!('speechSynthesis' in window)) {
        const errorMsg: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ Text-to-speech not supported in this browser. Please use Chrome, Edge, or Safari.',
          timestamp: new Date(),
          service: 'TTS'
        };
        setMessages(prev => [...prev, errorMsg]);
        setError('Text-to-speech not supported in this browser');
        return;
      }

      setIsPlaying(true);
      setError(null);

      // Add TTS notification to the chat
      const ttsMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `🔊 Speaking: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
        timestamp: new Date(),
        service: 'TTS'
      };
      setMessages(prev => [...prev, ttsMessage]);

      // Use browser's built-in speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech settings
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set selected voice if available
      if (selectedVoice) {
        const voice = availableVoices.find(v => v.name === selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }

      // Handle speech events
      utterance.onstart = () => {
        console.log('Speech synthesis started');
      };

      utterance.onend = () => {
        console.log('Speech synthesis ended');
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        let errorMessage = 'Text-to-speech failed';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Speech synthesis blocked. Please check browser permissions.';
            break;
          case 'audio-busy':
            errorMessage = 'Audio system busy. Please try again.';
            break;
          case 'audio-hardware':
            errorMessage = 'Audio hardware error. Please check your speakers.';
            break;
          case 'network':
            errorMessage = 'Network error during speech synthesis.';
            break;
          case 'synthesis-unavailable':
            errorMessage = 'Speech synthesis unavailable.';
            break;
          case 'synthesis-failed':
            errorMessage = 'Speech synthesis failed.';
            break;
          case 'language-unavailable':
            errorMessage = 'Language not available for speech synthesis.';
            break;
          case 'voice-unavailable':
            errorMessage = 'Voice not available.';
            break;
          case 'text-too-long':
            errorMessage = 'Text too long for speech synthesis.';
            break;
          case 'invalid-argument':
            errorMessage = 'Invalid argument for speech synthesis.';
            break;
        }
        
        setError(errorMessage);
        
        const errorMsg: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `❌ ${errorMessage}`,
          timestamp: new Date(),
          service: 'TTS'
        };
        setMessages(prev => [...prev, errorMsg]);
        setIsPlaying(false);
      };

      // Start speech synthesis
      speechSynthesis.speak(utterance);
      
      // Set a timeout to stop speech after 30 seconds (safety measure)
      setTimeout(() => {
        if (isPlaying) {
          speechSynthesis.cancel();
          setIsPlaying(false);
        }
      }, 30000);

    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError('Text-to-speech not available');
      setIsPlaying(false);
    }
  };

  const getServiceIcon = (service?: string) => {
    switch (service) {
      case 'Gemini': return <Brain className="w-4 h-4" />;
      case 'Hugging Face': return <Zap className="w-4 h-4" />;
      case 'Judge0': return <Code className="w-4 h-4" />;
      case 'AssemblyAI': return <Mic className="w-4 h-4" />;
      case 'TTS': return <Volume2 className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getServiceColor = (service?: string) => {
    switch (service) {
      case 'Gemini': return 'bg-blue-100 text-blue-800';
      case 'Hugging Face': return 'bg-purple-100 text-purple-800';
      case 'Judge0': return 'bg-green-100 text-green-800';
      case 'AssemblyAI': return 'bg-orange-100 text-orange-800';
      case 'TTS': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="ml-auto">
              Multi-AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="code">Code Editor</TabsTrigger>
              <TabsTrigger value="playground">Playground</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col">
              {/* AI Service Selection */}
              <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">AI Model:</span>
                    <Select value={selectedAIService} onValueChange={setSelectedAIService}>
                      <SelectTrigger className="w-56">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProviders.includes('gemini') && (
                          <SelectItem value="gemini">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Gemini 2.0 Flash
                            </div>
                          </SelectItem>
                        )}
                        {availableProviders.includes('openai') && (
                          <SelectItem value="openai">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              OpenAI GPT
                            </div>
                          </SelectItem>
                        )}
                        {availableProviders.includes('huggingface') && (
                          <SelectItem value="huggingface">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              Hugging Face
                            </div>
                          </SelectItem>
                        )}
                        {availableProviders.includes('ollama') && (
                          <SelectItem value="ollama">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              Ollama (Local)
                            </div>
                          </SelectItem>
                        )}
                        <SelectItem value="multi">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            Multi-AI (Auto-Fallback)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                {/* Voice Selection - Moved from Code Editor */}
                {availableVoices.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Voice:</label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVoices.map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoSpeak"
                        checked={autoSpeak}
                        onChange={(e) => setAutoSpeak(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="autoSpeak" className="text-sm font-medium">
                        Auto-speak AI responses
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.type === 'ai' && getServiceIcon(message.service)}
                        {message.service && (
                          <Badge className={getServiceColor(message.service)}>
                            {message.service}
                          </Badge>
                        )}
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'ai' && message.content && (
                          <Button
                            onClick={() => handleTextToSpeech(message.content)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            title="Speak this message"
                          >
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="space-y-3">
                {/* Input Mode Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Input Mode:</span>
                  <div className="flex gap-1">
                    <Button
                      variant={inputMode === 'chat' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setInputMode('chat')}
                      className="flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Chat
                    </Button>
                    <Button
                      variant={inputMode === 'code' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setInputMode('code')}
                      className="flex items-center gap-1"
                    >
                      <Code className="w-3 h-3" />
                      Code
                    </Button>
                    <Button
                      variant={inputMode === 'voice' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setInputMode('voice')}
                      className="flex items-center gap-1"
                    >
                      <Mic className="w-3 h-3" />
                      Voice
                    </Button>
                  </div>
                </div>

                {/* Input Section */}
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                          inputMode === 'chat' 
                            ? "Ask me anything about programming, algorithms, or coding concepts..." 
                            : inputMode === 'code'
                            ? "Paste your code here for analysis, debugging, or explanation..."
                            : "Click the microphone button to start voice input..."
                        }
                        className={`flex-1 min-h-[60px] pr-12 ${
                          inputMode === 'code' 
                            ? 'font-mono text-sm bg-gray-50 border-dashed' 
                            : inputMode === 'voice'
                            ? 'bg-blue-50 border-blue-200'
                            : ''
                        }`}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAskQuestion()}
                        disabled={inputMode === 'voice'}
                      />
                      
                      {/* Input Mode Indicators */}
                      {inputMode === 'code' && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            <Code className="w-3 h-3 mr-1" />
                            Code Mode
                          </Badge>
                        </div>
                      )}
                      
                      {inputMode === 'voice' && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            <Mic className="w-3 h-3 mr-1" />
                            Voice Mode
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {inputMode === 'voice' && (
                        <Button
                          onClick={handleSpeechToText}
                          variant={isRecording ? "destructive" : "default"}
                          size="icon"
                          className={`w-10 h-10 ${isRecording ? 'animate-pulse' : ''}`}
                          title={isRecording ? 'Stop recording' : 'Start voice input'}
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                      )}

                      <Button
                        onClick={() => handleTextToSpeech(input)}
                        variant="outline"
                        size="icon"
                        disabled={isPlaying || !input.trim()}
                        title={isPlaying ? 'Stop speaking' : 'Speak the message'}
                        className="w-10 h-10"
                      >
                        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>

                      <Button 
                        onClick={handleAskQuestion} 
                        disabled={isLoading || !input.trim()}
                        className="w-10 h-10"
                        title="Send message"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Input Tips */}
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
                    {inputMode === 'chat' && (
                      <>
                        <span>💡 Try: "Explain recursion" or "How do I debug this?"</span>
                        <span>⌨️ Press Enter to send, Shift+Enter for new line</span>
                      </>
                    )}
                    {inputMode === 'code' && (
                      <>
                        <span>💻 Paste code for analysis, debugging, or optimization</span>
                        <span>🎯 Get suggestions for improvements and best practices</span>
                      </>
                    )}
                    {inputMode === 'voice' && (
                      <>
                        <span>🎤 Click microphone to start voice input</span>
                        <span>🗣️ Speak naturally - AI will understand context</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
            </TabsContent>

            <TabsContent value="code" className="flex-1 flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm font-medium">Language:</span>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.name.toLowerCase()}>
                        {lang.name} ({lang.version})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter your code here..."
                className="flex-1 font-mono text-sm"
              />


              <div className="mt-4 flex gap-2">
                <Button onClick={handleCodeExecution} disabled={isLoading || !codeInput.trim()}>
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </Button>
                <Button 
                  onClick={handleGeminiCodeAnalysis} 
                  disabled={isLoading || !codeInput.trim()}
                  variant="secondary"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Analyze
                </Button>
                <Button
                  onClick={() => handleTextToSpeech(codeInput)}
                  variant="outline"
                  disabled={isPlaying || !codeInput.trim()}
                  title={isPlaying ? 'Stop speaking' : 'Speak the code aloud'}
                >
                  {isPlaying ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Stop' : 'Speak Code'}
                </Button>
              </div>

              {executionResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Execution Result:</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Output:</strong> {executionResult.output}</div>
                    <div><strong>Status:</strong> {executionResult.status}</div>
                    <div><strong>Time:</strong> {executionResult.executionTime}</div>
                    <div><strong>Memory:</strong> {executionResult.memory}KB</div>
                    {executionResult.api && <div><strong>API Used:</strong> {executionResult.api}</div>}
                    {executionResult.source && <div><strong>Source:</strong> {executionResult.source}</div>}
                    {executionResult.error && <div><strong>Error:</strong> {executionResult.error}</div>}
                    {executionResult.analysis && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <strong>Analysis:</strong> {executionResult.analysis}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="playground" className="flex-1">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Interactive Playground</h3>
                <p className="text-gray-600 mb-4">
                  Experiment with different AI services and code execution
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button onClick={() => setSelectedAIService('gemini')} variant="outline">
                    <Brain className="w-4 h-4 mr-2" />
                    Try Gemini
                  </Button>
                  <Button onClick={() => setSelectedAIService('huggingface')} variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Try Hugging Face
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export { EnhancedAITutorInterface };
export default EnhancedAITutorInterface;
