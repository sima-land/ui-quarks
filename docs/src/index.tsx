import { createRoot } from 'react-dom/client';
import { App } from './components/app';
import './index.css';

const element = document.createElement('div');
element.id = 'root';

document.body.append(element);
createRoot(element).render(<App />);
