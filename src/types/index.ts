export interface Cell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output: CellOutput[];
  status: 'idle' | 'running' | 'completed' | 'error';
  executionCount?: number;
  metadata?: Record<string, any>;
}

export interface CellOutput {
  id: string;
  type: 'stream' | 'display_data' | 'execute_result' | 'error';
  content: string | object;
  timestamp: number;
}

export interface Notebook {
  id: string;
  name: string;
  cells: Cell[];
  createdAt: Date;
  updatedAt: Date;
  kernelId?: string;
  kernelStatus: 'idle' | 'starting' | 'busy' | 'dead';
}

export interface JupyterKernel {
  id: string;
  name: string;
  status: 'idle' | 'starting' | 'busy' | 'dead';
}

export interface WebSocketMessage {
  type: 'stream' | 'display_data' | 'execute_result' | 'error';
  content: any;
  cellId: string;
  timestamp: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface CreateNotebookRequest {
  name: string;
}

export interface ExecuteCellRequest {
  cellId: string;
  code: string;
  notebookId: string;
}

export interface UpdateCellRequest {
  cellId: string;
  content: string;
  notebookId: string;
} 