"use client";

import { useState, useEffect } from 'react';

interface ReportTypeSelectorProps {
  onTypeChange: (type: string) => void;
}

export default function ReportTypeSelector({ onTypeChange }: ReportTypeSelectorProps) {
  const [reportTypes, setReportTypes] = useState({
    written: true,
    analytics: false
  });
  
  // Notify parent component when report type changes
  useEffect(() => {
    let reportType = 'written';
    if (reportTypes.written && reportTypes.analytics) {
      reportType = 'comprehensive';
    } else if (reportTypes.analytics) {
      reportType = 'analytics';
    }
    onTypeChange(reportType);
  }, [reportTypes, onTypeChange]);
  
  const handleToggle = (type: 'written' | 'analytics') => {
    setReportTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Report Type</label>
      
      <div className="flex flex-wrap gap-4">
        <button
          className={`flex items-center px-4 py-3 rounded-lg border-2 transition ${
            reportTypes.written 
              ? 'border-blue-600 bg-blue-50 text-blue-700' 
              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => handleToggle('written')}
        >
          <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
            reportTypes.written ? 'bg-blue-600' : 'bg-gray-200'
          }`}>
            {reportTypes.written && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Written Report</span>
            <span className="text-xs">Detailed text-based report</span>
          </div>
        </button>
        
        <button
          className={`flex items-center px-4 py-3 rounded-lg border-2 transition ${
            reportTypes.analytics 
              ? 'border-green-600 bg-green-50 text-green-700' 
              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => handleToggle('analytics')}
        >
          <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
            reportTypes.analytics ? 'bg-green-600' : 'bg-gray-200'
          }`}>
            {reportTypes.analytics && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Analytics Report</span>
            <span className="text-xs">With charts and visualizations</span>
          </div>
        </button>
      </div>
      
      {reportTypes.written && reportTypes.analytics && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-indigo-700">
            Both types selected. Your report will include written content and analytics visualizations.
          </p>
        </div>
      )}
    </div>
  );
} 