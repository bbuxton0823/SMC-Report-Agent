"use client";

import { useEffect, useState, useRef } from 'react';
import VersionSelector from '../version-control/VersionSelector';
import EditorToolbar from './EditorToolbar';
import { saveReportVersion, getReportVersions } from '@/lib/api';
import { ENABLE_VERSION_CONTROL } from '@/lib/env';

interface Version {
  id: string;
  timestamp: Date;
  name?: string;
  content: string;
}

interface CanvasEditorProps {
  initialContent: string | null;
  streamingContent?: string | null;
  isStreaming?: boolean;
}

export default function CanvasEditor({ initialContent, streamingContent, isStreaming = false }: CanvasEditorProps) {
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentContent, setCurrentContent] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Initialize with initial content
  useEffect(() => {
    if (initialContent && versions.length === 0 && !isStreaming) {
      setIsProcessing(true);
      
      // Process and format the content
      const formattedContent = formatReportContent(initialContent);
      setCurrentContent(formattedContent);
      
      // Create initial version
      if (ENABLE_VERSION_CONTROL) {
        handleSaveVersion('Initial Version');
      }
      
      setIsProcessing(false);
    }
  }, [initialContent, versions.length, isStreaming]);
  
  // Handle streaming content updates
  useEffect(() => {
    if (isStreaming && streamingContent) {
      const formattedContent = formatReportContent(streamingContent);
      setCurrentContent(formattedContent);
    }
  }, [streamingContent, isStreaming]);
  
  // When streaming completes, save the version
  useEffect(() => {
    if (!isStreaming && currentContent && versions.length === 0) {
      if (ENABLE_VERSION_CONTROL) {
        handleSaveVersion('Initial Version');
      }
    }
  }, [isStreaming, currentContent, versions.length]);
  
  // Load versions from API
  useEffect(() => {
    if (ENABLE_VERSION_CONTROL) {
      loadVersions();
    }
  }, []);
  
  // Initialize autosave
  useEffect(() => {
    if (!currentContent || !ENABLE_VERSION_CONTROL) return;
    
    const interval = setInterval(() => {
      handleSaveVersion(`Autosave at ${new Date().toLocaleTimeString()}`);
    }, 30000); // Autosave every 30 seconds
    
    setAutoSaveInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentContent]);
  
  const loadVersions = async () => {
    try {
      const loadedVersions = await getReportVersions();
      setVersions(loadedVersions);
    } catch (err) {
      console.error('Error loading versions:', err);
      setError('Failed to load versions');
    }
  };
  
  const handleSaveVersion = async (versionName?: string) => {
    if (!currentContent) return;
    setIsSaving(true);
    setError(null);
    
    try {
      const newVersion = await saveReportVersion(currentContent, versionName);
      setVersions(prev => [...prev, newVersion]);
      console.log('Saved version:', newVersion.name);
    } catch (err) {
      console.error('Error saving version:', err);
      setError('Failed to save version');
    } finally {
      setIsSaving(false);
    }
  };
  
  const restoreVersion = (versionId: string) => {
    const selectedVersion = versions.find(v => v.id === versionId);
    if (selectedVersion) {
      setCurrentContent(selectedVersion.content);
      console.log('Restored version:', selectedVersion.name);
    }
  };
  
  const manualSaveVersion = () => {
    if (!currentContent) return;
    
    const versionName = prompt('Enter a name for this version:');
    if (!versionName) return;
    
    handleSaveVersion(versionName);
  };
  
  // Format the report content with proper styling
  const formatReportContent = (content: string): string => {
    // Hide metadata sections (confidence levels, draft status, etc.)
    let formattedContent = content
      .replace(/## Confidence Levels[\s\S]*?(?=##|$)/gm, '<div class="metadata-section">$&</div>')
      .replace(/## Draft Status[\s\S]*?(?=##|$)/gm, '<div class="metadata-section">$&</div>')
      .replace(/## Source Citations[\s\S]*?(?=##|$)/gm, '<div class="metadata-section">$&</div>')
      .replace(/## User Requirements[\s\S]*?(?=##|$)/gm, '<div class="metadata-section">$&</div>');
    
    // Replace confidence level indicators with styled spans
    formattedContent = formattedContent
      .replace(/\[High Confidence\]/g, '<span class="confidence high-confidence">[High Confidence]</span>')
      .replace(/\[Medium Confidence\]/g, '<span class="confidence medium-confidence">[Medium Confidence]</span>')
      .replace(/\[Low Confidence\]/g, '<span class="confidence low-confidence">[Low Confidence]</span>')
      .replace(/\[No Data\]/g, '<span class="confidence no-data">[No Data]</span>');
    
    // Style source citations
    formattedContent = formattedContent.replace(/\[Source: ([^\]]+)\]/g, '<span class="source-citation">[Source: $1]</span>');
    
    // Format headings
    formattedContent = formattedContent
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mt-4 mb-2">$1</h3>');
    
    // Format lists
    formattedContent = formattedContent.replace(/^- (.+)$/gm, '<li class="ml-5 list-disc">$1</li>');
    formattedContent = formattedContent.replace(/(<li[^>]*>.*<\/li>\n)+/g, '<ul class="my-3">$&</ul>');
    
    // Format numbered lists
    formattedContent = formattedContent.replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal">$1</li>');
    formattedContent = formattedContent.replace(/(<li class="ml-5 list-decimal">.*<\/li>\n)+/g, '<ol class="my-3">$&</ol>');
    
    // Format paragraphs
    formattedContent = formattedContent.replace(/^(?!<[holud]|$)(.+)$/gm, '<p class="my-2">$1</p>');
    
    // Format chart placeholders
    formattedContent = formattedContent.replace(/\[CHART: ([^\]]+)\]/g, 
      '<div class="chart-placeholder p-4 my-4 bg-gray-100 border border-gray-300 rounded-lg text-center">' +
      '<div class="text-gray-500 mb-2">📊 Chart Visualization</div>' +
      '<div class="font-medium">$1</div>' +
      '</div>'
    );
    
    // Format draft report notice
    formattedContent = formattedContent.replace(/\*\*DRAFT REPORT:\*\* ([^<]+)/g, 
      '<div class="draft-notice p-2 my-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">' +
      '<strong>DRAFT REPORT:</strong> $1' +
      '</div>'
    );
    
    return formattedContent;
  };
  
  // Handle toolbar formatting actions
  const handleFormatClick = (format: string) => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // If no text is selected for certain operations, alert the user
    if (!selectedText && ['bold', 'italic', 'underline', 'confidence-high', 'confidence-medium', 'confidence-low', 'source'].includes(format)) {
      alert('Please select some text first');
      return;
    }
    
    let newNode;
    
    switch (format) {
      case 'h1':
        document.execCommand('formatBlock', false, 'h1');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, 'h2');
        break;
      case 'h3':
        document.execCommand('formatBlock', false, 'h3');
        break;
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'ul':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'ol':
        document.execCommand('insertOrderedList', false);
        break;
      case 'confidence-high':
        newNode = document.createElement('span');
        newNode.className = 'confidence high-confidence';
        newNode.textContent = '[High Confidence] ' + selectedText;
        range.deleteContents();
        range.insertNode(newNode);
        break;
      case 'confidence-medium':
        newNode = document.createElement('span');
        newNode.className = 'confidence medium-confidence';
        newNode.textContent = '[Medium Confidence] ' + selectedText;
        range.deleteContents();
        range.insertNode(newNode);
        break;
      case 'confidence-low':
        newNode = document.createElement('span');
        newNode.className = 'confidence low-confidence';
        newNode.textContent = '[Low Confidence] ' + selectedText;
        range.deleteContents();
        range.insertNode(newNode);
        break;
      case 'source':
        const source = prompt('Enter source name:');
        if (source) {
          newNode = document.createElement('span');
          newNode.className = 'source-citation';
          newNode.textContent = ' [Source: ' + source + ']';
          range.collapse(false); // Move to end of selection
          range.insertNode(newNode);
        }
        break;
      case 'chart':
        const chartDescription = prompt('Enter chart description:');
        if (chartDescription) {
          const chartNode = document.createElement('div');
          chartNode.className = 'chart-placeholder p-4 my-4 bg-gray-100 border border-gray-300 rounded-lg text-center';
          chartNode.innerHTML = `
            <div class="text-gray-500 mb-2">📊 Chart Visualization</div>
            <div class="font-medium">${chartDescription}</div>
          `;
          range.deleteContents();
          range.insertNode(chartNode);
        }
        break;
    }
    
    // Update content state after formatting
    if (editorRef.current) {
      setCurrentContent(editorRef.current.innerHTML);
    }
  };
  
  // Handle export functionality
  const handleExportClick = () => {
    if (!currentContent) return;
    
    // Create a blob with the HTML content
    const blob = new Blob([currentContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Canvas Editor</h2>
        {ENABLE_VERSION_CONTROL && !isStreaming && (
          <div className="flex space-x-2">
            <button 
              onClick={manualSaveVersion}
              className={`px-3 py-1 bg-green-600 text-white rounded-md text-sm ${
                isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
              disabled={!currentContent || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Version'}
            </button>
            <VersionSelector 
              versions={versions} 
              onSelectVersion={restoreVersion} 
            />
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Editor Toolbar */}
      {currentContent && !isProcessing && !isStreaming && (
        <EditorToolbar 
          onFormatClick={handleFormatClick}
          onExportClick={handleExportClick}
        />
      )}
      
      <div className="flex-1 border rounded-lg p-4 bg-white overflow-auto">
        {isProcessing ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-500">Formatting report content...</p>
          </div>
        ) : isStreaming ? (
          <div 
            className="h-full w-full prose max-w-none report-content streaming-content" 
            dangerouslySetInnerHTML={{ __html: currentContent || '' }}
          />
        ) : currentContent ? (
          <div 
            ref={editorRef}
            className="h-full w-full prose max-w-none report-content" 
            contentEditable 
            dangerouslySetInnerHTML={{ __html: currentContent }}
            onInput={(e) => setCurrentContent(e.currentTarget.innerHTML)}
            style={{ 
              lineHeight: 1.6,
              fontSize: '1rem',
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Generate a report to get started
          </div>
        )}
      </div>
      
      <style jsx global>{`
        .report-content h1 {
          color: #1a202c;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        
        .report-content h2 {
          color: #2d3748;
        }
        
        .report-content h3 {
          color: #4a5568;
        }
        
        .report-content p {
          margin-bottom: 1rem;
        }
        
        .report-content ul, .report-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .report-content li {
          margin-bottom: 0.25rem;
        }
        
        .metadata-section {
          color: #CBD5E0;
          font-size: 0.75rem;
          margin: 0.5rem 0;
          padding: 0.5rem;
          background-color: #F7FAFC;
          border-left: 2px solid #E2E8F0;
        }
        
        .confidence {
          font-weight: 500;
          color: #718096;
          font-size: 0.75rem;
          opacity: 0.7;
        }
        
        .high-confidence {
          color: #22543d;
        }
        
        .medium-confidence {
          color: #744210;
        }
        
        .low-confidence {
          color: #822727;
        }
        
        .no-data {
          color: #4a5568;
        }
        
        .source-citation {
          font-size: 0.75rem;
          color: #718096;
          font-style: italic;
          opacity: 0.7;
        }
        
        .streaming-content {
          position: relative;
        }
        
        .streaming-content::after {
          content: '|';
          font-weight: bold;
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
} 