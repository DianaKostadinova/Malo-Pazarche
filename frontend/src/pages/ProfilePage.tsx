import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Product } from '../types';

const MOCK_LISTINGS: Product[] = [
  {
    id: '1', sellerId: 'me',
    title: 'Класичен Џин Капут',
    description: 'Класичен син џин капут.',
    category: 'Облека', size: 'M', condition: 'Kako ново', price: 45.99,
    isAvailable: true, isBoosted: true, createdAt: new Date().toISOString(),
    seller: { id: 'me', username: 'мој_профил', email: 'me@e.com', createdAt: new Date().toISOString() },
  },
  {
    id: '6', sellerId: 'me',
    title: 'Спортски Патики Nike',
    description: 'Удобни спортски патики.',
    category: 'Обувки', condition: 'Добро', price: 42.00,
    isAvailable: true, isBoosted: false, createdAt: new Date().toISOString(),
    seller: { id: 'me', username: 'мој_профил', email: 'me@e.com', createdAt: new Date().toISOString() },
  },
  {
    id: '7', sellerId: 'me',
    title: 'Кожен Ремен',
    description: 'Висок квалитет кожен ремен.',
    category: 'Аксесоари', condition: 'Одлично', price: 22.99,
    isAvailable: false, isBoosted: false, createdAt: new Date().toISOString(),
    seller: { id: 'me', username: 'мој_профил', email: 'me@e.com', createdAt: new Date().toISOString() },
  },
];

const BG_MAP: Record<string, string> = {
  'Облека': '#fce4ec', 'Обувки': '#e3f2fd', 'Аксесоари': '#f3e5f5',
  'Електроника': '#e8f5e9', 'Спорт': '#fff8e1', 'Дом': '#fbe9e7',
};
const EMOJI_MAP: Record<string, string> = {
  'Облека': '👕', 'Обувки': '👟', 'Аксесоари': '👜',
  'Електроника': '📱', 'Спорт': '⚽', 'Дом': '🏠',
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tab, setTab] = useState<'active' | 'sold'>('active');

  const listings = MOCK_LISTINGS.filter(p =>
    tab === 'active' ? p.isAvailable : !p.isAvailable
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center justify-between">
          <span className="text-[17px] font-semibold text-[#262626]">Профил</span>
          <button
            onClick={logout}
            className="text-[#262626] hover:text-[#8e8e8e] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
          </button>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pb-24">

        {/* Profile info */}
        <div className="px-4 pt-5 pb-4 bg-white border-b border-[#efefef]">
          <div className="flex items-center gap-5 mb-4">
            <div className="w-[86px] h-[86px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0">
              <div className="w-full h-full rounded-full border-[2px] border-white overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 flex justify-around">
              {[
                { label: 'Огласи', value: '12' },
                { label: 'Продадени', value: '8' },
                { label: 'Оценка', value: '4.9★' },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="text-[17px] font-bold text-[#262626]">{s.value}</span>
                  <span className="text-xs text-[#8e8e8e]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm font-semibold text-[#262626] mb-0.5">мој_профил</p>
          <p className="text-sm text-[#8e8e8e] mb-3">Скопје · Член од 2026</p>

          <div className="flex gap-2">
            <button className="flex-1 py-[7px] border border-[#dbdbdb] rounded-lg text-sm font-semibold text-[#262626] bg-white">
              Уреди профил
            </button>
            <button
              onClick={() => navigate('/sell')}
              className="flex-1 py-[7px] bg-[#0095f6] rounded-lg text-sm font-semibold text-white"
            >
              + Нов оглас
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#dbdbdb] bg-white">
          {(['active', 'sold'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors ${
                tab === t ? 'text-[#262626] border-b-2 border-[#262626]' : 'text-[#8e8e8e]'
              }`}
            >
              {t === 'active' ? '▦ Активни' : '✓ Продадени'}
            </button>
          ))}
        </div>

        {/* Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-3 gap-[1px] bg-[#efefef]">
            {listings.map(product => {
              const bgColor = BG_MAP[product.category] ?? '#f5f5f5';
              const emoji = EMOJI_MAP[product.category] ?? '📦';
              return (
                <button
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="relative bg-white aspect-square flex items-center justify-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <span style={{ fontSize: 40, opacity: 0.55 }}>{emoji}</span>
                  <div className="absolute bottom-1 right-1 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold text-[#262626]">
                    {product.price.toFixed(0)}€
                  </div>
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">ПРОДАДЕНО</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <p className="text-base font-semibold text-[#262626] mb-1">Нема огласи</p>
            <p className="text-sm text-[#8e8e8e]">Твоите огласи ќе се прикажат овде</p>
          </div>
        )}
      </div>

      <BottomNav active="profile" />
    </div>
  );
};

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
          <svg className="w-6 h-6" fill="none" stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
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
          <svg className="w-6 h-6" fill="none" stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
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