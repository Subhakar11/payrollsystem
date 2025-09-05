import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-blue-700">Payroll</Link>
        <div className="flex items-center gap-4 text-sm">
          {user && (
            <>
              <Link to="/" className="hover:underline">Dashboard</Link>

              {/* Employee-only links */}
              {user.role === 'employee' && (
                <>
                  <Link to="/salary" className="hover:underline">Salary Slips</Link>
                  <Link to="/expenses" className="hover:underline">Expenses</Link>
                </>
              )}

              {/* Admin-only links */}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/slips" className="hover:underline">Manage Slips</Link>
                  <Link to="/admin/expenses" className="hover:underline">Review Expenses</Link>
                </>
              )}

              <span className="text-slate-500">
                Hi, {user.role === 'admin' ? 'Administrator' : user.name?.split(' ')[0] || 'User'}
              </span>
              <button
                className="btn btn-outline"
                onClick={() => { logout(); nav('/login'); }}
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/signup" className="btn btn-outline">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
