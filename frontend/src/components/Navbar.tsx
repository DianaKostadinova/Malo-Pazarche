import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useTrans } from '@hooks/useTrans';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const t = useTrans();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-[#dbdbdb] sticky top-0 z-50">
      <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center justify-between">

        {/* Logo */}
        <span
          onClick={() => navigate('/')}
          className="text-[22px] font-bold text-[#262626] cursor-pointer select-none"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}
        >
          МалоПазарче
        </span>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              {/* Sell / Add */}
              <button
                onClick={() => navigate('/sell')}
                className="text-[#262626] hover:text-[#8e8e8e] transition-colors"
                title={t.navbar.sell}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
                </svg>
              </button>

              {/* Messages */}
              <button
                onClick={() => navigate('/messages')}
                className={`transition-colors ${isActive('/messages') ? 'text-[#262626]' : 'text-[#262626] hover:text-[#8e8e8e]'}`}
                title={t.navbar.messages}
              >
                <svg className="w-6 h-6" fill={isActive('/messages') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* Profile avatar */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center"
                title={user?.username}
              >
                <div className={`w-[26px] h-[26px] rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${isActive('/profile') ? 'ring-2 ring-[#262626] ring-offset-1' : ''}`}>
                  <span className="text-white text-[11px] font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-[#0095f6] hover:text-[#1877f2] transition-colors"
              >
                {t.navbar.login}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-semibold text-[#262626] hover:text-[#8e8e8e] transition-colors"
              >
                {t.navbar.signup}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};