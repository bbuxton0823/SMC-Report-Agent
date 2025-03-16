"use client";

import React, { useState } from 'react';

interface ReportDescriptionInputProps {
  onDescriptionChange: (description: string) => void;
}

export default function ReportDescriptionInput({ onDescriptionChange }: ReportDescriptionInputProps) {
  const [description, setDescription] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    onDescriptionChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Report Description
      </label>
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        rows={4}
        placeholder="Describe the type of report you want to generate. Include any specific requirements, sections, or formatting preferences."
        value={description}
        onChange={handleChange}
      />
      <p className="text-xs text-gray-500">
        Be specific about your needs. For example: "I need a quarterly financial report with an executive summary, revenue analysis, and future projections."
      </p>
    </div>
  );
} 