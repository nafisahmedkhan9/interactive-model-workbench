import React, { useState } from 'react';
import { useNotebookStore } from '../store/notebookStore';

const NotebookSidebar: React.FC = () => {
  const { 
    notebooks, 
    activeNotebookId, 
    createNotebook, 
    deleteNotebook, 
    setActiveNotebook 
  } = useNotebookStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');

  const handleCreateNotebook = () => {
    if (newNotebookName.trim()) {
      createNotebook(newNotebookName.trim());
      setNewNotebookName('');
      setIsCreating(false);
    }
  };

  const handleDeleteNotebook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notebook?')) {
      deleteNotebook(id);
    }
  };

  return (
    <div className="notebook-sidebar">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Notebooks</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="btn btn-primary text-sm"
          >
            + New
          </button>
        </div>
        
        {isCreating && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <input
              type="text"
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              placeholder="Enter notebook name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateNotebook()}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCreateNotebook}
                className="btn btn-primary text-xs"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewNotebookName('');
                }}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {notebooks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No notebooks yet</p>
            <p className="text-sm">Create your first notebook to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {notebooks.map((notebook) => (
              <div
                key={notebook.id}
                className={`mb-2 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                  activeNotebookId === notebook.id
                    ? 'bg-primary-100 border border-primary-200'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => setActiveNotebook(notebook.id)}
                  >
                    <h3 className="font-medium text-gray-900 truncate">
                      {notebook.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {notebook.cells.length} cells
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`status-indicator status-${notebook.kernelStatus}`}>
                        {notebook.kernelStatus}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteNotebook(notebook.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="Delete notebook"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotebookSidebar; 