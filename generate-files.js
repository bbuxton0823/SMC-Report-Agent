const fs = require('fs');
const path = require('path');

console.log('Starting file generation...');

// Create directories
const directories = [
  'src/app',
  'src/components/dashboard',
  'src/components/canvas',
  'src/components/inputs',
  'src/components/version-control',
  'src/components/visualizations',
  'src/lib/ai',
  'src/lib/db',
  'src/lib/versioning',
  'src/hooks',
  'src/styles'
];

directories.forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error);
  }
});

// Create files
const files = [
  {
    path: 'src/app/page.tsx',
    content: `import MainDashboard from '@/components/dashboard/MainDashboard';

export default function Home() {
  return (
    <main className="min-h-screen">
      <MainDashboard />
    </main>
  );
}`
  },
  {
    path: 'src/app/layout.tsx',
    content: `import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Report Generator',
  description: 'Create professional business reports with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}`
  },
  {
    path: 'src/styles/globals.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}`
  },
  {
    path: 'src/components/dashboard/MainDashboard.tsx',
    content: `import InputPanel from '@/components/inputs/InputPanel';
import CanvasEditor from '@/components/canvas/CanvasEditor';

export default function MainDashboard() {
  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <InputPanel />
      </div>
      <div className="w-2/3 p-4">
        <CanvasEditor />
      </div>
    </div>
  );
}`
  },
  {
    path: 'src/components/inputs/InputPanel.tsx',
    content: `import { useState } from 'react';
import WritingStyleUpload from './WritingStyleUpload';
import PolicyDocumentsUpload from './PolicyDocumentsUpload';
import ReportTypeSelector from './ReportTypeSelector';
import DataUpload from './DataUpload';
import ModelSelector from './ModelSelector';

export default function InputPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    // TODO: Implement report generation logic
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Report Generator</h2>
      
      {/* Writing Style Input */}
      <WritingStyleUpload />
      
      {/* Policy Documents Upload */}
      <PolicyDocumentsUpload />
      
      {/* Report Type Selection */}
      <ReportTypeSelector />
      
      {/* Data Upload for Analytics */}
      <DataUpload />
      
      {/* Model Selection */}
      <ModelSelector />
      
      {/* Generate Button */}
      <button 
        className={\`w-full py-2 rounded-lg \${
          isGenerating 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white\`}
        onClick={handleGenerateReport}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Report'}
      </button>
    </div>
  );
}`
  },
  {
    path: 'src/components/canvas/CanvasEditor.tsx',
    content: `import { useEffect, useState } from 'react';
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
      name: \`Autosave at \${new Date().toLocaleTimeString()}\`
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
}`
  },
  {
    path: 'src/components/version-control/VersionSelector.tsx',
    content: `interface Version {
  id: string;
  timestamp: Date;
  name?: string;
}

interface VersionSelectorProps {
  versions: Version[];
  onSelectVersion: (versionId: string) => void;
}

export default function VersionSelector({ versions, onSelectVersion }: VersionSelectorProps) {
  if (versions.length === 0) {
    return <span className="text-sm text-gray-500">No saved versions</span>;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">Version:</span>
      <select 
        className="border rounded-md px-2 py-1 text-sm"
        onChange={(e) => onSelectVersion(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select a version</option>
        {versions.map((version) => (
          <option key={version.id} value={version.id}>
            {version.name || new Date(version.timestamp).toLocaleString()}
          </option>
        ))}
      </select>
    </div>
  );
}`
  },
  {
    path: 'src/components/inputs/WritingStyleUpload.tsx',
    content: `import { useState } from 'react';

export default function WritingStyleUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const recommendedCount = 3;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Writing Style Samples</label>
        <span className="text-xs text-gray-500">
          Recommended: {recommendedCount} files
        </span>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Upload documents that represent your writing style
          </p>
          
          <label className="inline-block cursor-pointer">
            <span className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              Select Files
            </span>
            <input 
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleFileChange}
              accept=".doc,.docx,.pdf,.txt"
            />
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Selected files:</p>
            <ul className="space-y-1">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span className="truncate">{file.name}</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}`
  },
  {
    path: 'src/components/inputs/PolicyDocumentsUpload.tsx',
    content: `import { useState } from 'react';

export default function PolicyDocumentsUpload() {
  const [files, setFiles] = useState<File[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Policy Documents (Optional)</label>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Upload any policy documents that should be referenced
          </p>
          
          <label className="inline-block cursor-pointer">
            <span className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              Select Files
            </span>
            <input 
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleFileChange}
              accept=".doc,.docx,.pdf,.txt"
            />
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Selected files:</p>
            <ul className="space-y-1">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span className="truncate">{file.name}</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}`
  },
  {
    path: 'src/components/inputs/ReportTypeSelector.tsx',
    content: `import { useState } from 'react';

export default function ReportTypeSelector() {
  const [reportTypes, setReportTypes] = useState({
    written: true,
    analytics: false
  });
  
  const handleToggle = (type: 'written' | 'analytics') => {
    setReportTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Report Type</label>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <button
            className={\`relative inline-flex h-6 w-11 items-center rounded-full \${
              reportTypes.written ? 'bg-blue-600' : 'bg-gray-200'
            }\`}
            onClick={() => handleToggle('written')}
          >
            <span
              className={\`inline-block h-4 w-4 transform rounded-full bg-white transition \${
                reportTypes.written ? 'translate-x-6' : 'translate-x-1'
              }\`}
            />
          </button>
          <span className="ml-3 text-sm">Written Report</span>
        </div>
        
        <div className="flex items-center">
          <button
            className={\`relative inline-flex h-6 w-11 items-center rounded-full \${
              reportTypes.analytics ? 'bg-blue-600' : 'bg-gray-200'
            }\`}
            onClick={() => handleToggle('analytics')}
          >
            <span
              className={\`inline-block h-4 w-4 transform rounded-full bg-white transition \${
                reportTypes.analytics ? 'translate-x-6' : 'translate-x-1'
              }\`}
            />
          </button>
          <span className="ml-3 text-sm">Analytics with Visuals</span>
        </div>
      </div>
      
      {reportTypes.written && reportTypes.analytics && (
        <p className="text-sm text-green-600 mt-2">
          Both types selected. Your report will include written content and analytics visualizations.
        </p>
      )}
    </div>
  );
}`
  },
  {
    path: 'src/components/inputs/DataUpload.tsx',
    content: `import { useState } from 'react';

export default function DataUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [directData, setDirectData] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
      setIsDirectInput(false);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const toggleInputMode = () => {
    setIsDirectInput(!isDirectInput);
    if (!isDirectInput) {
      setFiles([]);
    } else {
      setDirectData('');
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Data for Analytics</label>
        <button
          onClick={toggleInputMode}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Switch to {isDirectInput ? 'File Upload' : 'Direct Input'}
        </button>
      </div>
      
      {isDirectInput ? (
        <div className="border-2 border-gray-300 rounded-lg">
          <textarea
            className="w-full p-2 rounded-lg h-32 text-sm"
            placeholder="Paste your CSV or JSON data here..."
            value={directData}
            onChange={(e) => setDirectData(e.target.value)}
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Upload CSV or JSON files for data visualization
            </p>
            
            <label className="inline-block cursor-pointer">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                Select Files
              </span>
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
                accept=".csv,.json,.xlsx"
              />
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Selected files:</p>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <span className="truncate">{file.name}</span>
                    <button 
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}`
  },
  {
    path: 'src/components/inputs/ModelSelector.tsx',
    content: `import { useState } from 'react';

interface AIModel {
  id: string;
  name: string;
  description: string;
  speedRating: number;
  qualityRating: number;
}

export default function ModelSelector() {
  const models: AIModel[] = [
    {
      id: 'gpt-4-5',
      name: 'GPT-4.5',
      description: 'Balanced performance for most reports',
      speedRating: 3,
      qualityRating: 4
    },
    {
      id: 'claude-3-mini',
      name: 'Claude 3 Mini',
      description: 'Fast processing with good quality',
      speedRating: 4,
      qualityRating: 3
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      description: 'Highest quality for complex reports',
      speedRating: 2,
      qualityRating: 5
    },
    {
      id: 'o1-mini',
      name: 'O1 Mini',
      description: 'Advanced reasoning capabilities',
      speedRating: 3,
      qualityRating: 4
    }
  ];
  
  const [selectedModelId, setSelectedModelId] = useState(models[0].id);
  
  const selectedModel = models.find(model => model.id === selectedModelId);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">AI Model</label>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100">
          {models.map(model => (
            <button
              key={model.id}
              className={\`p-2 rounded text-sm text-left \${
                selectedModelId === model.id 
                  ? 'bg-white shadow' 
                  : 'hover:bg-gray-50'
              }\`}
              onClick={() => setSelectedModelId(model.id)}
            >
              {model.name}
            </button>
          ))}
        </div>
        
        {selectedModel && (
          <div className="p-3 bg-white">
            <p className="text-sm mb-2">{selectedModel.description}</p>
            <div className="flex space-x-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Speed</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={\`w-2 h-4 mx-0.5 rounded-sm \${
                        i < selectedModel.speedRating 
                          ? 'bg-blue-500' 
                          : 'bg-gray-200'
                      }\`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Quality</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={\`w-2 h-4 mx-0.5 rounded-sm \${
                        i < selectedModel.qualityRating 
                          ? 'bg-blue-500' 
                          : 'bg-gray-200'
                      }\`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`
  },
  {
    path: 'src/types.d.ts',
    content: `/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
  }
  interface Timeout {}
}`
  },
  {
    path: 'next-env.d.ts',
    content: `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.`
  },
  {
    path: 'package.json',
    content: `{
  "name": "smc-report-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.60",
    "@types/react-dom": "^18.2.19",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.57.0",
    "next": "^14.1.0",
    "postcss": "^8.4.35",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}`
  }
];

files.forEach(file => {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory for file: ${dir}`);
    }
    
    fs.writeFileSync(file.path, file.content, 'utf8');
    console.log(`Created file: ${file.path}`);
  } catch (error) {
    console.error(`Error writing file ${file.path}:`, error);
  }
});

console.log('All files created successfully!'); 