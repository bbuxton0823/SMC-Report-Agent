"use client";

import { useState } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        <span className="section-title">Describe Your Report</span>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-1 shadow-md">
          <textarea
            className="w-full p-3 rounded-lg bg-white border border-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner min-h-[100px] text-gray-700"
            placeholder="Describe the report you want to generate..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          ></textarea>
          
          <div className="flex justify-between items-center mt-2 px-2">
            <div className="text-xs text-blue-600">
              <span className="font-medium">Tip:</span> Be specific about content, style, and data needs
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-sm hover:from-blue-700 hover:to-indigo-700 flex items-center shadow-md hover:shadow-lg transition-all"
              disabled={!message.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="small-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">Submit</span>
            </button>
          </div>
        </div>
      </form>
      
      <div className="text-xs text-gray-500 px-2">
        Examples: "Create a quarterly business report with sales data" or "Generate a project status report in a formal style"
      </div>
    </div>
  );
} 