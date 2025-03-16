"use client";

import React, { useState } from 'react';
import ReportTypeSelector from './ReportTypeSelector';
import ReportDescriptionInput from './ReportDescriptionInput';
import ModelSelector from './ModelSelector';
import PolicyDocumentsUpload from './PolicyDocumentsUpload';
import DataUpload from './DataUpload';
import WritingStyleUpload from './WritingStyleUpload';
import PerformanceSlider from './PerformanceSlider';
import { generateReport } from '@/lib/api';
import { runAgent, AgentInput } from '@/lib/agents';

export interface InputData {
  reportType: string;
  reportDescription: string;
  selectedModel: string;
  policyDocuments: File[];
  dataFiles: File[];
  writingStyleFiles: File[];
  performanceLevel: number;
}

interface InputPanelProps {
  onReportGenerated: (content: string) => void;
}

export default function InputPanel({ onReportGenerated }: InputPanelProps) {
  const [reportType, setReportType] = useState('business');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [policyDocuments, setPolicyDocuments] = useState<File[]>([]);
  const [dataFiles, setDataFiles] = useState<File[]>([]);
  const [writingStyleFiles, setWritingStyleFiles] = useState<File[]>([]);
  const [performanceLevel, setPerformanceLevel] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReportTypeChange = (type: string) => {
    setReportType(type);
  };

  const handleReportDescriptionChange = (description: string) => {
    setReportDescription(description);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handlePolicyDocumentsChange = (files: File[]) => {
    setPolicyDocuments(files);
  };

  const handleDataFilesChange = (files: File[]) => {
    setDataFiles(files);
  };

  const handleWritingStyleFilesChange = (files: File[]) => {
    setWritingStyleFiles(files);
  };

  const handlePerformanceLevelChange = (level: number) => {
    setPerformanceLevel(level);
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Prepare input data for the agent
      const agentInput: AgentInput = {
        reportType,
        reportDescription,
        selectedModel,
        policyDocuments,
        dataFiles,
        performanceLevel
      };

      // Run the agent to generate the report
      const reportContent = await runAgent(agentInput);

      // Call the callback with the generated report content
      onReportGenerated(reportContent);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Report Configuration</h2>
      
      <div className="space-y-6">
        <ReportTypeSelector 
          onTypeChange={handleReportTypeChange} 
        />
        
        <ReportDescriptionInput
          onDescriptionChange={handleReportDescriptionChange}
        />
        
        <ModelSelector 
          onModelChange={handleModelChange} 
        />
        
        <PolicyDocumentsUpload 
          onFilesChange={handlePolicyDocumentsChange} 
        />
        
        <DataUpload 
          onFilesChange={handleDataFilesChange} 
        />
        
        <WritingStyleUpload 
          onFilesChange={handleWritingStyleFilesChange} 
        />
        
        <PerformanceSlider 
          onValueChange={handlePerformanceLevelChange} 
        />
        
        {error && (
          <div className="text-red-500 font-medium">{error}</div>
        )}
        
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
} 