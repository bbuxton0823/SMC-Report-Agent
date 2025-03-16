"use client";

import React from 'react';

interface EditorToolbarProps {
  onFormatClick: (format: string) => void;
  onExportClick: () => void;
}

export default function EditorToolbar({ onFormatClick, onExportClick }: EditorToolbarProps) {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-md p-1 mb-3 flex flex-wrap gap-1">
      <div className="flex space-x-1">
        <button 
          onClick={() => onFormatClick('h1')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium"
          title="Heading 1"
        >
          H1
        </button>
        <button 
          onClick={() => onFormatClick('h2')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium"
          title="Heading 2"
        >
          H2
        </button>
        <button 
          onClick={() => onFormatClick('h3')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium"
          title="Heading 3"
        >
          H3
        </button>
      </div>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <div className="flex space-x-1">
        <button 
          onClick={() => onFormatClick('bold')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
          </svg>
        </button>
        <button 
          onClick={() => onFormatClick('italic')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
          </svg>
        </button>
        <button 
          onClick={() => onFormatClick('underline')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
          title="Underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
          </svg>
        </button>
      </div>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <div className="flex space-x-1">
        <button 
          onClick={() => onFormatClick('ul')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
        </button>
        <button 
          onClick={() => onFormatClick('ol')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700"
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
            <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
          </svg>
        </button>
      </div>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <div className="flex space-x-1">
        <button 
          onClick={() => onFormatClick('confidence-high')}
          className="p-1.5 rounded hover:bg-gray-200 bg-green-50 text-green-800 text-xs font-medium"
          title="High Confidence"
        >
          High
        </button>
        <button 
          onClick={() => onFormatClick('confidence-medium')}
          className="p-1.5 rounded hover:bg-gray-200 bg-yellow-50 text-yellow-800 text-xs font-medium"
          title="Medium Confidence"
        >
          Medium
        </button>
        <button 
          onClick={() => onFormatClick('confidence-low')}
          className="p-1.5 rounded hover:bg-gray-200 bg-red-50 text-red-800 text-xs font-medium"
          title="Low Confidence"
        >
          Low
        </button>
      </div>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <div className="flex space-x-1">
        <button 
          onClick={() => onFormatClick('source')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
          title="Add Source Citation"
        >
          Add Source
        </button>
        <button 
          onClick={() => onFormatClick('chart')}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
          title="Add Chart Placeholder"
        >
          Add Chart
        </button>
      </div>
      
      <div className="ml-auto">
        <button 
          onClick={onExportClick}
          className="p-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium"
          title="Export Report"
        >
          Export
        </button>
      </div>
    </div>
  );
} 