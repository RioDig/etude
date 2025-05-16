import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/app/styles/index.scss'
import { AppWithProviders } from '@/app/AppWithProviders.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
)
