import React from 'react';
import { UserRole, User } from '../types';
import { Scale, LogOut, User as UserIcon, ShieldCheck, LayoutGrid, Users, Activity } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onSwitchRole: () => void;
  onNavigate?: (view: 'DASHBOARD' | 'DIRECTORY' | 'BOOKING' | 'MARKETPLACE') => void;
  currentView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onSwitchRole, onNavigate, currentView }) => {
  return (
    <nav className="bg-slate-900 text-white shadow-2xl sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate?.('DASHBOARD')}>
              <div className="p-2 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter uppercase">NyayaAI</span>
                <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none">Enterprise Legal Hub</span>
              </div>
            </div>

            {/* Main Navigation for Clients */}
            {user?.role === UserRole.CLIENT && onNavigate && (
              <div className="hidden lg:flex items-center space-x-1">
                <button
                  onClick={() => onNavigate('DASHBOARD')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    currentView === 'DASHBOARD' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2"><LayoutGrid className="w-3.5 h-3.5" /> Dashboard</div>
                </button>
                <button
                  onClick={() => onNavigate('DIRECTORY')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    currentView === 'DIRECTORY' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Attorneys</div>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                  <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {user.role === UserRole.LAWYER ? 'Lawyer Node' : 'Client Node'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-xs font-bold text-white">{user.name}</span>
                    <button
                      onClick={onSwitchRole}
                      className="text-[9px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
                    >
                      Cycle Identity
                    </button>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};