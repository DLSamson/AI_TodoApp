import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RootStoreContextProvider } from '@/stores/RootStore.tsx'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootStoreContextProvider>
      <App />
    </RootStoreContextProvider>
  </StrictMode>,
)
