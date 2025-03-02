import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { 
  X, 
  Play, 
  Download, 
  Settings, 
  ChevronDown, 
  Folder, 
  File, 
  Plus, 
  Trash2, 
  Terminal, 
  Loader2, 
  Copy, 
  Save
} from 'lucide-react';

interface FullScreenIDEProps {
  files: {[key: string]: string};
  currentFile: string;
  onFileSelect: (filename: string) => void;
  onFileCreate: (filename: string, content?: string) => void;
  onFileDelete: (filename: string) => void;
  onCodeChange: (value: string | undefined) => void;
  onExit: () => void;
  language: string;
  code: string;
}

export function FullScreenIDE({ 
  files, 
  currentFile, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete, 
  onCodeChange, 
  onExit,
  language,
  code
}: FullScreenIDEProps) {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(150);
  const [isTerminalResizing, setIsTerminalResizing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'py':
        return <div className="w-4 h-4 rounded-sm bg-blue-500 flex items-center justify-center text-[8px] font-bold text-white">PY</div>;
      case 'js':
        return <div className="w-4 h-4 rounded-sm bg-yellow-500 flex items-center justify-center text-[8px] font-bold text-white">JS</div>;
      case 'java':
        return <div className="w-4 h-4 rounded-sm bg-orange-500 flex items-center justify-center text-[8px] font-bold text-white">JV</div>;
      case 'cpp':
        return <div className="w-4 h-4 rounded-sm bg-purple-500 flex items-center justify-center text-[8px] font-bold text-white">C++</div>;
      case 'c':
        return <div className="w-4 h-4 rounded-sm bg-blue-400 flex items-center justify-center text-[8px] font-bold text-white">C</div>;
      case 'ts':
        return <div className="w-4 h-4 rounded-sm bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white">TS</div>;
      case 'cs':
        return <div className="w-4 h-4 rounded-sm bg-green-600 flex items-center justify-center text-[8px] font-bold text-white">C#</div>;
      case 'rb':
        return <div className="w-4 h-4 rounded-sm bg-red-600 flex items-center justify-center text-[8px] font-bold text-white">RB</div>;
      case 'go':
        return <div className="w-4 h-4 rounded-sm bg-cyan-500 flex items-center justify-center text-[8px] font-bold text-white">GO</div>;
      case 'rs':
        return <div className="w-4 h-4 rounded-sm bg-orange-600 flex items-center justify-center text-[8px] font-bold text-white">RS</div>;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onFileCreate(newFileName);
      setNewFileName('');
      setIsCreatingFile(false);
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    // Prevent text selection during resize
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth > 100 && newWidth < 500) {
      setSidebarWidth(newWidth);
    }
  };

  const stopResizing = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  };

  const startTerminalResizing = (e: React.MouseEvent) => {
    setIsTerminalResizing(true);
    document.addEventListener('mousemove', handleTerminalMouseMove);
    document.addEventListener('mouseup', stopTerminalResizing);
    // Prevent text selection during resize
    e.preventDefault();
  };

  const handleTerminalMouseMove = (e: MouseEvent) => {
    if (!isTerminalResizing || !terminalRef.current) return;
    
    const containerHeight = terminalRef.current.parentElement?.clientHeight || 0;
    const mouseY = e.clientY;
    const containerRect = terminalRef.current.parentElement?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const relativeY = mouseY - containerRect.top;
    const newHeight = containerHeight - relativeY;
    
    if (newHeight > 50 && newHeight < 500) {
      setTerminalHeight(newHeight);
    }
  };

  const stopTerminalResizing = () => {
    setIsTerminalResizing(false);
    document.removeEventListener('mousemove', handleTerminalMouseMove);
    document.removeEventListener('mouseup', stopTerminalResizing);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('');
    
    // Simulate code execution with a delay
    setTimeout(() => {
      let simulatedOutput = '';
      
      // Generate simulated output based on language
      switch(language) {
        case 'python':
          if (code.includes('import numpy')) {
            simulatedOutput = 'NumPy imported successfully.\n';
            if (code.includes('np.array')) {
              simulatedOutput += 'Array created: [1 2 3 4 5]\n';
            }
            if (code.includes('np.mean')) {
              simulatedOutput += 'Mean: 3.0\n';
            }
          } else if (code.includes('import math')) {
            simulatedOutput = 'Math module imported successfully.\n';
            if (code.includes('math.pi')) {
              simulatedOutput += `Pi: ${Math.PI}\n`;
            }
            if (code.includes('calculate_circle_area')) {
              simulatedOutput += 'Circle area with radius 5: 78.53981633974483\n';
            }
          } else {
            simulatedOutput = 'Hello, Python World!\n';
            if (code.includes('print')) {
              const printMatch = code.match(/print\s*\(\s*["'](.+?)["']\s*\)/);
              if (printMatch && printMatch[1]) {
                simulatedOutput = printMatch[1] + '\n';
              }
            }
          }
          break;
        case 'javascript':
          simulatedOutput = 'Welcome to CS Department\n';
          if (code.includes('console.log')) {
            const logMatch = code.match(/console\.log\s*\(\s*["'](.+?)["']\s*\)/);
            if (logMatch && logMatch[1]) {
              simulatedOutput = logMatch[1] + '\n';
            }
          }
          break;
        case 'java':
          simulatedOutput = 'Java Programming - Enter your name:\nHello, Student!\n';
          break;
        case 'cpp':
          simulatedOutput = 'Sorted numbers: 1 2 5 8 9\n';
          break;
        case 'typescript':
          simulatedOutput = 'User John Doe added successfully\n';
          break;
        case 'csharp':
          simulatedOutput = 'C# program executed successfully.\nHello from C#!\n';
          break;
        case 'ruby':
          simulatedOutput = 'Ruby program executed.\nHello, Ruby World!\n';
          break;
        case 'go':
          simulatedOutput = 'Go program executed.\nHello, Go World!\n';
          break;
        case 'rust':
          simulatedOutput = 'Rust program compiled and executed.\nHello, Rust World!\n';
          break;
        default:
          simulatedOutput = 'Program executed successfully.\n';
      }
      
      setOutput(simulatedOutput);
      setIsRunning(false);
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = currentFile;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Add keyboard shortcut to exit fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCreatingFile && !showSettings) {
        onExit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onExit, isCreatingFile, showSettings]);

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isResizing && e.touches.length > 0) {
        const newWidth = e.touches[0].clientX;
        if (newWidth > 100 && newWidth < 500) {
          setSidebarWidth(newWidth);
        }
      }
      
      if (isTerminalResizing && e.touches.length > 0 && terminalRef.current) {
        const containerHeight = terminalRef.current.parentElement?.clientHeight || 0;
        const touchY = e.touches[0].clientY;
        const containerRect = terminalRef.current.parentElement?.getBoundingClientRect();
        
        if (!containerRect) return;
        
        const relativeY = touchY - containerRect.top;
        const newHeight = containerHeight - relativeY;
        
        if (newHeight > 50 && newHeight < 500) {
          setTerminalHeight(newHeight);
        }
      }
    };
    
    const handleTouchEnd = () => {
      setIsResizing(false);
      setIsTerminalResizing(false);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isResizing, isTerminalResizing]);

  return (
    <div className="fixed inset-0 bg-gray-900 text-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="text-sm font-medium">{currentFile}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Copy Code"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownloadCode}
            className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Download File"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="p-1.5 rounded-md bg-green-700 hover:bg-green-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Run Code (Ctrl+Enter)"
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-md hover:bg-gray-700 transition-colors ${
              showSettings ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="absolute right-4 top-12 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 w-64 p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Editor Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Theme</label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                <option value="vs-dark">Dark</option>
                <option value="vs-light">Light</option>
                <option value="hc-black">High Contrast Dark</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font Size</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="10" 
                  max="24" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="flex-1 mr-2"
                />
                <span className="text-sm w-6 text-center">{fontSize}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Terminal</label>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={showTerminal} 
                  onChange={(e) => setShowTerminal(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Show Terminal</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div 
          ref={sidebarRef}
          className="bg-gray-800 border-r border-gray-700 flex flex-col"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="p-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            Explorer
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <ChevronDown className="h-3 w-3 text-gray-400" />
                <Folder className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Project Files</span>
              </div>
              <button
                onClick={() => setIsCreatingFile(true)}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            
            {isCreatingFile && (
              <form onSubmit={handleCreateFile} className="px-3 py-1">
                <div className="flex items-center gap-1">
                  <File className="h-3 w-3 text-gray-400" />
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="filename.ext"
                    className="flex-1 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              </form>
            )}
            
            <div className="mt-1">
              {Object.keys(files).map((filename) => (
                <div 
                  key={filename}
                  className={`flex items-center justify-between px-3 py-1.5 cursor-pointer ${
                    currentFile === filename 
                      ? 'bg-gray-700 text-white' 
                      : 'hover:bg-gray-700/50 text-gray-300'
                  }`}
                  onClick={() => onFileSelect(filename)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {getFileIcon(filename)}
                    <span className="text-sm truncate">{filename}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileDelete(filename);
                    }}
                    className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Resize handle */}
        <div 
          className="w-1 bg-gray-700 cursor-col-resize hover:bg-blue-500 transition-colors"
          onMouseDown={startResizing}
          onTouchStart={() => {}} // Empty handler to enable touch events
        ></div>
        
        {/* Editor and terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={onCodeChange}
              theme={theme}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: true },
                fontSize: fontSize,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 10, bottom: 10 },
                lineHeight: 1.6,
                fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                roundedSelection: true,
                cursorStyle: 'line',
                cursorWidth: 2,
                renderLineHighlight: 'all',
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  verticalScrollbarSize: 12,
                  horizontalScrollbarSize: 12,
                },
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true },
                autoIndent: 'full',
                formatOnPaste: true,
                formatOnType: true
              }}
            />
          </div>
          
          {/* Terminal resize handle */}
          {showTerminal && (
            <div 
              ref={terminalRef}
              className="h-1 bg-gray-700 cursor-row-resize hover:bg-blue-500 transition-colors"
              onMouseDown={startTerminalResizing}
              onTouchStart={() => {}} // Empty handler to enable touch events
            ></div>
          )}
          
          {/* Terminal */}
          {showTerminal && (
            <div 
              className="bg-gray-900 border-t border-gray-700 overflow-hidden"
              style={{ height: `${terminalHeight}px` }}
            >
              <div className="flex items-center justify-between px-3 py-1 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-medium">Terminal</span>
                </div>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="p-3 font-mono text-sm overflow-y-auto h-[calc(100%-28px)]">
                {isRunning ? (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Running code...</span>
                  </div>
                ) : (
                  output ? (
                    <pre className="whitespace-pre-wrap text-green-300">{output}</pre>
                  ) : (
                    <span className="text-gray-500">Terminal ready. Press Run to execute your code.</span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status bar */}
      <div className="h-6 bg-blue-600 text-white flex items-center justify-between px-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Ready</span>
          </div>
          <div>Ln {cursorPosition.line}, Col {cursorPosition.column}</div>
        </div>
        <div className="flex items-center gap-4">
          <div>{language.charAt(0).toUpperCase() + language.slice(1)}</div>
          <div>UTF-8</div>
          <div>Gurukul IDE</div>
        </div>
      </div>
    </div>
  );
}