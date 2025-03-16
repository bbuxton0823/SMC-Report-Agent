"use client";

import { useState, useEffect } from 'react';

interface ReportTypeSelectorProps {
  onChange?: (reportTypes: { written: boolean; analytics: boolean }) => void;
  initialValue?: { written: boolean; analytics: boolean };
}

export default function ReportTypeSelector({ onChange, initialValue }: ReportTypeSelectorProps) {
  const [reportTypes, setReportTypes] = useState(initialValue || {
    written: true,
    analytics: false
  });
  
  useEffect(() => {
    if (initialValue) {
      setReportTypes(initialValue);
    }
  }, [initialValue]);
  
  useEffect(() => {
    if (onChange) {
      onChange(reportTypes);
    }
  }, [reportTypes, onChange]);
  
  const handleToggle = (type: 'written' | 'analytics') => {
    setReportTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        <span className="section-title">Report Type</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          className={`p-4 rounded-lg border-2 transition-all duration-200 shadow-md hover:shadow-lg ${
            reportTypes.written 
              ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-300 text-indigo-800' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => handleToggle('written')}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              reportTypes.written ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-medium">Written Report</span>
          </div>
        </button>
        
        <button
          className={`p-4 rounded-lg border-2 transition-all duration-200 shadow-md hover:shadow-lg ${
            reportTypes.analytics 
              ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-800' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => handleToggle('analytics')}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              reportTypes.analytics ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-medium">Analytics</span>
          </div>
        </button>
      </div>
      
      <div className="text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
        <p>
          {reportTypes.written && reportTypes.analytics 
            ? 'Your report will include both written content and data visualizations.'
            : reportTypes.written 
              ? 'Your report will focus on written content only.'
              : reportTypes.analytics 
                ? 'Your report will focus on data analytics and visualizations.'
                : 'Please select at least one report type.'}
        </p>
      </div>
    </div>
  );
} 