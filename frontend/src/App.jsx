import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login';
import DashboardFirmante from './pages/DashboardFirmante';
import DashboardSolicitante from './pages/DashboardSolicitante';
import NotFound from './pages/NotFound';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/firmante" element={<PrivateRoute><DashboardFirmante /></PrivateRoute>} />
            <Route path="/solicitante" element={<PrivateRoute><DashboardSolicitante /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
