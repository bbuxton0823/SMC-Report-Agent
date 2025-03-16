"use client";

import { useState, useEffect } from 'react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  speedRating: number;
  qualityRating: number;
  useCase: string;
  color: string;
}

interface ModelSelectorProps {
  reportTypes?: {
    written: boolean;
    analytics: boolean;
  };
}

export default function ModelSelector({ reportTypes = { written: true, analytics: false } }: ModelSelectorProps) {
  const models: AIModel[] = [
    {
      id: 'gpt-4-5',
      name: 'GPT-4.5',
      provider: 'OpenAI',
      description: 'Optimized for high-quality written reports with detailed analysis and professional tone',
      speedRating: 3,
      qualityRating: 5,
      useCase: 'written',
      color: 'blue'
    },
    {
      id: 'o3-mini-high',
      name: 'O3 Mini High',
      provider: 'OpenAI',
      description: 'Specialized for data visualization and analytics with advanced reasoning capabilities',
      speedRating: 4,
      qualityRating: 4,
      useCase: 'analytics',
      color: 'green'
    },
    {
      id: 'combined',
      name: 'Combined Models',
      provider: 'OpenAI',
      description: 'Uses GPT-4.5 for written content and O3 Mini High for analytics, working in conjunction for comprehensive reports',
      speedRating: 2,
      qualityRating: 5,
      useCase: 'combined',
      color: 'purple'
    }
  ];
  
  // Determine which models to show based on report types
  const [filteredModels, setFilteredModels] = useState<AIModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  
  useEffect(() => {
    let availableModels: AIModel[] = [];
    
    if (reportTypes.written && reportTypes.analytics) {
      // Both types selected - show combined option
      const combinedModel = models.find(m => m.useCase === 'combined');
      if (combinedModel) {
        availableModels = [combinedModel];
        setSelectedModelId(combinedModel.id);
      }
    } else if (reportTypes.written) {
      // Written only
      const writtenModel = models.find(m => m.useCase === 'written');
      if (writtenModel) {
        availableModels = [writtenModel];
        setSelectedModelId(writtenModel.id);
      }
    } else if (reportTypes.analytics) {
      // Analytics only
      const analyticsModel = models.find(m => m.useCase === 'analytics');
      if (analyticsModel) {
        availableModels = [analyticsModel];
        setSelectedModelId(analyticsModel.id);
      }
    } else {
      // Default to all models if no report type is selected
      availableModels = models;
      setSelectedModelId(models[0].id);
    }
    
    setFilteredModels(availableModels);
  }, [reportTypes]);
  
  const selectedModel = models.find(model => model.id === selectedModelId);
  
  // Helper function to get color classes based on model color
  const getColorClasses = (model: AIModel | undefined) => {
    if (!model) return {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      highlight: 'bg-gray-100'
    };
    
    switch (model.color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          text: 'text-blue-700',
          highlight: 'bg-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          text: 'text-green-700',
          highlight: 'bg-green-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-500',
          text: 'text-purple-700',
          highlight: 'bg-purple-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          highlight: 'bg-gray-100'
        };
    }
  };
  
  const colorClasses = getColorClasses(selectedModel);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M13 7h-2v2h2V7zm0 4h-2v2h2v-2zm-6-4H5v2h2V7zm0 4H5v2h2v-2zm12-2h-2v2h2V9zm0 4h-2v2h2v-2zM9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM5 3h2v2H5V3zm12 0h-2v2h2V3zm0 4h-2v2h2V7z" clipRule="evenodd" />
        </svg>
        <span className="section-title">AI Model Selection</span>
      </div>
      
      <div className={`border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${selectedModel ? `border-l-4 ${colorClasses.border}` : ''}`}>
        {filteredModels.length === 1 ? (
          // Single model display for automatic selection
          <div className={`p-4 bg-gradient-to-br ${colorClasses.bg}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${colorClasses.highlight} flex items-center justify-center mr-3 shadow-md`}>
                  {selectedModel?.useCase === 'written' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {selectedModel?.useCase === 'analytics' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {selectedModel?.useCase === 'combined' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`font-medium ${colorClasses.text}`}>{selectedModel?.name}</h3>
                  <p className="text-xs text-gray-600">by {selectedModel?.provider}</p>
                </div>
              </div>
              <span className={`${colorClasses.bg} ${colorClasses.text} text-xs px-3 py-1 rounded-full flex items-center border ${colorClasses.border} shadow-sm`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="tiny-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1">Active</span>
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{selectedModel?.description}</p>
            
            <div className="flex space-x-6">
              <div>
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="tiny-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Speed
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-4 mx-0.5 rounded-sm ${
                        selectedModel && i < selectedModel.speedRating 
                          ? `${colorClasses.highlight} shadow-sm`
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="tiny-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Quality
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-4 mx-0.5 rounded-sm ${
                        selectedModel && i < selectedModel.qualityRating 
                          ? `${colorClasses.highlight} shadow-sm`
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Multiple models display (fallback)
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-gradient-to-br from-gray-50 to-gray-100">
              {filteredModels.map(model => {
                const modelColors = getColorClasses(model);
                const isSelected = selectedModelId === model.id;
                
                return (
                  <button
                    key={model.id}
                    className={`p-3 rounded text-sm font-medium transition ${
                      isSelected 
                        ? `${modelColors.bg} shadow-lg ${modelColors.text} border-2 ${modelColors.border}` 
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-transparent shadow-sm hover:shadow-md'
                    }`}
                    onClick={() => setSelectedModelId(model.id)}
                  >
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${isSelected ? modelColors.highlight : 'bg-gray-200'}`}>
                          {model.useCase === 'written' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {model.useCase === 'analytics' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {model.useCase === 'combined' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                            </svg>
                          )}
                        </div>
                        <span className={isSelected ? modelColors.text : 'text-gray-700'}>
                          {model.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">by {model.provider}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {selectedModel && (
              <div className={`p-4 ${colorClasses.bg} border-t ${colorClasses.border}`}>
                <p className="text-sm mb-3">{selectedModel.description}</p>
                <div className="flex space-x-6">
                  <div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="tiny-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Speed
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-4 mx-0.5 rounded-sm ${
                            i < selectedModel.speedRating 
                              ? colorClasses.highlight
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="tiny-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Quality
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-4 mx-0.5 rounded-sm ${
                            i < selectedModel.qualityRating 
                              ? colorClasses.highlight
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <p className="text-xs text-gray-500 italic flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="tiny-icon text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span className="ml-1">Models automatically selected based on report type for optimal results</span>
      </p>
    </div>
  );
} 