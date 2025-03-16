"use client";

import React, { useState, useEffect } from 'react';

interface SourcesToggleProps {
  onToggleChange: (isEnabled: boolean) => void;
}

export default function SourcesToggle({ onToggleChange }: SourcesToggleProps) {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    onToggleChange(isEnabled);
  }, [isEnabled, onToggleChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Source Citations
        </label>
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            isEnabled ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          onClick={() => setIsEnabled(!isEnabled)}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-gray-500">
        {isEnabled
          ? 'Enabled: The report will cite which uploaded document supports each claim, reducing hallucinations.'
          : 'Disabled: The report will be generated without explicit source citations.'}
      </p>
      {!isEnabled && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-700">
            <span className="font-medium">Warning:</span> Disabling source citations may make it difficult to verify the accuracy of the generated content.
          </p>
        </div>
      )}
    </div>
  );
} 