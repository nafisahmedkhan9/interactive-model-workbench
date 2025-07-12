# Interactive Model Analysis Workbench

A modern, high-performance React-based notebook environment for data scientists to analyze models, run experiments, and document their findings. Built with TypeScript, Zustand, and modern React patterns.

## Features

- 📓 **Notebook Management**: Create, delete, and manage multiple notebooks
- 🧩 **Cell System**: Add, edit, and execute code cells with real-time output
- 🔄 **Drag & Drop**: Reorder cells within notebooks using intuitive drag-and-drop with dedicated drag handles
- ⚡ **Performance**: Optimized rendering for handling multiple cells efficiently
- 🔌 **Jupyter Integration**: Ready for Jupyter backend integration (currently using mock API)
- 📡 **Real-time Updates**: Simulated real-time output streaming (WebSocket ready)
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🔧 **TypeScript**: Full type safety and excellent developer experience

## Tech Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Zustand for client-side state
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit with dedicated drag handles
- **Backend**: Mock API service (ready for Jupyter backend integration)

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

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
│   ├── Cell.tsx        # Individual cell with editing and execution
│   └── SortableCell.tsx # Drag-and-drop wrapper for cells
├── store/              # Zustand state management
│   └── notebookStore.ts
├── services/           # API and external services
│   └── api.ts         # Mock API service (ready for Jupyter integration)
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Root component with QueryClient setup
└── index.tsx           # Application entry point
```

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

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

- **Efficient Rendering**: Optimized component structure with proper state management
- **Drag & Drop**: Implements smooth drag-and-drop with @dnd-kit and dedicated drag handles
- **Event Handling**: Sophisticated event handling to prevent conflicts between drag operations and interactive elements
- **Focus Management**: Proper focus handling for editing and interaction

### Component Architecture

```
Workbench
├── NotebookSidebar (Notebook management)
└── NotebookArea
    └── Cell List (Currently non-virtualized for drag-and-drop compatibility)
        └── SortableCell
            └── Cell (Individual code cell with drag handle)
```

## Features in Detail

### Notebook Management

- Create new notebooks with custom names
- Delete notebooks with confirmation
- Switch between notebooks seamlessly
- View notebook metadata (cell count, last updated, kernel status)

### Cell System

- **Code Cells**: Execute code with simulated real-time output
- **Cell Status**: Visual indicators for idle, running, completed, and error states
- **Execution Count**: Track how many times each cell has been executed
- **Output History**: Maintain history of all cell outputs
- **Editing**: Inline editing with proper focus management and keyboard shortcuts

### Interactive Features

- **Drag & Drop**: Reorder cells using dedicated drag handles to prevent interference with buttons and textarea
- **Keyboard Shortcuts**: Ctrl+Enter to run cells
- **Click to Edit**: Single click to enter edit mode, double-click for immediate editing
- **Run/Edit Buttons**: Functional buttons with proper event handling

### Real-time Execution (Simulated)

- **Live Output**: Simulated real-time execution output
- **Error Handling**: Graceful handling of execution errors
- **Status Updates**: Real-time cell status updates
- **WebSocket Ready**: Architecture prepared for real WebSocket integration

## Technical Implementation Highlights

### Event Handling Architecture

The application implements sophisticated event handling to resolve conflicts between:
- Drag-and-drop operations
- Button clicks (Run/Edit)
- Textarea input and focus
- Cell editing interactions

### Drag Handle Implementation

- **Dedicated Drag Handle**: Small icon in cell header for drag operations
- **Event Isolation**: Prevents drag listeners from interfering with interactive elements
- **Visual Feedback**: Clear drag indicators and smooth animations

### State Synchronization

- **Local State**: Each cell maintains local editing state
- **Global State**: Zustand store manages notebook and cell data
- **Real-time Updates**: Simulated WebSocket integration for output streaming

## Future Enhancements

### Planned Features

1. **Jupyter Backend Integration**: Replace mock API with real Jupyter backend
2. **Virtualization**: Re-enable virtualized rendering with drag-and-drop compatibility
3. **Real-time Collaboration**: Multi-user editing capabilities
4. **Advanced Visualization**: Rich output rendering for charts and graphs
5. **Export Options**: PDF, HTML, and other export formats

### Backend Integration

The application is designed to integrate with Jupyter backends. The mock API service can be replaced with real Jupyter API calls:

```typescript
// Example Jupyter API integration
const apiService = {
  async executeCell(request: ExecuteCellRequest) {
    // Replace with actual Jupyter API call
    return await jupyterAPI.execute(request);
  },
  // ... other methods
};
```

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

1. **Drag and Drop Not Working**
   - Ensure you're using the drag handle (small icon) in the cell header
   - Check that no interactive elements are blocking the drag area

2. **Cell Editing Issues**
   - Click the "Edit" button or double-click the cell content
   - Use Ctrl+Enter to run cells while editing

3. **Performance Issues**
   - The current implementation is optimized for moderate numbers of cells
   - Virtualization can be re-enabled for large notebooks

### Debug Mode

Enable debug mode by setting the environment variable:

```env
REACT_APP_DEBUG=true
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Jupyter](https://jupyter.org/) for the backend integration design
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [dnd-kit](https://dndkit.com/) for drag and drop functionality
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the [documentation](DESIGN.md) for architectural details
- Review the [troubleshooting guide](#troubleshooting)

---

Built with ❤️ for the data science community 