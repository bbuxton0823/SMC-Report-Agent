"use client";

import InputPanel from '@/components/inputs/InputPanel';
import CanvasEditor from '@/components/canvas/CanvasEditor';
import { useState } from 'react';

export default function MainDashboard() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  
  const handleGenerateReport = (content: string) => {
    setGeneratedContent(content);
    setShowCanvas(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800">AI-Powered Report Generator</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Create professional business reports with AI using your writing style, policy documents, and data.
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`w-full ${showCanvas ? 'lg:w-1/2' : 'lg:w-2/3 mx-auto'} transition-all duration-300`}>
            <InputPanel onReportGenerated={handleGenerateReport} />
          </div>
          
          {showCanvas && (
            <div className="w-full lg:w-1/2 transition-all duration-300">
              <CanvasEditor initialContent={generatedContent} />
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AI Report Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 