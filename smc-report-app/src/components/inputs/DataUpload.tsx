"use client";

import { useState, useEffect } from 'react';

interface DataUploadProps {
  onUpload?: (files: File[]) => void;
  onDirectDataChange?: (data: string) => void;
}

export default function DataUpload({ onUpload, onDirectDataChange }: DataUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [directData, setDirectData] = useState('');
  
  useEffect(() => {
    if (onUpload && !isDirectInput) {
      onUpload(files);
    }
  }, [files, onUpload, isDirectInput]);
  
  useEffect(() => {
    if (onDirectDataChange && isDirectInput) {
      onDirectDataChange(directData);
    }
  }, [directData, onDirectDataChange, isDirectInput]);
  
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
  
  const handleDirectDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDirectData(e.target.value);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
          <span className="section-title">Data for Analytics</span>
        </div>
        <button
          onClick={toggleInputMode}
          className="flex items-center text-xs bg-gradient-to-r from-green-100 to-teal-100 text-green-800 px-3 py-1.5 rounded-full hover:from-green-200 hover:to-teal-200 transition-colors shadow-sm hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="tiny-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          <span className="ml-1">Switch to {isDirectInput ? 'File Upload' : 'Direct Input'}</span>
        </button>
      </div>
      
      {isDirectInput ? (
        <div className="border-2 border-green-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-teal-50 shadow-md">
          <textarea
            className="w-full h-32 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-inner"
            placeholder="Paste your data here (CSV, JSON, or plain text)..."
            onChange={handleDirectDataChange}
            value={directData}
          ></textarea>
        </div>
      ) : (
        <div className="border-2 border-dashed border-green-200 rounded-lg p-5 bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100/50 transition-colors duration-200 shadow-md">
          <div className="text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="upload-icon mx-auto text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            
            <p className="text-sm text-green-700">
              Upload data files for analytics and visualizations
            </p>
            
            <label className="inline-block cursor-pointer">
              <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-md text-sm hover:from-green-700 hover:to-teal-700 flex items-center shadow-md hover:shadow-lg transition-shadow">
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
                accept=".csv,.json,.xlsx,.xls,.txt"
              />
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-green-800">Selected files:</p>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded-md border border-green-100 shadow-sm">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="small-icon text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
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
      )}
    </div>
  );
} 