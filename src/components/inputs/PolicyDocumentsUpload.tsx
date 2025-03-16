"use client";

import { useState, useEffect } from 'react';

interface PolicyDocumentsUploadProps {
  onFilesChange: (files: File[]) => void;
}

export default function PolicyDocumentsUpload({ onFilesChange }: PolicyDocumentsUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Notify parent component when files change
  useEffect(() => {
    onFilesChange(files);
  }, [files, onFilesChange]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const fileArray = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Policy Documents</label>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Optional
        </span>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
} 