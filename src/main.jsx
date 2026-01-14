import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <CartProvider>
        {/* <StrictMode> */}
          <App />
        {/* </StrictMode> */}
      </CartProvider>
    </AppContextProvider>
  </BrowserRouter>
)
