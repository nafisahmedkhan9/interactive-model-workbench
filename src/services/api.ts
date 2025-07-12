import { 
  ApiResponse, 
  Notebook, 
  JupyterKernel, 
  CreateNotebookRequest, 
  ExecuteCellRequest, 
  UpdateCellRequest 
} from '../types';

// Dummy API functions for development
// In production, these would connect to actual Jupyter backend

// Mock WebSocket interface for development
interface MockWebSocket {
  readyState: number;
  send: (data: string) => void;
  close: () => void;
  addEventListener: (event: string, handler: EventListener) => void;
  removeEventListener: () => void;
}

export const apiService = {
  // Notebook management
  async createNotebook(request: CreateNotebookRequest): Promise<ApiResponse<Notebook>> {
    // Dummy implementation
    const notebook: Notebook = {
      id: Math.random().toString(36).substr(2, 9),
      name: request.name,
      cells: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      kernelStatus: 'idle',
    };
    
    return {
      data: notebook,
      status: 201,
      message: 'Notebook created successfully',
    };
  },

  async getNotebooks(): Promise<ApiResponse<Notebook[]>> {
    // Dummy implementation
    const notebooks: Notebook[] = [
      {
        id: '1',
        name: 'Sample Analysis',
        cells: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        kernelStatus: 'idle',
      },
      {
        id: '2',
        name: 'Model Training',
        cells: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        kernelStatus: 'idle',
      },
    ];
    
    return {
      data: notebooks,
      status: 200,
    };
  },

  async getNotebook(id: string): Promise<ApiResponse<Notebook>> {
    // Dummy implementation
    const notebook: Notebook = {
      id,
      name: `Notebook ${id}`,
      cells: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      kernelStatus: 'idle',
    };
    
    return {
      data: notebook,
      status: 200,
    };
  },

  async deleteNotebook(id: string): Promise<ApiResponse<void>> {
    // Dummy implementation
    return {
      data: undefined,
      status: 204,
      message: 'Notebook deleted successfully',
    };
  },

  // Kernel management
  async startKernel(notebookId: string): Promise<ApiResponse<JupyterKernel>> {
    // Dummy implementation
    const kernel: JupyterKernel = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'python3',
      status: 'idle',
    };
    
    return {
      data: kernel,
      status: 200,
      message: 'Kernel started successfully',
    };
  },

  async getKernels(): Promise<ApiResponse<JupyterKernel[]>> {
    // Dummy implementation
    const kernels: JupyterKernel[] = [
      {
        id: '1',
        name: 'python3',
        status: 'idle',
      },
      {
        id: '2',
        name: 'python3',
        status: 'busy',
      },
    ];
    
    return {
      data: kernels,
      status: 200,
    };
  },

  // Cell execution
  async executeCell(request: ExecuteCellRequest): Promise<ApiResponse<void>> {
    // Dummy implementation - in real implementation, this would send code to Jupyter
    return {
      data: undefined,
      status: 200,
      message: 'Cell execution started',
    };
  },

  async updateCell(request: UpdateCellRequest): Promise<ApiResponse<void>> {
    // Dummy implementation
    return {
      data: undefined,
      status: 200,
      message: 'Cell updated successfully',
    };
  },

  // WebSocket connection
  createWebSocketConnection(notebookId: string, kernelId: string): MockWebSocket {
    // Dummy WebSocket - in production, this would connect to Jupyter's WebSocket endpoint
    
    // For demo purposes, create a mock WebSocket that simulates real-time output
    const mockWebSocket: MockWebSocket = {
      readyState: WebSocket.CONNECTING,
      send: (data: string) => {
        // Simulate sending data
        console.log('WebSocket send:', data);
      },
      close: () => {
        // In a real implementation, this would close the WebSocket
        console.log('WebSocket closed');
      },
      addEventListener: (event: string, handler: EventListener) => {
        // Simulate WebSocket events
        if (event === 'open') {
          setTimeout(() => {
            handler(new Event('open'));
          }, 100);
        }
      },
      removeEventListener: () => {},
    };

    return mockWebSocket;
  },
};

// Helper function to simulate real-time output
export const simulateCellExecution = (
  cellId: string, 
  code: string, 
  onOutput: (output: any) => void
) => {
  // Simulate execution time
  setTimeout(() => {
    // Simulate stdout
    onOutput({
      type: 'stream',
      content: `Executing: ${code}\n`,
      cellId,
      timestamp: Date.now(),
    });

    // Simulate execution result
    setTimeout(() => {
      onOutput({
        type: 'execute_result',
        content: `Output: ${code.length} characters processed\n`,
        cellId,
        timestamp: Date.now(),
      });
    }, 500);
  }, 100);
}; 