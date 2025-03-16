"use client";

import { useState, useEffect } from 'react';
import { DEFAULT_MODEL } from '@/lib/env';

interface AIModel {
  id: string;
  name: string;
  description: string;
  speedRating: number;
  qualityRating: number;
}

interface ModelSelectorProps {
  onModelChange: (model: string) => void;
}

export default function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const models: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'High quality model for complex reports',
      speedRating: 3,
      qualityRating: 5
    },
    {
      id: 'gpt-4-5',
      name: 'GPT-4.5',
      description: 'Balanced performance for most reports',
      speedRating: 3,
      qualityRating: 4
    },
    {
      id: 'claude-3-mini',
      name: 'Claude 3 Mini',
      description: 'Fast processing with good quality',
      speedRating: 4,
      qualityRating: 3
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      description: 'Highest quality for complex reports',
      speedRating: 2,
      qualityRating: 5
    },
    {
      id: 'o1-mini',
      name: 'O1 Mini',
      description: 'Advanced reasoning capabilities',
      speedRating: 3,
      qualityRating: 4
    }
  ];
  
  const [selectedModelId, setSelectedModelId] = useState(() => {
    // Use the default model from env if it's in the list, otherwise use the first model
    const defaultModel = models.find(model => model.id === DEFAULT_MODEL);
    return defaultModel ? defaultModel.id : models[0].id;
  });
  
  // Notify parent component when model changes
  useEffect(() => {
    onModelChange(selectedModelId);
  }, [selectedModelId, onModelChange]);
  
  const selectedModel = models.find(model => model.id === selectedModelId);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">AI Model</label>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100">
          {models.map(model => (
            <button
              key={model.id}
              className={`p-2 rounded text-sm text-left ${
                selectedModelId === model.id 
                  ? 'bg-white shadow' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedModelId(model.id)}
            >
              {model.name}
            </button>
          ))}
        </div>
        
        {selectedModel && (
          <div className="p-3 bg-white">
            <p className="text-sm mb-2">{selectedModel.description}</p>
            <div className="flex space-x-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Speed</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-4 mx-0.5 rounded-sm ${
                        i < selectedModel.speedRating 
                          ? 'bg-blue-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Quality</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-4 mx-0.5 rounded-sm ${
                        i < selectedModel.qualityRating 
                          ? 'bg-blue-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 