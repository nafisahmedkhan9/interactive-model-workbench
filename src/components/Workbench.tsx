import React from 'react';
import NotebookSidebar from './NotebookSidebar';
import NotebookArea from './NotebookArea';
import { useNotebookStore } from '../store/notebookStore';

const Workbench: React.FC = () => {
  const { getActiveNotebook, createNotebook } = useNotebookStore();
  const activeNotebook = getActiveNotebook();

  const handleCreateNotebook = () => {
    createNotebook('New Notebook');
  };

  return (
    <div className="flex h-full bg-gray-50">
      <NotebookSidebar />
      <div className="flex-1 flex flex-col">
        {activeNotebook ? (
          <NotebookArea notebook={activeNotebook} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to Interactive Model Analysis Workbench
              </h2>
              <p className="text-gray-600 mb-6">
                Create a new notebook to get started with your analysis
              </p>
              <button 
                onClick={handleCreateNotebook}
                className="btn btn-primary"
              >
                Create New Notebook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workbench; 