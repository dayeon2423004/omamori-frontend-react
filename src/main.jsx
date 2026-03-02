import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from './context/AuthContext.jsx';
import { FortuneProvider } from './context/FortuneContext.jsx';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <AuthProvider>
          <FortuneProvider>
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </FortuneProvider>
        </AuthProvider>
      </ModalProvider>
    </BrowserRouter>
  </StrictMode>,
)
