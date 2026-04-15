import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-medium tracking-tight text-zinc-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-black text-white rounded-none px-6 h-10 font-medium text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
            data-testid="logout-button"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white border border-zinc-200 rounded-none p-8" data-testid="dashboard-content">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-black rounded-none flex items-center justify-center text-white">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight text-zinc-900 mb-1">
                Welcome, {user?.name}!
              </h2>
              <p className="text-base text-zinc-600">
                You're successfully logged in to your account
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tracking-wide text-zinc-500 uppercase w-24">Email</span>
              <span className="text-base text-zinc-900" data-testid="user-email">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tracking-wide text-zinc-500 uppercase w-24">Role</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-900 text-sm font-medium" data-testid="user-role">
                <Shield size={14} />
                {user?.role}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tracking-wide text-zinc-500 uppercase w-24">User ID</span>
              <span className="text-sm text-zinc-600 font-mono" data-testid="user-id">{user?.id}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-zinc-900 text-white rounded-none">
          <h3 className="text-xl font-medium tracking-tight mb-2">What's next?</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            This is your authenticated dashboard. You can now build additional features, connect APIs, or customize the UI to match your needs.
          </p>
        </div>
      </main>
    </div>
  );
}