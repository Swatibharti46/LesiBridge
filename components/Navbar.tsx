import React from 'react';
import { UserRole, User } from '../types';
import { Scale, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onSwitchRole }) => {
  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-xl tracking-tight">LexBridge</span>
            <span className="hidden md:block ml-4 text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
              Startup Law MVP
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium">
                    {user.role === UserRole.LAWYER ? 'Attorney View' : 'Client View'}
                  </span>
                </div>
                
                {user.role === UserRole.LAWYER && (
                   <div className="hidden sm:flex items-center gap-1 text-emerald-400 text-xs font-semibold px-2 py-1 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                     <ShieldCheck className="w-3 h-3" /> VERIFIED
                   </div>
                )}

                <button
                  onClick={onSwitchRole}
                  className="text-xs text-slate-400 hover:text-white underline decoration-dotted underline-offset-4"
                >
                  Switch View (Demo)
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-slate-800 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};