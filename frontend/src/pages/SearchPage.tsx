import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrans } from '@hooks/useTrans';

const RECENT_SEARCHES = ['Џинс', 'Nike патики', 'Кожена торба', 'Зимска јакна'];

const TRENDING = [
  { label: 'Облека',      emoji: '👕', color: '#fce4ec' },
  { label: 'Обувки',      emoji: '👟', color: '#e3f2fd' },
  { label: 'Аксесоари',   emoji: '👜', color: '#f3e5f5' },
  { label: 'Електроника', emoji: '📱', color: '#e8f5e9' },
  { label: 'Спорт',       emoji: '⚽', color: '#fff8e1' },
  { label: 'Дом',         emoji: '🏠', color: '#fbe9e7' },
];

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTrans();
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-[#262626]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 flex items-center gap-2 bg-[#efefef] rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-[#8e8e8e] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder={t.home.search}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#262626] placeholder-[#8e8e8e] outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <svg className="w-4 h-4 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 py-4">

        {/* Recent searches */}
        {!query && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[#262626]">Последни пребарувања</p>
              <button className="text-xs text-[#0095f6] font-semibold">Избриши</button>
            </div>
            <div className="flex flex-col gap-0 mb-6">
              {RECENT_SEARCHES.map(s => (
                <div key={s} className="flex items-center justify-between py-2.5 border-b border-[#efefef]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#efefef] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#262626]">{s}</span>
                  </div>
                  <button>
                    <svg className="w-4 h-4 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Trending categories */}
            <p className="text-sm font-semibold text-[#262626] mb-3">Категории</p>
            <div className="grid grid-cols-2 gap-3">
              {TRENDING.map(cat => (
                <button
                  key={cat.label}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#efefef] bg-white active:scale-95 transition-transform"
                  style={{ backgroundColor: cat.color }}
                  onClick={() => setQuery(cat.label)}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-sm font-semibold text-[#262626]">{cat.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Search results placeholder */}
        {query && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-[#efefef] rounded-full flex items-center justify-center mb-4">
              <svg className="w-9 h-9 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-[#262626] mb-1">{t.home.noResults}</p>
            <p className="text-sm text-[#8e8e8e]">{t.home.noResultsSub}</p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav active="search" />
    </div>
  );
};

// Shared bottom nav
const BottomNav: React.FC<{ active: string }> = ({ active }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#dbdbdb]">
      <div className="max-w-[480px] mx-auto h-[54px] flex items-center justify-around">
        <button onClick={() => navigate('/')} className="p-3">
          <svg className="w-6 h-6" fill={active === 'home' ? '#262626' : 'none'} stroke="#262626" strokeWidth={active === 'home' ? 0 : 1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
          </svg>
        </button>
        <button onClick={() => navigate('/search')} className="p-3">
          <svg className="w-6 h-6" fill="none" stroke="#262626" strokeWidth={active === 'search' ? 2.5 : 1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button onClick={() => navigate('/sell')} className="p-3">
          <svg className="w-6 h-6" fill="none" stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="4" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
          </svg>
        </button>
        <button onClick={() => navigate('/favorites')} className="p-3">
          <svg className="w-6 h-6" fill={active === 'favorites' ? '#262626' : 'none'} stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button onClick={() => navigate('/profile')} className="p-3">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${active === 'profile' ? 'ring-2 ring-[#262626] ring-offset-1' : ''}`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  );
};