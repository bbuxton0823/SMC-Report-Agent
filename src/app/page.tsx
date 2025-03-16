'use client';

import { useState } from 'react';
import InputPanel from '@/components/inputs/InputPanel';
import CanvasEditor from '@/components/CanvasEditor';

export default function Home() {
  const [reportContent, setReportContent] = useState<string>('');
  const [showCanvas, setShowCanvas] = useState<boolean>(false);

  const handleReportGenerated = (content: string) => {
    setReportContent(content);
    setShowCanvas(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SMC Report Generator</h1>
          <p className="text-gray-600">Generate professional reports with AI and data visualization</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <InputPanel onReportGenerated={handleReportGenerated} />
          </div>
          
          <div className={`transition-opacity duration-500 ${showCanvas ? 'opacity-100' : 'opacity-0'}`}>
            {showCanvas && (
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <CanvasEditor initialContent={reportContent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 