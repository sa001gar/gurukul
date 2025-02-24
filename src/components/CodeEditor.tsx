import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="border-b border-gray-200 px-4 py-2 flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-sm text-gray-600 font-medium">
          {language.charAt(0).toUpperCase() + language.slice(1)} Editor
        </div>
      </div>
      <div className="h-[600px]">
        <Editor
          height="100%"
          defaultLanguage="python"
          language={language}
          value={code}
          onChange={onChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
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
            }
          }}
        />
      </div>
    </div>
  );
}