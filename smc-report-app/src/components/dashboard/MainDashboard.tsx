"use client";

import InputPanel from '@/components/inputs/InputPanel';
import CanvasEditor from '@/components/canvas/CanvasEditor';
import { useState } from 'react';

export default function MainDashboard() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  
  const handleGenerateReport = (content: string) => {
    setGeneratedContent(content);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 overflow-y-auto bg-gradient-to-b from-blue-50 via-white to-blue-50 shadow-xl border-r border-blue-100">
        <InputPanel onReportGenerated={handleGenerateReport} />
      </div>
      <div className="w-2/3 p-4 bg-white">
        <CanvasEditor initialContent={generatedContent} />
      </div>
    </div>
  );
} 