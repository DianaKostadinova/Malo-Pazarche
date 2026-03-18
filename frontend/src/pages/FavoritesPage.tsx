import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ProductCard } from '@components/ProductCard';
import { useTrans } from '@hooks/useTrans';

const MOCK_FAVORITES: Product[] = [
  {
    id: '1', sellerId: 'seller-1',
    title: 'Класичен Џин Капут',
    description: 'Класичен син џин капут во одлична состојба.',
    category: 'Облека', size: 'M', condition: 'Kako ново', price: 45.99,
    isAvailable: true, isBoosted: true, createdAt: new Date().toISOString(),
    seller: { id: 'seller-1', username: 'модна_фана', email: 'f@e.com', fullName: 'Јована Петровска', createdAt: new Date().toISOString() },
  },
  {
    id: '5', sellerId: 'seller-2',
    title: 'Класични Очила',
    description: 'Очила со темни леќи, уникатен стил.',
    category: 'Аксесоари', condition: 'Kako ново', price: 28.50,
    isAvailable: true, isBoosted: false, createdAt: new Date().toISOString(),
    seller: { id: 'seller-2', username: 'винтаж_љубител', email: 'v@e.com', fullName: 'Виктория Чен', createdAt: new Date().toISOString() },
  },
];

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTrans();
  const [favorites] = useState<Product[]>(MOCK_FAVORITES);

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center">
          <span className="text-[17px] font-semibold text-[#262626]">Омилени</span>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pb-24">
        {favorites.length > 0 ? (
          <div className="divide-y divide-[#efefef]">
            {favorites.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center px-8">
            <div className="w-20 h-20 bg-[#efefef] rounded-full flex items-center justify-center mb-4">
              <svg className="w-9 h-9 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-[#262626] mb-1">Нема омилени</p>
            <p className="text-sm text-[#8e8e8e]">Зачувај огласи за да ги најдеш овде</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-[#0095f6] text-white text-sm font-semibold rounded-lg"
            >
              Разгледај огласи
            </button>
          </div>
        )}
      </div>

      <BottomNav active="favorites" />
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