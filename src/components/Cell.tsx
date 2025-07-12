import React, { useState, useRef, useEffect } from 'react';
import { useNotebookStore } from '../store/notebookStore';
import { Cell as CellType } from '../types';
import { apiService, simulateCellExecution } from '../services/api';

interface CellProps {
  cell: CellType;
  notebookId: string;
  onEditingChange?: (isEditing: boolean) => void;
  dragHandleProps?: {
    attributes: any;
    listeners: any;
  };
}

const Cell: React.FC<CellProps> = ({ cell, notebookId, onEditingChange, dragHandleProps }) => {
  const { updateCell, updateCellOutput } = useNotebookStore();
  const [isEditing, setIsEditing] = useState(cell.content === ''); // Start editing if cell is empty
  const [localContent, setLocalContent] = useState(cell.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync local content with cell content
  useEffect(() => {
    setLocalContent(cell.content);
  }, [cell.content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  // Notify parent when editing state changes
  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  // Debug isEditing state changes
  useEffect(() => {
    console.log('isEditing state changed to:', isEditing);
  }, [isEditing]);

  // Debug component rendering
  useEffect(() => {
    console.log('Cell component rendered, isEditing:', isEditing);
  }, [isEditing]);

  const handleRunCell = async () => {
    // Use the current local content to ensure we have the latest changes
    const currentContent = localContent.trim();
    if (!currentContent) return;

    // Clear previous output before running
    updateCell(notebookId, cell.id, { 
      status: 'running',
      output: [] // Clear previous output
    });

    try {
      // Update cell in backend with current content
      await apiService.updateCell({
        cellId: cell.id,
        content: currentContent,
        notebookId,
      });

      // Execute cell with current content
      await apiService.executeCell({
        cellId: cell.id,
        code: currentContent,
        notebookId,
      });

      // Simulate real-time output
      simulateCellExecution(cell.id, currentContent, (output) => {
        updateCellOutput(notebookId, cell.id, output);
      });

      // Update execution count
      updateCell(notebookId, cell.id, {
        status: 'completed',
        executionCount: (cell.executionCount || 0) + 1,
      });
    } catch (error) {
      console.error('Error executing cell:', error);
      updateCell(notebookId, cell.id, { status: 'error' });
    }
  };

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    updateCell(notebookId, cell.id, { content });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditClick = () => {
    console.log('Edit button clicked, current isEditing:', isEditing);
    const newEditingState = !isEditing;
    console.log('Setting isEditing to:', newEditingState);
    setIsEditing(newEditingState);
  };

  const handleCellClick = (e: React.MouseEvent) => {
    console.log('Cell container clicked');
    console.log('Event target:', e.target);
    console.log('Event currentTarget:', e.currentTarget);
    // Check if the click was on an interactive element
    if (e.target instanceof HTMLButtonElement || 
        e.target instanceof HTMLTextAreaElement || 
        e.target instanceof HTMLInputElement ||
        (e.target as Element)?.closest('button') ||
        (e.target as Element)?.closest('textarea') ||
        (e.target as Element)?.closest('input')) {
      console.log('Click was on an interactive element, not handling cell click');
      return;
    }
    // Only handle cell clicks if not on an interactive element
    console.log('Handling cell click');
  };

  const handlePreClick = (e: React.MouseEvent) => {
    console.log('Pre element clicked, detail:', e.detail);
  };

  const getStatusColor = () => {
    switch (cell.status) {
      case 'running':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="cell mb-4">
      <div className="cell-header">
        <div className="flex items-center gap-2">
          <div 
            className="drag-handle cursor-move p-1 hover:bg-gray-200 rounded" 
            title="Drag to reorder"
            {...dragHandleProps?.attributes}
            {...dragHandleProps?.listeners}
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <span className="text-sm font-mono text-gray-500">
            In [{cell.executionCount || ' '}]:
          </span>
          <span className={`text-sm ${getStatusColor()}`}>
            {cell.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              console.log('Run button clicked');
              e.preventDefault();
              e.stopPropagation();
              handleRunCell();
            }}
            disabled={cell.status === 'running' || !localContent.trim()}
            className="px-3 py-1 rounded text-xs font-medium transition-colors duration-200 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
          >
            {cell.status === 'running' ? 'Running...' : 'Run'}
          </button>
          <button
            type="button"
            data-testid="edit-button"
            disabled={false} // Explicitly ensure it's not disabled
            onClick={(e) => {
              console.log('Edit button clicked - event received');
              console.log('Event target:', e.target);
              console.log('Event currentTarget:', e.currentTarget);
              console.log('isEditing before click:', isEditing);
              console.log('Button disabled:', e.currentTarget.disabled);
              e.preventDefault();
              e.stopPropagation();
              console.log('About to call handleEditClick');
              handleEditClick();
              console.log('handleEditClick called');
            }}
            className="px-3 py-1 rounded text-xs font-medium transition-colors duration-200 bg-gray-200 text-gray-900 hover:bg-gray-300"
            style={{ pointerEvents: 'auto' }} // Ensure pointer events are enabled
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

        <div className="cell-content">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={localContent}
              onChange={(e) => {
                console.log('Textarea onChange:', e.target.value);
                handleContentChange(e.target.value);
              }}
              onKeyDown={(e) => {
                console.log('Textarea keyDown:', e.key);
                // Only handle Ctrl+Enter, let all other keys pass through normally
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleRunCell();
                }
              }}
              onFocus={() => console.log('Textarea focused')}
              onBlur={() => console.log('Textarea blurred')}
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md font-mono text-sm bg-white resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Enter your code here... (Ctrl+Enter to run)"
              style={{ 
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          ) : (
            <pre 
              className="font-mono text-sm bg-gray-50 p-3 rounded border cursor-pointer hover:bg-gray-100 transition-colors"
              onDoubleClick={(e) => {
                e.preventDefault();
                handleDoubleClick();
              }}
              onClick={(e) => {
                handlePreClick(e);
                // Only handle single click if not a double click
                if (!e.detail || e.detail === 1) {
                  setIsEditing(true);
                }
              }}
            >
              <code>{cell.content || 'Click to edit (no content)'}</code>
            </pre>
          )}
        </div>

        {/* Output */}
        {cell.output.length > 0 && (
          <div className="cell-output">
            <div className="text-xs text-gray-500 mb-2">Output:</div>
            {cell.output.map((output) => (
              <div key={output.id} className="mb-2">
                <div className="text-xs text-gray-400 mb-1">
                  [{output.type}] {new Date(output.timestamp).toLocaleTimeString()}
                </div>
                <pre className="text-sm bg-white p-2 rounded border">
                  <code>{typeof output.content === 'string' ? output.content : JSON.stringify(output.content, null, 2)}</code>
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
  );
};

export default Cell; 