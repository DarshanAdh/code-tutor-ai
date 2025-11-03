import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Code, Play, Loader2 } from 'lucide-react';

export const Playground: React.FC = () => {
  const [code, setCode] = useState(`// Write your code here
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running...\n');

    try {
      // Try to execute via backend API
      const response = await fetch('/api/ai-tutor/execute-code-free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOutput(data.output || data.result || 'Code executed successfully');
      } else {
        // Fallback to client-side execution for JavaScript
        if (language === 'javascript') {
          try {
            // Capture console.log output
            let capturedOutput = '';
            const originalLog = console.log;
            console.log = (...args) => {
              capturedOutput += args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ') + '\n';
            };

            // Execute code in a safe way
            const result = eval(code);
            if (result !== undefined) {
              capturedOutput += String(result) + '\n';
            }

            console.log = originalLog;
            setOutput(capturedOutput || 'Code executed (no output)');
          } catch (error: any) {
            setOutput(`Error: ${error.message}`);
          }
        } else {
          setOutput('Code execution is only available for JavaScript in demo mode. Use the backend API for other languages.');
        }
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message || 'Failed to execute code'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-muted-foreground" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm bg-background"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={isRunning}
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Code Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 font-mono text-sm p-3 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your code here..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="w-full h-64 p-3 border rounded-md bg-muted text-foreground font-mono text-sm overflow-auto whitespace-pre-wrap">
              {output || 'Output will appear here...'}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Write your code in the editor on the left</li>
            <li>Click "Run Code" to execute your code</li>
            <li>View the output in the panel on the right</li>
            <li>Use console.log() to print values in JavaScript</li>
            <li>For Python and other languages, use the backend API</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

