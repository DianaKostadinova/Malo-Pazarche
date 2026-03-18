import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTrans } from '@hooks/useTrans';

const BG_MAP: Record<string, string> = {
  'Облека': '#fce4ec', 'Обувки': '#e3f2fd', 'Аксесоари': '#f3e5f5',
  'Електроника': '#e8f5e9', 'Спорт': '#fff8e1', 'Дом': '#fbe9e7',
};
const EMOJI_MAP: Record<string, string> = {
  'Облека': '👕', 'Обувки': '👟', 'Аксесоари': '👜',
  'Електроника': '📱', 'Спорт': '⚽', 'Дом': '🏠',
};

// Mock — replace with real API call
const MOCK: Record<string, { title: string; description: string; category: string; size?: string; condition: string; price: number; isAvailable: boolean; username: string }> = {
  '1': { title: 'Класичен Џин Капут', description: 'Класичен син џин капут во одлична состојба. Совршен за пролет. Без дефекти, перен само рачно.', category: 'Облека', size: 'M', condition: 'Kako ново', price: 45.99, isAvailable: true, username: 'модна_фана' },
  '2': { title: 'Кожна Торба', description: 'Прекрасна кожна торба, совршена за секојден.', category: 'Аксесоари', condition: 'Одлично', price: 65.00, isAvailable: true, username: 'винтаж_љубител' },
  '4': { title: 'Спортски Патики', description: 'Бели машки патики, нова состојба.', category: 'Обувки', condition: 'Ново', price: 55.00, isAvailable: true, username: 'куче_тренер' },
};

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useTrans();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const product = id ? MOCK[id] : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center gap-3">
        <p className="text-[#262626] font-semibold">Огласот не е пронајден</p>
        <button onClick={() => navigate('/')} className="text-[#0095f6] text-sm font-semibold">← Назад</button>
      </div>
    );
  }

  const bgColor = BG_MAP[product.category] ?? '#f5f5f5';
  const emoji = EMOJI_MAP[product.category] ?? '📦';

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-[#262626]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-[17px] font-semibold text-[#262626] truncate max-w-[220px]">{product.title}</span>
          <button>
            <svg className="w-6 h-6" fill="#262626" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pb-32">

        {/* Image */}
        <div
          className="relative w-full"
          style={{ aspectRatio: '1/1', backgroundColor: bgColor }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ fontSize: 120, userSelect: 'none', opacity: 0.55 }}>{emoji}</span>
          </div>
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-sm font-semibold tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full">
                {t.product.sold}
              </span>
            </div>
          )}
        </div>

        {/* Actions row */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-[#efefef]">
          <div className="flex items-center gap-4">
            <button onClick={() => setLiked(v => !v)} className="active:scale-90 transition-transform">
              <svg
                className={`w-7 h-7 transition-colors ${liked ? 'fill-[#ed4956] text-[#ed4956]' : 'fill-none text-[#262626]'}`}
                stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button onClick={() => navigate('/chat')}>
              <svg className="w-7 h-7 text-[#262626]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
          <button onClick={() => setSaved(v => !v)}>
            <svg
              className={`w-7 h-7 transition-colors ${saved ? 'fill-[#262626] text-[#262626]' : 'fill-none text-[#262626]'}`}
              stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="bg-white px-4 py-4 border-b border-[#efefef]">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[18px] font-bold text-[#262626]">{product.title}</p>
              <p className="text-sm text-[#8e8e8e]">{product.condition} · {product.category}{product.size ? ` · ${product.size}` : ''}</p>
            </div>
            <span className="text-[22px] font-bold text-[#262626]">{product.price.toFixed(2)}€</span>
          </div>
          <p className="text-sm text-[#262626] leading-relaxed">{product.description}</p>
        </div>

        {/* Seller */}
        <div
          className="bg-white px-4 py-3 border-b border-[#efefef] flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0">
            <div className="w-full h-full rounded-full border-[1.5px] border-white overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{product.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#262626]">{product.username}</p>
            <p className="text-xs text-[#8e8e8e]">Скопје · 4.9★ · 12 продадени</p>
          </div>
          <svg className="w-5 h-5 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Delivery info */}
        <div className="bg-white px-4 py-3 border-b border-[#efefef]">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
            <p className="text-sm font-semibold text-[#262626]">Достава</p>
          </div>
          <p className="text-xs text-[#8e8e8e]">Итар Пост / Ауто Пакет · Плаќа купувачот</p>
        </div>
      </div>

      {/* CTA */}
      {product.isAvailable && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#dbdbdb] px-4 py-3">
          <div className="max-w-[480px] mx-auto flex gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="flex-1 py-3 border border-[#dbdbdb] rounded-xl text-sm font-semibold text-[#262626]"
            >
              💬 Напиши порака
            </button>
            <button className="flex-1 py-3 bg-[#0095f6] rounded-xl text-sm font-semibold text-white">
              Купи сега
            </button>
          </div>
        </div>
      )}
    </div>
  );
};