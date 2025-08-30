import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Profile from './pages/Profile.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
  </BrowserRouter>,
)
