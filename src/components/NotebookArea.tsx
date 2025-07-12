import React, { useState, useRef, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useNotebookStore } from '../store/notebookStore';
import { Notebook } from '../types';
import SortableCell from './SortableCell';

interface NotebookAreaProps {
  notebook: Notebook;
}

const NotebookArea: React.FC<NotebookAreaProps> = ({ notebook }) => {
  const { addCell, reorderCells } = useNotebookStore();
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [cellHeights, setCellHeights] = useState<Map<string, number>>(new Map());

  // Calculate dynamic cell height based on content
  const getCellHeight = (cell: any) => {
    const baseHeight = 120; // Header + padding
    const contentHeight = cell.content ? Math.max(100, cell.content.split('\n').length * 20) : 100;
    const outputHeight = cell.output.length > 0 ? cell.output.length * 80 : 0;
    return baseHeight + contentHeight + outputHeight;
  };

  const virtualizer = useVirtualizer({
    count: notebook.cells.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const cell = notebook.cells[index];
      return getCellHeight(cell);
    },
    overscan: 5,
  });

  // Update virtualizer when cells change
  useEffect(() => {
    virtualizer.measure();
  }, [notebook.cells, virtualizer]);

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag end event:', event);
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = notebook.cells.findIndex(cell => cell.id === active.id);
      const newIndex = notebook.cells.findIndex(cell => cell.id === over.id);
      
      console.log('Reordering cells:', { oldIndex, newIndex, activeId: active.id, overId: over.id });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderCells(notebook.id, oldIndex, newIndex);
      }
    }
  };

  const handleAddCell = () => {
    addCell(notebook.id, {
      type: 'code',
      content: '',
      output: [],
      status: 'idle',
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{notebook.name}</h1>
          <p className="text-sm text-gray-500">
            {notebook.cells.length} cells • Last updated {notebook.updatedAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`status-indicator status-${notebook.kernelStatus}`}>
            Kernel: {notebook.kernelStatus}
          </span>
          <button
            onClick={handleAddCell}
            className="btn btn-primary"
          >
            + Add Cell
          </button>
        </div>
      </div>

      {/* Cells Container */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={notebook.cells.map(cell => cell.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              ref={parentRef}
              className="h-full overflow-auto p-4"
              style={{
                height: '100%',
                width: '100%',
              }}
            >
              {/* Temporarily disable virtualization to test drag-and-drop */}
              {notebook.cells.map((cell, index) => (
                <div key={cell.id} className="mb-4">
                  <SortableCell cell={cell} notebookId={notebook.id} />
                </div>
              ))}
              
              {/* Virtualized version (commented out for testing)
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const cell = notebook.cells[virtualRow.index];
                  const cellHeight = getCellHeight(cell);
                  
                  return (
                    <div
                      key={cell.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${cellHeight}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <SortableCell cell={cell} notebookId={notebook.id} />
                    </div>
                  );
                })}
              </div>
              */}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default NotebookArea; 