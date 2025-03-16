"use client";
import { useEffect, useState } from 'react';
import VersionSelector from '../version-control/VersionSelector';

interface Version {
  id: string;
  timestamp: Date;
  name?: string;
}

export default function CanvasEditor() {
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentContent, setCurrentContent] = useState<string | null>(null);
  
  // Initialize autosave
  useEffect(() => {
    if (!currentContent) return;
    
    const interval = setInterval(() => {
      saveVersion();
    }, 30000); // Autosave every 30 seconds
    
    setAutoSaveInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentContent]);
  
  const saveVersion = async () => {
    if (!currentContent) return;
    
    // In a real implementation, this would save to a database
    const newVersion: Version = {
      id: Date.now().toString(),
      timestamp: new Date(),
      name: `Autosave at ${new Date().toLocaleTimeString()}`
    };
    
    setVersions(prev => [...prev, newVersion]);
    console.log('Autosaved version:', newVersion.name);
  };
  
  const restoreVersion = (versionId: string) => {
    // In a real implementation, this would fetch content from the database
    console.log('Restoring version:', versionId);
  };
  
  const manualSaveVersion = () => {
    if (!currentContent) return;
    
    const versionName = prompt('Enter a name for this version:');
    if (!versionName) return;
    
    const newVersion: Version = {
      id: Date.now().toString(),
      timestamp: new Date(),
      name: versionName
    };
    
    setVersions(prev => [...prev, newVersion]);
    console.log('Manually saved version:', newVersion.name);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Canvas Editor</h2>
        <div className="flex space-x-2">
          <button 
            onClick={manualSaveVersion}
            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
            disabled={!currentContent}
          >
            Save Version
          </button>
          <VersionSelector 
            versions={versions} 
            onSelectVersion={restoreVersion} 
          />
        </div>
      </div>
      
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