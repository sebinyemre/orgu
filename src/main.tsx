import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-ext-400.css';
import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-ext-600.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-ext-700.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/nunito/latin-ext-800.css';
import '@fontsource/fraunces/latin-500.css';
import '@fontsource/fraunces/latin-ext-500.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-ext-600.css';
import '@fontsource/fraunces/latin-700.css';
import '@fontsource/fraunces/latin-ext-700.css';
import '@fontsource/caveat/latin-500.css';
import '@fontsource/caveat/latin-ext-500.css';
import '@fontsource/caveat/latin-700.css';
import '@fontsource/caveat/latin-ext-700.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
