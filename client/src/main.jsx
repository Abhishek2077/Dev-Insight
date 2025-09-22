import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'; // Import the router here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>   {/* The Router must be on the outside */}
      <AuthProvider>  {/* The Auth system goes on the inside */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)