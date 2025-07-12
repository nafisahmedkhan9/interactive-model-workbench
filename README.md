# Interactive Model Analysis Workbench

A modern, high-performance React-based notebook environment for data scientists to analyze models, run experiments, and document their findings. Built with TypeScript, Zustand, and TanStack Query.

## Features

- 📓 **Notebook Management**: Create, delete, and manage multiple notebooks
- 🧩 **Cell System**: Add, edit, and execute code cells with real-time output
- 🔄 **Drag & Drop**: Reorder cells within notebooks using intuitive drag-and-drop
- ⚡ **Performance**: Virtualized rendering for handling hundreds of cells efficiently
- 🔌 **Jupyter Integration**: Connect to Jupyter backend for code execution
- 📡 **Real-time Updates**: WebSocket-based real-time output streaming
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🔧 **TypeScript**: Full type safety and excellent developer experience

## Tech Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Virtualization**: @tanstack/react-virtual
- **Backend**: Jupyter backend integration

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Jupyter backend server (optional for development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interactive-model-workbench
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Workbench.tsx   # Main application component
│   ├── NotebookSidebar.tsx
│   ├── NotebookArea.tsx
│   ├── Cell.tsx
│   └── SortableCell.tsx
├── store/              # Zustand state management
│   └── notebookStore.ts
├── services/           # API and external services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Root component
└── index.tsx           # Application entry point
```

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_JUPYTER_API_URL=http://localhost:8888/api
```

## Jupyter Backend Integration

### Setting up Jupyter Backend

1. **Using Docker** (Recommended):
```bash
docker run -p 8888:8888 jupyter/notebook
```

2. **Local Installation**:
```bash
pip install jupyter
jupyter notebook --port=8888 --no-browser
```

### API Endpoints

The application expects the following Jupyter API endpoints:

- `GET /api/notebooks` - List notebooks
- `POST /api/notebooks` - Create notebook
- `GET /api/notebooks/{id}` - Get notebook
- `DELETE /api/notebooks/{id}` - Delete notebook
- `POST /api/kernels` - Start kernel
- `POST /api/kernels/{id}/execute` - Execute cell
- `WS /api/kernels/{id}/channels` - WebSocket for real-time output

### WebSocket Integration

The application establishes WebSocket connections to receive real-time execution output:

```typescript
// Example WebSocket message format
{
  type: 'stream' | 'display_data' | 'execute_result' | 'error',
  content: string | object,
  cellId: string,
  timestamp: number
}
```

## Architecture

### State Management

The application uses Zustand for state management with the following structure:

```typescript
interface NotebookState {
  notebooks: Notebook[];
  activeNotebookId: string | null;
  activeCellId: string | null;
  webSocketConnections: Map<string, WebSocket>;
  isLoading: boolean;
  error: string | null;
}
```

### Performance Optimization

- **Virtualization**: Uses `@tanstack/react-virtual` for efficient rendering of large cell lists
- **Drag & Drop**: Implements smooth drag-and-drop with `@dnd-kit`
- **Memoization**: Components are optimized with React.memo where appropriate
- **Lazy Loading**: Code splitting for better initial load times

### Component Architecture

```
Workbench
├── NotebookSidebar (Notebook management)
└── NotebookArea
    ├── NotebookHeader (Notebook info and actions)
    └── VirtualizedCellList
        └── SortableCell
            └── Cell (Individual code cell)
```

## Features in Detail

### Notebook Management

- Create new notebooks with custom names
- Delete notebooks with confirmation
- Switch between notebooks seamlessly
- View notebook metadata (cell count, last updated, kernel status)

### Cell System

- **Code Cells**: Execute Python code with real-time output
- **Markdown Cells**: Rich text documentation (planned)
- **Cell Status**: Visual indicators for idle, running, completed, and error states
- **Execution Count**: Track how many times each cell has been executed
- **Output History**: Maintain history of all cell outputs

### Real-time Execution

- **Live Output**: Stream execution results in real-time
- **Error Handling**: Graceful handling of execution errors
- **Status Updates**: Real-time kernel and cell status updates
- **WebSocket Management**: Automatic connection management per notebook

### Drag & Drop

- **Intuitive Interface**: Drag cells to reorder them
- **Visual Feedback**: Clear visual indicators during drag operations
- **Smooth Animations**: CSS transforms for fluid movement
- **Accessibility**: Keyboard navigation support

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### E2E Testing

```bash
npm run test:e2e
```

## Deployment

### Production Build

```bash
npm run build
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Ensure Jupyter backend is running
   - Check firewall settings
   - Verify WebSocket endpoint configuration

2. **Performance Issues with Large Notebooks**
   - Ensure virtualization is working correctly
   - Check browser memory usage
   - Consider reducing cell output history

3. **TypeScript Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify type definitions are up to date

### Debug Mode

Enable debug mode by setting the environment variable:

```env
REACT_APP_DEBUG=true
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Jupyter](https://jupyter.org/) for the backend integration
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [TanStack](https://tanstack.com/) for React Query and Virtual
- [dnd-kit](https://dndkit.com/) for drag and drop functionality
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the [documentation](DESIGN.md) for architectural details
- Review the [troubleshooting guide](#troubleshooting)

---

Built with ❤️ for the data science community 