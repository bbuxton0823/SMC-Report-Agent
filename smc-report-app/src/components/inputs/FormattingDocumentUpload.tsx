"use client";

import { useState, useEffect } from 'react';

interface FormattingDocumentUploadProps {
  onUpload?: (files: File[]) => void;
}

export default function FormattingDocumentUpload({ onUpload }: FormattingDocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  
  useEffect(() => {
    if (onUpload) {
      onUpload(files);
    }
  }, [files, onUpload]);
  
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
    <div className="space-y-3">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
        </svg>
        <span className="section-title">Formatting Document</span>
        <span className="ml-2 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded-full shadow-sm">
          Optional
        </span>
      </div>
      
      <div className="border-2 border-dashed border-purple-200 rounded-lg p-5 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100/50 transition-colors duration-200 shadow-md">
        <div className="text-center space-y-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="upload-icon mx-auto text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          
          <p className="text-sm text-purple-700">
            Upload a formatting template to maintain consistent styling in your report
          </p>
          
          <label className="inline-block cursor-pointer">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-sm hover:from-purple-700 hover:to-pink-700 flex items-center shadow-md hover:shadow-lg transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="small-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">Select Files</span>
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
            <p className="text-sm font-medium text-purple-800">Selected files:</p>
            <ul className="space-y-1">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded-md border border-purple-100 shadow-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="small-icon text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate ml-2">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="small-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
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