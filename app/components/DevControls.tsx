"use client";

import { useState, useEffect } from "react";
import { DEV_CONFIG } from "../constants/development";
import { apiCache } from "../utils/cache";

export default function DevControls() {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    useMockResponses: DEV_CONFIG.USE_MOCK_RESPONSES,
    cacheApiResponses: DEV_CONFIG.CACHE_API_RESPONSES,
    mockResponseDelay: DEV_CONFIG.MOCK_RESPONSE_DELAY,
  });

  // Update the development config when settings change
  useEffect(() => {
    DEV_CONFIG.USE_MOCK_RESPONSES = settings.useMockResponses;
    DEV_CONFIG.CACHE_API_RESPONSES = settings.cacheApiResponses;
    DEV_CONFIG.MOCK_RESPONSE_DELAY = settings.mockResponseDelay;
  }, [settings]);

  if (!DEV_CONFIG.DEV_MODE) return null;

  const toggleVisibility = () => setIsVisible(!isVisible);
  
  const clearCache = () => {
    apiCache.clear();
    alert("Development cache cleared!");
  };

  return (
    <div className="fixed bottom-2 right-2 z-50">
      {/* Toggle button */}
      <button
        onClick={toggleVisibility}
        className="bg-gray-800 text-gray-200 p-2 rounded-md shadow-lg border border-gray-700 text-xs"
      >
        {isVisible ? "Hide Dev Controls" : "Show Dev Controls"}
      </button>

      {/* Control panel */}
      {isVisible && (
        <div className="bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg border border-gray-700 text-gray-200 mt-2 w-64">
          <h3 className="text-sm font-bold mb-3 text-yellow-400">Development Controls</h3>
          
          <div className="space-y-3">
            {/* Mock responses toggle */}
            <div className="flex items-center justify-between">
              <label className="text-xs">Use Mock Responses:</label>
              <input
                type="checkbox"
                checked={settings.useMockResponses}
                onChange={(e) => setSettings({ ...settings, useMockResponses: e.target.checked })}
                className="ml-2"
              />
            </div>
            
            {/* Cache API responses toggle */}
            <div className="flex items-center justify-between">
              <label className="text-xs">Cache API Responses:</label>
              <input
                type="checkbox"
                checked={settings.cacheApiResponses}
                onChange={(e) => setSettings({ ...settings, cacheApiResponses: e.target.checked })}
                className="ml-2"
              />
            </div>
            
            {/* Mock response delay slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs">Mock Delay (ms):</label>
                <span className="text-xs">{settings.mockResponseDelay}ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={settings.mockResponseDelay}
                onChange={(e) => setSettings({ ...settings, mockResponseDelay: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            
            {/* Clear cache button */}
            <button
              onClick={clearCache}
              className="bg-red-800 hover:bg-red-700 text-white py-1 px-3 rounded text-xs w-full mt-2"
            >
              Clear API Cache
            </button>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              Environment: <span className="text-green-400">Development</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 