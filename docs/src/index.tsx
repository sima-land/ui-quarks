import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  throw new Error('Root element not found');
}
