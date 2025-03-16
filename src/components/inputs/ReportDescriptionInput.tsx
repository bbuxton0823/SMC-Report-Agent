"use client";

import React, { useState } from 'react';

interface ReportDescriptionInputProps {
  onDescriptionChange: (description: string) => void;
}

export default function ReportDescriptionInput({ onDescriptionChange }: ReportDescriptionInputProps) {
  const [description, setDescription] = useState('');
  const [showAntiHallucination, setShowAntiHallucination] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    onDescriptionChange(newValue);
  };

  const applyAntiHallucinationTemplate = () => {
    const template = "Generate a report based ONLY on the provided data. Do not include any statistics, metrics, or specific conclusions that aren't directly supported by my uploads. If information is insufficient, acknowledge the limitations rather than making assumptions. Focus on analyzing the following data: [describe your data here]";
    setDescription(template);
    onDescriptionChange(template);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Report Description
        </label>
        <button
          type="button"
          onClick={() => setShowAntiHallucination(!showAntiHallucination)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Anti-hallucination tips
        </button>
      </div>
      
      {showAntiHallucination && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md mb-2">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Reducing AI Hallucinations</h4>
          <ul className="text-xs text-blue-700 list-disc pl-4 space-y-1 mb-2">
            <li>Be explicit about what data you're providing</li>
            <li>Specify what should NOT be included</li>
            <li>Ask the AI to acknowledge limitations rather than making assumptions</li>
            <li>Request citations for claims when possible</li>
          </ul>
          <button
            type="button"
            onClick={applyAntiHallucinationTemplate}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Apply Anti-Hallucination Template
          </button>
        </div>
      )}
      
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        rows={4}
        placeholder="Describe the type of report you want to generate. For best results, be specific about what data you're providing and what should NOT be included."
        value={description}
        onChange={handleChange}
      />
      <p className="text-xs text-gray-500">
        To reduce hallucinations, be specific about your data. Example: "Generate a quarterly financial report based ONLY on the attached spreadsheets. Do not include any statistics not found in my data."
      </p>
    </div>
  );
} 