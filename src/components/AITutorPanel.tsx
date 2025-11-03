import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
}

const presetPrompts = [
  'Explain loops with a simple example',
  'Show a step-by-step for array search',
  'Help me debug a syntax error in Python',
  'Create a practice quiz on functions',
];

export const AITutorPanel: React.FC = () => {
  const [course, setCourse] = useState('CS101');
  const [messages, setMessages] = useState<MessageItem[]>([
    { role: 'assistant', content: 'Hi! I am your CodeTutor AI. How can I help today?' },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setIsSending(true);
    setMessages((m) => [...m, { role: 'user', content }]);
    setInput('');

    // Placeholder AI echo. In next phase, call backend/AI API with {course, content, history}
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'Thanks! I will provide guidance tailored to ' +
            course +
            '. (AI integration coming next.)\n\nTip: Try the Learn > Visualizer while you read this.',
        },
      ]);
      setIsSending(false);
      scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
    }, 600);
  };

  return (
    <Card className="shine">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-semo-red" /> AI Tutor
        </CardTitle>
        <CardDescription>Chat with the tutor. Course context helps personalize answers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-sm text-white/90">Course:</div>
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CS101">CS101: Intro to Programming</SelectItem>
              <SelectItem value="CS201">CS201: Data Structures</SelectItem>
              <SelectItem value="CS301">CS301: Algorithms</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Badge variant="secondary" className="bg-white/20 text-white">Frontend Phase</Badge>
        </div>

        <div ref={scrollerRef} className="h-72 rounded-md border bg-card overflow-y-auto p-3 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div
                className={
                  'inline-flex items-start max-w-[85%] rounded-lg px-3 py-2 ' +
                  (m.role === 'user'
                    ? 'bg-semo-red text-white'
                    : 'bg-accent text-foreground')
                }
              >
                {m.role === 'assistant' && <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-semo-red" />}
                <span className="whitespace-pre-wrap text-sm">{m.content}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question (e.g., Why is my loop infinite?)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <Button className="btn-primary" onClick={() => sendMessage()} disabled={isSending}>
            <Send className="w-4 h-4 mr-2" /> Send
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {presetPrompts.map((p) => (
            <button
              key={p}
              className="text-xs px-3 py-1 rounded-full border bg-card hover:bg-accent transition-colors"
              onClick={() => sendMessage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AITutorPanel;



