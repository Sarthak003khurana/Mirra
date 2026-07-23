import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import InterviewSessionPage from './pages/InterviewSessionPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/interview/:sessionId" element={<InterviewSessionPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
