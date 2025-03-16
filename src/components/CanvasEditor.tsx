'use client';

import React, { useState, useEffect, useRef } from 'react';
import { saveReportVersion, getReportVersions } from '@/lib/api';
import ChartDisplay from './ChartDisplay';

interface CanvasEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

export default function CanvasEditor({ initialContent = '', onSave }: CanvasEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [versions, setVersions] = useState<Array<{ id: string; timestamp: Date; name?: string; content: string }>>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showChartDemo, setShowChartDemo] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load versions on mount
  useEffect(() => {
    loadVersions();
  }, []);

  // Set up autosave
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (content && content !== initialContent) {
        handleSave();
      }
    }, 30000); // Autosave every 30 seconds

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, initialContent]);

  // Load versions from API
  const loadVersions = async () => {
    try {
      setIsLoading(true);
      const data = await getReportVersions();
      setVersions(data);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Handle save
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const savedVersion = await saveReportVersion(content);
      setVersions(prev => [...prev, savedVersion]);
      if (onSave) {
        onSave(content);
      }
    } catch (error) {
      console.error('Error saving version:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle version selection
  const handleVersionSelect = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setContent(version.content);
      setSelectedVersion(versionId);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  // Toggle chart demo
  const toggleChartDemo = () => {
    setShowChartDemo(!showChartDemo);
  };

  // Sample chart data
  const barChartData = {
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: [120, 150, 180, 210]
  };

  const pieChartData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    values: [30, 25, 15, 30]
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Report Editor</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={toggleChartDemo}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {showChartDemo ? 'Hide Charts' : 'Show Charts'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 space-x-4">
        <div className={`flex-1 ${showChartDemo ? 'w-1/2' : 'w-full'}`}>
          <div className="h-full flex flex-col">
            <textarea
              ref={editorRef}
              value={content}
              onChange={handleContentChange}
              className="flex-1 p-4 border rounded resize-none font-mono text-sm"
              placeholder="Your report content will appear here..."
            />
          </div>
        </div>

        {showChartDemo && (
          <div className="w-1/2 flex flex-col space-y-4">
            <div className="border rounded p-4">
              <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
              <ChartDisplay
                chartType="bar"
                data={barChartData}
                title="Quarterly Revenue"
                xLabel="Quarter"
                yLabel="Revenue ($K)"
                height="300px"
              />
            </div>
            
            <div className="border rounded p-4">
              <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
              <ChartDisplay
                chartType="pie"
                data={pieChartData}
                title="Revenue by Product"
                height="300px"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Versions</h3>
        <div className="max-h-40 overflow-y-auto border rounded">
          {versions.length === 0 ? (
            <p className="p-4 text-gray-500">No saved versions yet</p>
          ) : (
            <ul className="divide-y">
              {versions.map(version => (
                <li
                  key={version.id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    selectedVersion === version.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleVersionSelect(version.id)}
                >
                  <span className="font-medium">
                    {version.name || `Version ${formatTimestamp(version.timestamp)}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 