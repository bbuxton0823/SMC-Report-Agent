"use client";

import React, { useState } from 'react';
import ReportTypeSelector from './ReportTypeSelector';
import ReportDescriptionInput from './ReportDescriptionInput';
import ModelSelector from './ModelSelector';
import PolicyDocumentsUpload from './PolicyDocumentsUpload';
import DataUpload from './DataUpload';
import WritingStyleUpload from './WritingStyleUpload';
import PerformanceSlider from './PerformanceSlider';
import FactualConfidenceToggle from './FactualConfidenceToggle';
import DraftModeToggle from './DraftModeToggle';
import SourcesToggle from './SourcesToggle';
import { generateReport } from '@/lib/api';
import { runAgent, AgentInput } from '@/lib/agents';
import { DEFAULT_MODEL } from '@/lib/env';

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
  const [reportType, setReportType] = useState('business');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [policyDocuments, setPolicyDocuments] = useState<File[]>([]);
  const [dataFiles, setDataFiles] = useState<File[]>([]);
  const [writingStyleFiles, setWritingStyleFiles] = useState<File[]>([]);
  const [performanceLevel, setPerformanceLevel] = useState(75); // Default to quality over speed
  const [factualConfidence, setFactualConfidence] = useState(true);
  const [draftMode, setDraftMode] = useState(true);
  const [sourceCitations, setSourceCitations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAntiHallucinationWarning, setShowAntiHallucinationWarning] = useState(false);

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
    // Show warning if no data files are uploaded
    setShowAntiHallucinationWarning(files.length === 0);
  };

  const handleWritingStyleFilesChange = (files: File[]) => {
    setWritingStyleFiles(files);
  };

  const handlePerformanceLevelChange = (level: number) => {
    setPerformanceLevel(level);
  };

  const handleFactualConfidenceChange = (isEnabled: boolean) => {
    setFactualConfidence(isEnabled);
  };

  const handleDraftModeChange = (isEnabled: boolean) => {
    setDraftMode(isEnabled);
  };

  const handleSourceCitationsChange = (isEnabled: boolean) => {
    setSourceCitations(isEnabled);
  };

  // Simulate progress updates during report generation
  const simulateProgress = () => {
    setGenerationProgress(0);
    setGenerationStage('Analyzing inputs...');
    
    const stages = [
      { progress: 5, message: 'Initializing...' },
      { progress: 10, message: 'Analyzing inputs...' },
      { progress: 20, message: 'Processing data files...' },
      { progress: 30, message: 'Extracting key insights...' },
      { progress: 40, message: 'Generating report structure...' },
      { progress: 50, message: 'Drafting content...' },
      { progress: 65, message: 'Applying formatting...' },
      { progress: 75, message: 'Generating visualizations...' },
      { progress: 85, message: 'Finalizing report...' },
      { progress: 95, message: 'Preparing for display...' },
      { progress: 100, message: 'Report ready!' }
    ];
    
    let currentStage = 0;
    
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setGenerationProgress(stages[currentStage].progress);
        setGenerationStage(stages[currentStage].message);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 700); // Update progress every 700ms
    
    return interval;
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Check if there's minimal data and warn the user
      if (dataFiles.length === 0 && policyDocuments.length === 0) {
        if (!window.confirm('You haven\'t uploaded any data files or policy documents. This significantly increases the risk of hallucinations (AI-generated content not based on real data). Do you want to continue anyway?')) {
          setIsGenerating(false);
          return;
        }
      }

      // Start progress simulation
      const progressInterval = simulateProgress();

      // Prepare input data for the agent
      const agentInput: AgentInput = {
        reportType,
        reportDescription,
        selectedModel,
        policyDocuments,
        dataFiles,
        performanceLevel,
        factualConfidence,
        draftMode,
        sourceCitations
      };

      // Run the agent to generate the report
      const reportContent = await runAgent(agentInput);

      // Ensure progress reaches 100% before completing
      setGenerationProgress(100);
      setGenerationStage('Report ready!');
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      // Short delay to show the completed progress
      setTimeout(() => {
        // Call the callback with the generated report content
        onReportGenerated(reportContent);
      }, 500);
      
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
      
      {showAntiHallucinationWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">Limited Data Warning</h3>
          <p className="text-xs text-yellow-700 mb-2">
            You haven't uploaded any data files. This increases the risk of hallucinations (AI-generated content not based on real data).
          </p>
          <p className="text-xs text-yellow-700">
            <strong>Recommendations:</strong> Upload relevant data files, use the anti-hallucination template in the Report Description, and keep the Factual Confidence, Draft Mode, and Source Citations features enabled.
          </p>
        </div>
      )}
      
      <div className="space-y-6">
        <ReportTypeSelector 
          onTypeChange={handleReportTypeChange} 
        />
        
        <ReportDescriptionInput
          onDescriptionChange={handleReportDescriptionChange}
        />
        
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Anti-Hallucination Features</h3>
          <div className="space-y-4">
            <FactualConfidenceToggle 
              onToggleChange={handleFactualConfidenceChange} 
            />
            
            <DraftModeToggle 
              onToggleChange={handleDraftModeChange} 
            />
            
            <SourcesToggle 
              onToggleChange={handleSourceCitationsChange} 
            />
          </div>
        </div>
        
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
        
        {isGenerating ? (
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{generationStage}</span>
              <span className="text-gray-600 font-medium">{generationProgress}%</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <button
              disabled
              className="w-full py-2 px-4 bg-gray-400 text-white font-semibold rounded-lg shadow-md opacity-50 cursor-not-allowed"
            >
              Generating Report...
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50"
          >
            Generate Report
          </button>
        )}
      </div>
    </div>
  );
} 