import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { MessageSquare } from 'lucide-react';

interface AskMentorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAsk: (question: string) => Promise<void>;
}

export function AskMentorDialog({ open, onOpenChange, onAsk }: AskMentorDialogProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    await onAsk(question);
    setQuestion('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-700">
            <MessageSquare className="h-5 w-5" />
            Ask Your CS Mentor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Ask any question about your code or programming concepts, and our AI mentor will analyze and provide guidance.
            </p>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about your code?"
              className="w-full min-h-[120px] p-3 rounded-md border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            />
          </div>
          <DialogFooter>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Question
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}