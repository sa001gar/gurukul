import { MessageSquareMore, AlertCircle, Lightbulb, Sparkles, Code2, CheckCircle2 } from 'lucide-react';

interface FeedbackPanelProps {
  feedback: {
    suggestions: string[];
    patterns: string[];
    errors: string[];
    bestPractices: string[];
  };
  analyzing: boolean;
  onAskMentor?: () => void;
}

export function FeedbackPanel({ feedback, analyzing, onAskMentor }: FeedbackPanelProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
          AI Feedback
        </h2>
        {onAskMentor && (
          <button
            onClick={onAskMentor}
            disabled={analyzing}
            className="inline-flex items-center px-3 py-1.5 border border-indigo-200 text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
          >
            <MessageSquareMore className="h-4 w-4 mr-2" />
            Ask Mentor
          </button>
        )}
      </div>
      <div 
        className="h-[300px] overflow-y-auto space-y-4 pr-2 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#C7D2FE transparent'
        }}
      >
        {analyzing ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Sparkles className="h-8 w- 8 text-indigo-500 animate-pulse mx-auto mb-2" />
              <p className="text-gray-500">Analyzing your code...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {feedback.errors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-red-600 font-medium flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm py-2">
                  <AlertCircle className="h-4 w-4" />
                  Errors Found
                </h3>
                <ul className="space-y-2">
                  {feedback.errors.map((error, index) => (
                    <li 
                      key={index} 
                      className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 hover:bg-red-100 transition-colors duration-200 cursor-default"
                    >
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback.patterns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-blue-600 font-medium flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm py-2">
                  <Code2 className="h-4 w-4" />
                  Code Patterns
                </h3>
                <ul className="space-y-2">
                  {feedback.patterns.map((pattern, index) => (
                    <li 
                      key={index} 
                      className="p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors duration-200 cursor-default"
                    >
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.bestPractices.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-green-600 font-medium flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm py-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Best Practices
                </h3>
                <ul className="space-y-2">
                  {feedback.bestPractices.map((practice, index) => (
                    <li 
                      key={index} 
                      className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 hover:bg-green-100 transition-colors duration-200 cursor-default"
                    >
                      {practice}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback.suggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-indigo-600 font-medium flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm py-2">
                  <Lightbulb className="h-4 w-4" />
                  Suggestions
                </h3>
                <ul className="space-y-2">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li 
                      key={index} 
                      className="p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors duration-200 cursor-default"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback.suggestions.length === 0 && 
             feedback.errors.length === 0 && 
             feedback.patterns.length === 0 && 
             feedback.bestPractices.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  Click "Analyze" to get AI feedback on your code
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}