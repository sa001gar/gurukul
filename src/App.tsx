import React, { useState, useEffect } from 'react';
import { Code2, Sparkles, Play, MessageSquareMore, Maximize2, FileCode, Folder, Github, BookOpen, Coffee } from 'lucide-react';
import { analyzeCode } from './lib/gemini';
import { executeCode } from './lib/judge0';
import { getChatbotResponse } from './lib/chatbot';
import { CodeEditor } from './components/CodeEditor';
import { FeedbackPanel } from './components/FeedbackPanel';
import { OutputPanel } from './components/OutputPanel';
import { LanguageSelector } from './components/LanguageSelector';
import { ChatPanel } from './components/ChatPanel';
import { AskMentorDialog } from './components/AskMentorDialog';
import { FileExplorer } from './components/FileExplorer';
import { FullScreenIDE } from './components/FullScreenIDE';

const languages = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'c', name: 'C' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'csharp', name: 'C#' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' }
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
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [files, setFiles] = useState<{[key: string]: string}>({
    'main.py': '# Python main file\nimport math\n\ndef calculate_circle_area(radius):\n    return math.pi * radius ** 2\n\nprint("Circle area with radius 5:", calculate_circle_area(5))',
    'index.js': '// JavaScript file\nconst greeting = "Welcome to CS Department";\nconst displayGreeting = () => {\n  console.log(greeting);\n};\n\ndisplayGreeting();',
    'Main.java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.println("Java Programming - Enter your name:");\n        String name = "Student"; // Default value\n        System.out.println("Hello, " + name + "!");\n    }\n}',
    'main.cpp': '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> numbers = {5, 2, 8, 1, 9};\n    std::sort(numbers.begin(), numbers.end());\n    \n    std::cout << "Sorted numbers: ";\n    for (int num : numbers) {\n        std::cout << num << " ";\n    }\n    std::cout << std::endl;\n    return 0;\n}',
    'app.ts': 'interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nclass UserService {\n  private users: User[] = [];\n  \n  addUser(user: User): void {\n    this.users.push(user);\n    console.log(`User ${user.name} added successfully`);\n  }\n  \n  getUsers(): User[] {\n    return this.users;\n  }\n}\n\nconst service = new UserService();\nservice.addUser({ id: 1, name: "John Doe", email: "john@example.com" });'
  });
  const [currentFile, setCurrentFile] = useState('main.py');
  const [showFeatures, setShowFeatures] = useState(false);

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

  const handleFileSelect = (filename: string) => {
    setCurrentFile(filename);
    // Determine language based on file extension
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'py') setLanguage('python');
    else if (extension === 'js') setLanguage('javascript');
    else if (extension === 'java') setLanguage('java');
    else if (extension === 'cpp' || extension === 'c') setLanguage(extension);
    else if (extension === 'ts') setLanguage('typescript');
    else if (extension === 'cs') setLanguage('csharp');
    else if (extension === 'rb') setLanguage('ruby');
    else if (extension === 'go') setLanguage('go');
    else if (extension === 'rs') setLanguage('rust');
    
    setCode(files[filename]);
  };

  const handleFileCreate = (filename: string, content: string = '') => {
    setFiles(prev => ({...prev, [filename]: content}));
    setCurrentFile(filename);
  };

  const handleFileDelete = (filename: string) => {
    const newFiles = {...files};
    delete newFiles[filename];
    setFiles(newFiles);
    if (currentFile === filename) {
      const firstFile = Object.keys(newFiles)[0];
      if (firstFile) {
        setCurrentFile(firstFile);
        setCode(newFiles[firstFile]);
      } else {
        setCurrentFile('');
        setCode('');
      }
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    setFiles(prev => ({...prev, [currentFile]: newCode}));
  };

  useEffect(() => {
    if (currentFile && files[currentFile]) {
      setCode(files[currentFile]);
    }
  }, [currentFile, files]);

  useEffect(() => {
    // Show features section after 1 second
    const timer = setTimeout(() => {
      setShowFeatures(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (fullScreenMode) {
    return (
      <FullScreenIDE 
        files={files}
        currentFile={currentFile}
        onFileSelect={handleFileSelect}
        onFileCreate={handleFileCreate}
        onFileDelete={handleFileDelete}
        onCodeChange={handleCodeChange}
        onExit={() => setFullScreenMode(false)}
        language={language}
        code={code}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg shadow-md transform hover:scale-105 transition-transform">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  GURUKUL IDE
                </h1>
                <p className="text-sm text-gray-600">Department of Computer Science | Mankar College</p>
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
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Play className="h-4 w-4 mr-2" />
                Run
              </button>
              
              <button
                onClick={handleAIFeedback}
                disabled={analyzing}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze
              </button>
              
              <button
                onClick={() => setAskDialogOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <MessageSquareMore className="h-4 w-4 mr-2" />
                Ask
              </button>

              <button
                onClick={() => setFullScreenMode(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Full IDE
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Elevate Your Coding Experience with AI-Powered Tools
              </h2>
              <p className="text-lg text-blue-100">
                Write, analyze, and improve your code with real-time AI feedback and multi-language support.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('ide-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Start Coding
                </button>
                <a 
                  href="https://github.com/sa001gar/gurukul" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-indigo-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg transform rotate-3 scale-105"></div>
                <div className="relative bg-gray-900 rounded-lg shadow-2xl p-4 border border-indigo-300/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-400">main.py</div>
                  </div>
                  <pre className="text-sm text-blue-300 font-mono">
                    <code>
{`# Python example
import numpy as np
import matplotlib.pyplot as plt

def analyze_data(data):
    """Analyze the given dataset"""
    mean = np.mean(data)
    median = np.median(data)
    std_dev = np.std(data)
    
    return {
        "mean": mean,
        "median": median,
        "std_dev": std_dev
    }

# Generate sample data
data = np.random.normal(0, 1, 1000)
results = analyze_data(data)

# Display results
print(f"Analysis Results:")
print(f"Mean: {results['mean']:.4f}")
print(f"Median: {results['median']:.4f}")
print(f"Std Dev: {results['std_dev']:.4f}")

# Create visualization
plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, alpha=0.7)
plt.axvline(results['mean'], color='r', 
           linestyle='dashed', linewidth=2)
plt.title("Data Distribution")
plt.show()`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Features section */}
      {showFeatures && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Powerful Features for Modern Developers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our IDE combines cutting-edge tools with an intuitive interface to enhance your coding workflow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Get real-time feedback, suggestions, and best practices for your code from our advanced AI system.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Language Support</h3>
              <p className="text-gray-600">Write and execute code in Python, JavaScript, Java, C++, TypeScript and more with syntax highlighting.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquareMore className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Coding Assistant</h3>
              <p className="text-gray-600">Chat with our AI assistant to get help with coding problems, explanations, and guidance.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Folder className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Management</h3>
              <p className="text-gray-600">Organize your code with our file explorer, create new files, and manage your project structure.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Maximize2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Distraction-Free Mode</h3>
              <p className="text-gray-600">Switch to full-screen IDE mode for a focused coding experience with all the tools you need.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Resources</h3>
              <p className="text-gray-600">Access educational content and examples to improve your programming skills and knowledge.</p>
            </div>
          </div>
        </div>
      )}

      <main id="ide-section" className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FileExplorer 
              files={files}
              currentFile={currentFile}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <CodeEditor
                  code={code}
                  language={language}
                  onChange={handleCodeChange}
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
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm py-8 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Mankar College CS IDE
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                An advanced coding environment designed for computer science students and educators.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                  <Coffee className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-sm text-gray-600 mb-2">Department of Computer Science</p>
              <p className="text-sm text-gray-600 mb-2">Mankar College</p>
              <p className="text-sm text-gray-600">Email: cs@mankarcollege.edu</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} Department of Computer Science, Mankar College. All rights reserved.
            </div>
            <div className="text-sm text-gray-600">
              Developed by <span className="font-semibold">Sagar Kundu</span>
            </div>
          </div>
        </div>
      </footer>

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