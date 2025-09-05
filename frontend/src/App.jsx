import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import SalarySlips from './pages/SalarySlips';
import ManageSlips from './pages/Admin/ManageSlips';
import ReviewExpenses from './pages/Admin/ReviewExpenses';
export default function App(){
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/salary" element={<ProtectedRoute><SalarySlips /></ProtectedRoute>} />
        <Route path="/admin/slips" element={<ProtectedRoute role="admin"><ManageSlips /></ProtectedRoute>} />
        <Route path="/admin/expenses" element={<ProtectedRoute role="admin"><ReviewExpenses /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
