import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useAuth } from '@hooks/useAuth';
import { useTrans } from '@hooks/useTrans';
import { ProductCard } from '@components/ProductCard';

const STORIES = [
  { id: '1', username: 'модна_фана',      color: 'from-yellow-400 to-pink-500',   letter: 'Ј' },
  { id: '2', username: 'винтаж',           color: 'from-purple-400 to-blue-500',   letter: 'В' },
  { id: '3', username: 'куче_тренер',      color: 'from-green-400 to-teal-500',    letter: 'М' },
  { id: '4', username: 'стил_гуру',        color: 'from-orange-400 to-red-500',    letter: 'С' },
  { id: '5', username: 'nova_kolekcija',   color: 'from-pink-400 to-rose-500',     letter: 'Н' },
  { id: '6', username: 'retro_shop',       color: 'from-blue-400 to-indigo-500',   letter: 'Р' },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1', sellerId: 'seller-1',
    title: 'Класичен Џин Капут',
    description: 'Класичен син џин капут во одлична состојба. Совршен за пролет.',
    category: 'Облека', size: 'M', condition: 'Kako ново', price: 45.99,
    isAvailable: true, isBoosted: true, createdAt: new Date().toISOString(),
    seller: { id: 'seller-1', username: 'модна_фана', email: 'f@e.com', fullName: 'Јована Петровска', createdAt: new Date().toISOString() },
  },
  {
    id: '2', sellerId: 'seller-2',
    title: 'Кожна Торба',
    description: 'Прекрасна кожна торба, совршена за секојден.',
    category: 'Аксесоари', condition: 'Одлично', price: 65.00,
    isAvailable: true, isBoosted: false, createdAt: new Date().toISOString(),
    seller: { id: 'seller-2', username: 'винтаж_љубител', email: 'v@e.com', fullName: 'Виктория Чен', createdAt: new Date().toISOString() },
  },
  {
    id: '3', sellerId: 'seller-1',
    title: 'Волнен Пуловер',
    description: 'Удобен волнен пуловер, совршен за зима.',
    category: 'Облека', size: 'S', condition: 'Добро', price: 35.00,
    isAvailable: false, isBoosted: false, createdAt: new Date().toISOString(),
    seller: { id: 'seller-1', username: 'модна_фана', email: 'f@e.com', fullName: 'Јована Петровска', createdAt: new Date().toISOString() },
  },
  {
    id: '4', sellerId: 'seller-3',
    title: 'Спортски Патики',
    description: 'Бели машки патики, нова состојба.',
    category: 'Обувки', condition: 'Ново', price: 55.00,
    isAvailable: true, isBoosted: true, createdAt: new Date().toISOString(),
    seller: { id: 'seller-3', username: 'куче_тренер', email: 's@e.com', fullName: 'Марко Миленковски', createdAt: new Date().toISOString() },
  },
  {
    id: '5', sellerId: 'seller-2',
    title: 'Класични Очила',
    description: 'Очила со темни леќи, уникатен стил.',
    category: 'Аксесоари', condition: 'Kako ново', price: 28.50,
    isAvailable: true, isBoosted: false, createdAt: new Date().toISOString(),
    seller: { id: 'seller-2', username: 'винтаж_љубител', email: 'v@e.com', fullName: 'Виктория Чен', createdAt: new Date().toISOString() },
  },
  {
    id: '6', sellerId: 'seller-1',
    title: 'Спортски Патики Nike',
    description: 'Удобни спортски патики за секојден.',
    category: 'Обувки', condition: 'Добро', price: 42.00,
    isAvailable: true, isBoosted: true, createdAt: new Date().toISOString(),
    seller: { id: 'seller-1', username: 'модна_фана', email: 'f@e.com', fullName: 'Јована Петровска', createdAt: new Date().toISOString() },
  },
  {
    id: '7', sellerId: 'seller-3',
    title: 'Кожен Ремен',
    description: 'Висок квалитет кожен ремен, класичен дизајн.',
    category: 'Аксесоари', condition: 'Одлично', price: 22.99,
    isAvailable: true, isBoosted: false, createdAt: new Date().toISOString(),
    seller: { id: 'seller-3', username: 'куче_тренер', email: 's@e.com', fullName: 'Марко Миленковски', createdAt: new Date().toISOString() },
  },
  {
    id: '8', sellerId: 'seller-2',
    title: 'Памучна Маичка',
    description: 'Мека и удобна памучна маичка.',
    category: 'Облека', size: 'L', condition: 'Ново', price: 18.00,
    isAvailable: true, isBoosted: false, createdAt: new Date().toISOString(),
    seller: { id: 'seller-2', username: 'винтаж_љубител', email: 'v@e.com', fullName: 'Виктория Чен', createdAt: new Date().toISOString() },
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const t = useTrans();

  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(t.categories.all);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'favorites' | 'profile'>('home');

  const CATEGORIES = [
    t.categories.all,
    t.categories.clothing,
    t.categories.shoes,
    t.categories.accessories,
    t.categories.electronics,
    t.categories.sport,
    t.categories.home,
  ];

  const filtered = products.filter(p => {
    const matchSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      activeCategory === t.categories.all || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center justify-between">
          <span
            className="text-[22px] font-bold text-[#262626] cursor-pointer select-none"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}
            onClick={() => navigate('/')}
          >
            {t.home.title}
          </span>
          <div className="flex items-center gap-5">
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
            <button
              onClick={logout}
              className="text-[#262626] hover:text-[#8e8e8e] transition-colors"
              title={t.navbar.logout}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto">

        {/* ── STORIES ── */}
        <div className="flex gap-3 px-4 py-3 overflow-x-auto border-b border-[#efefef]">
          {/* Add story */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="relative w-[62px] h-[62px]">
              <div className="w-full h-full rounded-full bg-[#fafafa] border border-[#dbdbdb] flex items-center justify-center">
                <svg className="w-7 h-7 text-[#262626]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0095f6] rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <span className="text-[11px] text-[#262626] w-[66px] text-center truncate">
              {t.home.yourStory}
            </span>
          </div>

          {STORIES.map(story => (
            <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
              <div className="w-[62px] h-[62px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-br ${story.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{story.letter}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[#262626] w-[66px] text-center truncate">
                {story.username}
              </span>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div className="px-4 py-2 border-b border-[#efefef]">
          <div className="flex items-center gap-2 bg-[#efefef] rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-[#8e8e8e] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t.home.search}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#262626] placeholder-[#8e8e8e]"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}>
                <svg className="w-4 h-4 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── CATEGORY PILLS ── */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b border-[#efefef]">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-[#262626] text-white'
                  : 'bg-[#efefef] text-[#262626] hover:bg-[#dbdbdb]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── FEED ── */}
        <div className="pb-24">
          {filtered.length > 0 ? (
            <div className="divide-y divide-[#efefef]">
              {filtered.map(product => (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-[#262626] mb-1">{t.home.noResults}</p>
              <p className="text-sm text-[#8e8e8e]">{t.home.noResultsSub}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto h-[54px] flex items-center justify-around">

          <button onClick={() => setActiveTab('home')} className="p-3">
            <svg className="w-6 h-6" fill={activeTab === 'home' ? '#262626' : 'none'} stroke="#262626" strokeWidth={activeTab === 'home' ? 0 : 1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
            </svg>
          </button>

          <button onClick={() => setActiveTab('search')} className="p-3">
            <svg className="w-6 h-6" fill="none" stroke="#262626" strokeWidth={activeTab === 'search' ? 2.5 : 1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button onClick={() => navigate('/sell')} className="p-3">
            <svg className="w-6 h-6" fill="none" stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="4" strokeLinecap="round" strokeLinejoin="round" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
            </svg>
          </button>

          <button onClick={() => setActiveTab('favorites')} className="p-3 relative">
            <svg className="w-6 h-6" fill={activeTab === 'favorites' ? '#262626' : 'none'} stroke="#262626" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <button onClick={() => setActiveTab('profile')} className="p-3">
            <div className={`w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${activeTab === 'profile' ? 'ring-2 ring-[#262626] ring-offset-1' : ''}`}>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          </button>

        </div>
      </nav>
    </div>
  );
};