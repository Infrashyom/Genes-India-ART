import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrandProvider } from './context/BrandContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrandProvider>
        <App />
      </BrandProvider>
    </AuthProvider>
  </StrictMode>,
);
