"use client";

import { useState, useEffect } from 'react';

interface DataUploadProps {
  onFilesChange: (files: File[]) => void;
}

export default function DataUpload({ onFilesChange }: DataUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [directData, setDirectData] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Notify parent component when files change
  useEffect(() => {
    // If in direct input mode, we don't have files to send
    if (!isDirectInput) {
      onFilesChange(files);
    } else {
      // For direct input, we could convert the text to a File object if needed
      // For now, just send an empty array
      onFilesChange([]);
    }
  }, [files, isDirectInput, onFilesChange]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
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
} 