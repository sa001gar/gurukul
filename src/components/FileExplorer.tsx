import React, { useState } from 'react';
import { FileCode, Folder, Plus, Trash2, File } from 'lucide-react';

interface FileExplorerProps {
  files: {[key: string]: string};
  currentFile: string;
  onFileSelect: (filename: string) => void;
  onFileCreate: (filename: string, content?: string) => void;
  onFileDelete: (filename: string) => void;
}

export function FileExplorer({ 
  files, 
  currentFile, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete 
}: FileExplorerProps) {
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);

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
      default:
        return <File className="w-4 h-4 text-gray-500" />;
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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200 h-[600px] flex flex-col">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-medium text-gray-700">Files</h2>
        </div>
        <button
          onClick={() => setIsCreatingFile(true)}
          className="p-1 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {isCreatingFile ? (
          <form onSubmit={handleCreateFile} className="p-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="filename.ext"
                className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : null}
        
        <div className="space-y-1">
          {Object.keys(files).map((filename) => (
            <div 
              key={filename}
              className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                currentFile === filename 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'hover:bg-gray-100 text-gray-700'
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
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}