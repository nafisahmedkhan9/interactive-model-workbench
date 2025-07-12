import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Cell as CellType } from '../types';
import Cell from './Cell';

interface SortableCellProps {
  cell: CellType;
  notebookId: string;
}

const SortableCell: React.FC<SortableCellProps> = ({ cell, notebookId }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cell.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=""
    >
      <Cell 
        cell={cell} 
        notebookId={notebookId} 
        onEditingChange={setIsEditing}
        dragHandleProps={{ attributes, listeners }}
      />
    </div>
  );
};

export default SortableCell; 