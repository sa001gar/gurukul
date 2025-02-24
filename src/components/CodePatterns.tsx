import { CheckCircle2, Code2 } from 'lucide-react';

interface CodePatternsProps {
  patterns: string[];
  bestPractices: string[];
}

export function CodePatterns({ patterns, bestPractices }: CodePatternsProps) {
  if (patterns.length === 0 && bestPractices.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-medium bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Code Analysis
      </h2>
      <div className="space-y-4">
        {patterns.length > 0 && (
          <div>
            <h3 className="text-orange-600 font-medium flex items-center gap-2 mb-2">
              <Code2 className="h-4 w-4" />
              Code Patterns
            </h3>
            <ul className="space-y-2">
              {patterns.map((pattern, index) => (
                <li key={index} className="p-2 bg-orange-50 text-orange-700 rounded border border-orange-100">
                  {pattern}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {bestPractices.length > 0 && (
          <div>
            <h3 className="text-green-600 font-medium flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4" />
              Best Practices
            </h3>
            <ul className="space-y-2">
              {bestPractices.map((practice, index) => (
                <li key={index} className="p-2 bg-green-50 text-green-700 rounded border border-green-100">
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}