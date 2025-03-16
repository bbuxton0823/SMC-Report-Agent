"use client";

import { useState, useEffect } from 'react';
import WritingStyleUpload from './WritingStyleUpload';
import FormattingDocumentUpload from './FormattingDocumentUpload';
import ReportTypeSelector from './ReportTypeSelector';
import DataUpload from './DataUpload';
import ModelSelector from './ModelSelector';
import ChatInput from './ChatInput';

interface FileUpload {
  name: string;
  size: number;
  type: string;
}

export interface InputData {
  reportType: string;
  reportDescription: string;
  selectedModel: string;
  policyDocuments: File[];
  dataFiles: File[];
  writingStyleFiles: File[];
  performanceLevel: number;
  factualConfidence: boolean;
  draftMode: boolean;
  sourceCitations: boolean;
}

interface InputPanelProps {
  onReportGenerated: (content: string) => void;
}

export default function InputPanel({ onReportGenerated }: InputPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportTypes, setReportTypes] = useState({
    written: true,
    analytics: false
  });
  const [userInput, setUserInput] = useState('');
  const [writingStyleFiles, setWritingStyleFiles] = useState<File[]>([]);
  const [formattingDocuments, setFormattingDocuments] = useState<File[]>([]);
  const [dataFiles, setDataFiles] = useState<File[]>([]);
  const [directData, setDirectData] = useState('');
  const [hasFiles, setHasFiles] = useState(false);
  
  // Check if any files have been uploaded
  useEffect(() => {
    const filesUploaded = 
      writingStyleFiles.length > 0 || 
      formattingDocuments.length > 0 || 
      dataFiles.length > 0;
    
    setHasFiles(filesUploaded);
  }, [writingStyleFiles, formattingDocuments, dataFiles]);
  
  const handleReportTypeChange = (types: { written: boolean; analytics: boolean }) => {
    setReportTypes(types);
  };
  
  const handleChatSubmit = (message: string) => {
    setUserInput(message);
    
    // Automatically set report types based on message content
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('analytics') || 
        lowerCaseMessage.includes('data') || 
        lowerCaseMessage.includes('visualization') ||
        lowerCaseMessage.includes('chart') ||
        lowerCaseMessage.includes('graph') ||
        lowerCaseMessage.includes('metrics')) {
      setReportTypes({
        written: true,
        analytics: true
      });
    }
  };
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Determine report type based on user input and selection
      const reportType = reportTypes.analytics ? 'analytics' : 'quarterly';
      
      // Prepare the input data for the API
      const input = {
        reportType,
        reportDescription: userInput,
        selectedModel: 'gpt-4', // Default model
        factualConfidence: true,
        draftMode: true,
        sourceCitations: true
      };
      
      console.log('Sending API request with input:', input);
      
      // Call the API to generate the report
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Pass the generated report to the parent component
      onReportGenerated(data.report);
    } catch (error: any) {
      console.error('Error generating report:', error);
      // Show error in the report area
      onReportGenerated(`# Error Generating Report\n\nThere was an error generating your report. Please try again.\n\nError details: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 drop-shadow-sm">Report Generator</h2>
      
      {/* Chat Input */}
      <div className="border-b border-blue-100 pb-8">
        <ChatInput onSubmit={handleChatSubmit} />
      </div>
      
      {/* Writing Style Input */}
      <div className="border-b border-blue-100 pb-8">
        <WritingStyleUpload onUpload={setWritingStyleFiles} />
      </div>
      
      {/* Formatting Document Upload */}
      <div className="border-b border-blue-100 pb-8">
        <FormattingDocumentUpload onUpload={setFormattingDocuments} />
      </div>
      
      {/* Report Type Selection */}
      <div className="border-b border-blue-100 pb-8">
        <ReportTypeSelector onChange={handleReportTypeChange} initialValue={reportTypes} />
      </div>
      
      {/* Data Upload for Analytics */}
      <div className="border-b border-blue-100 pb-8">
        <DataUpload onUpload={setDataFiles} onDirectDataChange={setDirectData} />
      </div>
      
      {/* Model Selection */}
      <div className="border-b border-blue-100 pb-8">
        <ModelSelector reportTypes={reportTypes} />
      </div>
      
      {/* Generate Button */}
      <button 
        className={`w-full py-4 rounded-lg text-lg font-semibold ${
          isGenerating 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
        } text-white transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] transition-transform`}
        onClick={handleGenerateReport}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </div>
        ) : 'Generate Report'}
      </button>
      
      {/* Report Generation Info */}
      {!hasFiles && userInput && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mt-4 shadow-sm">
          <p className="text-sm text-blue-700">
            <span className="font-medium">No files uploaded.</span> Your report will be generated based on your chat input using {reportTypes.analytics ? 'GPT-4.5 and O3 Mini High' : 'GPT-4.5'}.
          </p>
        </div>
      )}
    </div>
  );
} 