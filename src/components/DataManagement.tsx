import React, { useRef, useState } from 'react';
import { exportUserProgress, importUserProgress } from '../utils/storage';

interface DataManagementProps {
  onDataImported: () => void;
  onDataReset?: () => void;
}

/**
 * DataManagement component for importing and exporting data
 */
export function DataManagement({ onDataImported, onDataReset }: DataManagementProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
  const handleExport = () => {
    exportUserProgress();
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleResetClick = () => {
    setShowResetConfirmation(true);
  };
  
  const confirmReset = () => {
    // Clear localStorage
    localStorage.clear();
    setShowResetConfirmation(false);
    
    // Reload the page to initialize fresh data
    if (onDataReset) {
      onDataReset();
    } else {
      window.location.reload();
    }
  };
  
  const cancelReset = () => {
    setShowResetConfirmation(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = importUserProgress(jsonData);
        
        if (success) {
          setImportStatus('success');
          onDataImported();
          
          // Reset status after 3 seconds
          setTimeout(() => {
            setImportStatus('idle');
          }, 3000);
        } else {
          setImportStatus('error');
        }
      } catch (error) {
        console.error('Error reading file:', error);
        setImportStatus('error');
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">💾</span>
        Data Management
      </h2>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={handleExport}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md flex items-center justify-center"
        >
          <span className="mr-2">📤</span>
          Export Data
        </button>
        
        <button
          onClick={handleImportClick}
          className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3 px-4 rounded-md hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all shadow-md flex items-center justify-center"
        >
          <span className="mr-2">📥</span>
          Import Data
        </button>
        
        {!showResetConfirmation && (
          <button
            onClick={handleResetClick}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-md flex items-center justify-center"
          >
            <span className="mr-2">🗑️</span>
            Reset Data
          </button>
        )}
        
        {showResetConfirmation && (
          <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md shadow-sm">
            <p className="text-sm text-red-800 mb-3">
              <strong>Warning:</strong> This will permanently delete all your progress data. This action cannot be undone. Are you sure you want to continue?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={confirmReset}
                className="flex-1 bg-red-600 text-red-900 py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-sm"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={cancelReset}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Import data file"
        />
        
        {importStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 shadow-sm">
            <div className="flex items-center">
              <span className="text-xl mr-2">✅</span>
              <p>Data imported successfully!</p>
            </div>
          </div>
        )}
        
        {importStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 shadow-sm">
            <div className="flex items-center">
              <span className="text-xl mr-2">❌</span>
              <p>Error importing data. Please check the file format.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 