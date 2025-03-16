"use client";

import InputPanel from '@/components/inputs/InputPanel';
import CanvasEditor from '@/components/canvas/CanvasEditor';
import { useState, useEffect } from 'react';

export default function MainDashboard() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleGenerateReport = (content: string) => {
    setIsTransitioning(true);
    setGeneratedContent(null);
    setStreamingContent('');
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      setShowCanvas(true);
      setIsStreaming(true);
      setIsTransitioning(false);
      
      // Start streaming the content token by token
      streamReportContent(content);
    }, 300);
  };
  
  // Function to simulate streaming content token by token
  const streamReportContent = (content: string) => {
    const tokens = tokenizeContent(content);
    let currentIndex = 0;
    let currentContent = '';
    
    const streamInterval = setInterval(() => {
      if (currentIndex < tokens.length) {
        currentContent += tokens[currentIndex];
        setStreamingContent(currentContent);
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
        setGeneratedContent(content);
      }
    }, 15); // Adjust speed as needed (lower = faster)
  };
  
  // Simple tokenizer that splits content into words and punctuation
  const tokenizeContent = (content: string): string[] => {
    // Split by characters for smoother streaming
    return content.split('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="py-6 bg-white shadow-sm">
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
          {/* Input Panel */}
          <div className={`
            w-full transition-all duration-300 ease-in-out
            ${showCanvas ? 'lg:w-1/3' : 'lg:w-2/3 mx-auto'}
            ${isTransitioning ? 'opacity-50' : 'opacity-100'}
          `}>
            <InputPanel onReportGenerated={handleGenerateReport} />
          </div>
          
          {/* Canvas Editor */}
          {(showCanvas || isTransitioning) && (
            <div className={`
              w-full lg:w-2/3 transition-all duration-300 ease-in-out
              ${isTransitioning ? 'opacity-0' : 'opacity-100'}
            `}>
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                {isTransitioning ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <CanvasEditor 
                    initialContent={generatedContent} 
                    streamingContent={streamingContent}
                    isStreaming={isStreaming}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 bg-white border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AI Report Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 