import { Play, Sparkles, Trash2, Download } from 'lucide-react';

interface ActionButtonsProps {
  onRun: () => void;
  onAnalyze: () => void;
  onClear: () => void;
  onDownload: () => void;
  loading: boolean;
  analyzing: boolean;
}

export function ActionButtons({ 
  onRun, 
  onAnalyze, 
  onClear, 
  onDownload, 
  loading, 
  analyzing 
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onRun}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        <Play className="h-4 w-4 mr-2" />
        {loading ? 'Running...' : 'Run Code'}
      </button>
      <button
        onClick={onAnalyze}
        disabled={analyzing}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {analyzing ? 'Analyzing...' : 'Get AI Feedback'}
      </button>
      <button
        onClick={onClear}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clear
      </button>
      <button
        onClick={onDownload}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </button>
    </div>
  );
}