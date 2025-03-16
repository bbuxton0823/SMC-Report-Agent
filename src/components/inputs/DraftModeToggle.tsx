"use client";

import React, { useState, useEffect } from 'react';

interface DraftModeToggleProps {
  onToggleChange: (isEnabled: boolean) => void;
}

export default function DraftModeToggle({ onToggleChange }: DraftModeToggleProps) {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    onToggleChange(isEnabled);
  }, [isEnabled, onToggleChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Draft Mode
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
          ? 'Enabled: The report will be generated in draft mode with tentative language and explicit acknowledgment of data limitations.'
          : 'Disabled: The report will be generated in standard mode without explicit acknowledgment of limitations.'}
      </p>
      {!isEnabled && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-700">
            <span className="font-medium">Recommendation:</span> Keep Draft Mode enabled when working with limited data to reduce hallucinations.
          </p>
        </div>
      )}
    </div>
  );
} 