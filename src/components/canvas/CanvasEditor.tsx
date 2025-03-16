"use client";

import { useEffect, useState } from 'react';
import VersionSelector from '../version-control/VersionSelector';
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
}

export default function CanvasEditor({ initialContent }: CanvasEditorProps) {
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentContent, setCurrentContent] = useState<string | null>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize with initial content
  useEffect(() => {
    if (initialContent && versions.length === 0) {
      setCurrentContent(initialContent);
      
      // Create initial version
      if (ENABLE_VERSION_CONTROL) {
        handleSaveVersion('Initial Version');
      }
    }
  }, [initialContent, versions.length]);
  
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
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Canvas Editor</h2>
        {ENABLE_VERSION_CONTROL && (
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
      
      <div className="flex-1 border rounded-lg p-4 bg-white">
        {currentContent ? (
          <div 
            className="h-full w-full" 
            contentEditable 
            dangerouslySetInnerHTML={{ __html: currentContent }}
            onInput={(e) => setCurrentContent(e.currentTarget.innerHTML)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Generate a report to get started
          </div>
        )}
      </div>
    </div>
  );
} 