interface OutputPanelProps {
  output: string;
  loading: boolean;
}

export function OutputPanel({ output, loading }: OutputPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4" id="output-panel">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        Output
      </h2>
      <div className="h-[250px] bg-gray-50 rounded p-4 font-mono text-sm overflow-y-auto border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-2 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="text-gray-400 text-sm">Running your code...</div>
            </div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap">
            {output || 'Run your code to see the output here'}
          </pre>
        )}
      </div>
    </div>
  );
}