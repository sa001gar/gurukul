import React, { useState, useEffect } from 'react';
import { Code2, Sparkles, Play, MessageSquareMore } from 'lucide-react';
import { analyzeCode } from './lib/gemini';
import { executeCode } from './lib/judge0';
import { getChatbotResponse } from './lib/chatbot';
import { CodeEditor } from './components/CodeEditor';
import { FeedbackPanel } from './components/FeedbackPanel';
import { OutputPanel } from './components/OutputPanel';
import { LanguageSelector } from './components/LanguageSelector';
import { ChatPanel } from './components/ChatPanel';
import { AskMentorDialog } from './components/AskMentorDialog';

const languages = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'c', name: 'C' }
];

function App() {
  const [code, setCode] = useState('# Write your code here\n');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState<{
    suggestions: string[];
    patterns: string[];
    errors: string[];
    bestPractices: string[];
  }>({
    suggestions: [],
    patterns: [],
    errors: [],
    bestPractices: []
  });
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [askDialogOpen, setAskDialogOpen] = useState(false);

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const result = await executeCode(code, language);
      setOutput(result);
      document.getElementById('output-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      setOutput('Error executing code. Please try again.');
    }
    setLoading(false);
  };

  const handleAIFeedback = async () => {
    setAnalyzing(true);
    try {
      const analysis = await analyzeCode(code, language);
      setFeedback(analysis);
    } catch (error) {
      setFeedback({
        suggestions: ['Error getting AI feedback. Please try again.'],
        patterns: [],
        errors: [],
        bestPractices: []
      });
    }
    setAnalyzing(false);
  };

  const handleChatMessage = async (message: string) => {
    return await getChatbotResponse(message);
  };

  useEffect(() => {
    const defaultCode = {
      python: '# Write your Python code here\n',
      javascript: '// Write your JavaScript code here\n',
      cpp: '// Write your C++ code here\n#include <iostream>\n\nint main() {\n    \n    return 0;\n}',
      java: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}',
      c: '// Write your C code here\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}'
    };
    setCode(defaultCode[language as keyof typeof defaultCode]);
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-purple-600 p-2 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                  Gurukul
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Code Mentor</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              <LanguageSelector
                languages={languages}
                selectedLanguage={language}
                onLanguageChange={setLanguage}
              />
              
              <button
                onClick={handleRunCode}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Run
              </button>
              
              <button
                onClick={handleAIFeedback}
                disabled={analyzing}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze
              </button>
              
              <button
                onClick={() => setAskDialogOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors shadow-sm"
              >
                <MessageSquareMore className="h-4 w-4 mr-2" />
                Ask
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <CodeEditor
              code={code}
              language={language}
              onChange={(value) => setCode(value || '')}
            />
          </div>

          <div className="space-y-6">
            <FeedbackPanel
              feedback={feedback}
              analyzing={analyzing}
              onAskMentor={() => setAskDialogOpen(true)}
            />
            <OutputPanel
              output={output}
              loading={loading}
            />
          </div>
        </div>
      </main>

      <ChatPanel onSendMessage={handleChatMessage} />
      <AskMentorDialog
        open={askDialogOpen}
        onOpenChange={setAskDialogOpen}
        onAsk={handleAIFeedback}
      />
    </div>
  );
}

export default App;