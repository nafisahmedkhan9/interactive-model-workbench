import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Notebook, Cell, WebSocketMessage } from '../types';

interface NotebookState {
  notebooks: Notebook[];
  activeNotebookId: string | null;
  activeCellId: string | null;
  webSocketConnections: Map<string, WebSocket>;
  isLoading: boolean;
  error: string | null;
}

interface NotebookActions {
  // Notebook management
  createNotebook: (name: string) => void;
  deleteNotebook: (id: string) => void;
  updateNotebook: (id: string, updates: Partial<Notebook>) => void;
  setActiveNotebook: (id: string) => void;
  
  // Cell management
  addCell: (notebookId: string, cell: Omit<Cell, 'id'>) => void;
  deleteCell: (notebookId: string, cellId: string) => void;
  updateCell: (notebookId: string, cellId: string, updates: Partial<Cell>) => void;
  reorderCells: (notebookId: string, fromIndex: number, toIndex: number) => void;
  setActiveCell: (cellId: string) => void;
  
  // WebSocket management
  setWebSocketConnection: (notebookId: string, ws: WebSocket) => void;
  removeWebSocketConnection: (notebookId: string) => void;
  updateCellOutput: (notebookId: string, cellId: string, output: WebSocketMessage) => void;
  
  // UI state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getActiveNotebook: () => Notebook | null;
  getActiveCell: () => Cell | null;
  getNotebookById: (id: string) => Notebook | null;
  getCellById: (notebookId: string, cellId: string) => Cell | null;
}

type NotebookStore = NotebookState & NotebookActions;

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultCell = (): Cell => ({
  id: generateId(),
  type: 'code',
  content: '',
  output: [],
  status: 'idle',
  executionCount: undefined,
});

export const useNotebookStore = create<NotebookStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      notebooks: [],
      activeNotebookId: null,
      activeCellId: null,
      webSocketConnections: new Map(),
      isLoading: false,
      error: null,

      // Notebook management
      createNotebook: (name: string) => {
        const newNotebook: Notebook = {
          id: generateId(),
          name,
          cells: [createDefaultCell()],
          createdAt: new Date(),
          updatedAt: new Date(),
          kernelStatus: 'idle',
        };

        set((state) => ({
          notebooks: [...state.notebooks, newNotebook],
          activeNotebookId: newNotebook.id,
          activeCellId: newNotebook.cells[0]?.id || null,
        }));
      },

      deleteNotebook: (id: string) => {
        set((state) => {
          const newNotebooks = state.notebooks.filter(nb => nb.id !== id);
          const newActiveNotebookId = state.activeNotebookId === id 
            ? (newNotebooks[0]?.id || null) 
            : state.activeNotebookId;
          
          return {
            notebooks: newNotebooks,
            activeNotebookId: newActiveNotebookId,
            activeCellId: newActiveNotebookId ? newNotebooks.find(nb => nb.id === newActiveNotebookId)?.cells[0]?.id || null : null,
          };
        });
      },

      updateNotebook: (id: string, updates: Partial<Notebook>) => {
        set((state) => ({
          notebooks: state.notebooks.map(nb =>
            nb.id === id ? { ...nb, ...updates, updatedAt: new Date() } : nb
          ),
        }));
      },

      setActiveNotebook: (id: string) => {
        set({ activeNotebookId: id });
      },

      // Cell management
      addCell: (notebookId: string, cell: Omit<Cell, 'id'>) => {
        const newCell: Cell = { ...cell, id: generateId() };
        
        set((state) => ({
          notebooks: state.notebooks.map(nb =>
            nb.id === notebookId
              ? { ...nb, cells: [...nb.cells, newCell], updatedAt: new Date() }
              : nb
          ),
        }));
      },

      deleteCell: (notebookId: string, cellId: string) => {
        set((state) => ({
          notebooks: state.notebooks.map(nb =>
            nb.id === notebookId
              ? { 
                  ...nb, 
                  cells: nb.cells.filter(cell => cell.id !== cellId),
                  updatedAt: new Date()
                }
              : nb
          ),
        }));
      },

      updateCell: (notebookId: string, cellId: string, updates: Partial<Cell>) => {
        set((state) => ({
          notebooks: state.notebooks.map(nb =>
            nb.id === notebookId
              ? {
                  ...nb,
                  cells: nb.cells.map(cell =>
                    cell.id === cellId ? { ...cell, ...updates } : cell
                  ),
                  updatedAt: new Date(),
                }
              : nb
          ),
        }));
      },

      reorderCells: (notebookId: string, fromIndex: number, toIndex: number) => {
        set((state) => ({
          notebooks: state.notebooks.map(nb =>
            nb.id === notebookId
              ? {
                  ...nb,
                  cells: (() => {
                    const cells = [...nb.cells];
                    const [removed] = cells.splice(fromIndex, 1);
                    cells.splice(toIndex, 0, removed);
                    return cells;
                  })(),
                  updatedAt: new Date(),
                }
              : nb
          ),
        }));
      },

      setActiveCell: (cellId: string) => {
        set({ activeCellId: cellId });
      },

      // WebSocket management
      setWebSocketConnection: (notebookId: string, ws: WebSocket) => {
        set((state) => {
          const newConnections = new Map(state.webSocketConnections);
          newConnections.set(notebookId, ws);
          return { webSocketConnections: newConnections };
        });
      },

      removeWebSocketConnection: (notebookId: string) => {
        set((state) => {
          const newConnections = new Map(state.webSocketConnections);
          newConnections.delete(notebookId);
          return { webSocketConnections: newConnections };
        });
      },

      updateCellOutput: (notebookId: string, cellId: string, output: WebSocketMessage) => {
        set((state) => ({
          notebooks: state.notebooks.map(nb =>
            nb.id === notebookId
              ? {
                  ...nb,
                  cells: nb.cells.map(cell =>
                    cell.id === cellId
                      ? {
                          ...cell,
                          output: [
                            {
                              id: generateId(),
                              type: output.type,
                              content: output.content,
                              timestamp: output.timestamp,
                            },
                          ],
                        }
                      : cell
                  ),
                }
              : nb
          ),
        }));
      },

      // UI state
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      // Getters
      getActiveNotebook: () => {
        const state = get();
        return state.notebooks.find(nb => nb.id === state.activeNotebookId) || null;
      },

      getActiveCell: () => {
        const state = get();
        const activeNotebook = state.getActiveNotebook();
        if (!activeNotebook || !state.activeCellId) return null;
        return activeNotebook.cells.find(cell => cell.id === state.activeCellId) || null;
      },

      getNotebookById: (id: string) => {
        const state = get();
        return state.notebooks.find(nb => nb.id === id) || null;
      },

      getCellById: (notebookId: string, cellId: string) => {
        const state = get();
        const notebook = state.getNotebookById(notebookId);
        return notebook?.cells.find(cell => cell.id === cellId) || null;
      },
    }),
    {
      name: 'notebook-store',
    }
  )
); 