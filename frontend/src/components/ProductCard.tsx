import React, { useState } from 'react';
import { Product } from '../types';
import { useTrans } from '@hooks/useTrans';

const BG_MAP: Record<string, string> = {
  'Облека': '#fce4ec',
  'Обувки': '#e3f2fd',
  'Аксесоари': '#f3e5f5',
  'Електроника': '#e8f5e9',
  'Спорт': '#fff8e1',
  'Дом': '#fbe9e7',
};

const EMOJI_MAP: Record<string, string> = {
  'Облека': '👕',
  'Обувки': '👟',
  'Аксесоари': '👜',
  'Електроника': '📱',
  'Спорт': '⚽',
  'Дом': '🏠',
};

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const t = useTrans();

  const imageUrl = product.images?.[0]?.imageUrl;
  const bgColor = BG_MAP[product.category] ?? '#f5f5f5';
  const emoji = EMOJI_MAP[product.category] ?? '📦';

  return (
    <article className="bg-white border-b border-[#efefef]">

      {/* ── Post Header ── */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0">
            <div className="w-full h-full rounded-full border-[1.5px] border-white overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">
                  {product.seller?.username?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#262626] leading-tight">
              {product.seller?.username ?? 'Unknown'}
            </p>
            <p className="text-[11px] text-[#8e8e8e] leading-tight">{product.category}</p>
          </div>
        </div>
        <button className="p-1">
          <svg className="w-5 h-5" fill="#262626" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* ── Post Image ── */}
      <div
        className="relative w-full cursor-pointer"
        style={{ aspectRatio: '1/1', backgroundColor: bgColor }}
        onClick={onClick}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ fontSize: 88, userSelect: 'none', opacity: 0.55 }}>{emoji}</span>
          </div>
        )}

        {/* Sold overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="text-white text-sm font-semibold tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full">
              {t.product.sold}
            </span>
          </div>
        )}

        {/* Boosted badge */}
        {product.isBoosted && (
          <div className="absolute top-3 left-3 z-20 bg-white/90 text-[#b45309] text-[11px] font-bold px-2.5 py-1 rounded-full">
            ⭐ {t.product.boosted}
          </div>
        )}

        {/* Size badge */}
        {product.size && (
          <div className="absolute top-3 right-3 z-20 bg-white/90 text-[#262626] text-[11px] font-bold px-2.5 py-1 rounded-full">
            {product.size}
          </div>
        )}
      </div>

      {/* ── Post Actions ── */}
      <div className="px-3 pt-2.5 pb-1">
        <div className="flex items-center justify-between mb-2">

          {/* Left: like, comment, share */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(v => !v)}
              className="active:scale-90 transition-transform"
            >
              <svg
                className={`w-6 h-6 transition-colors ${liked ? 'fill-[#ed4956] text-[#ed4956]' : 'fill-none text-[#262626]'}`}
                stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <button onClick={onClick}>
              <svg className="w-6 h-6 text-[#262626]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            <button>
              <svg className="w-6 h-6 text-[#262626]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          {/* Right: price + save */}
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold text-[#262626]">
              {product.price?.toFixed(2)}€
            </span>
            <button onClick={() => setSaved(v => !v)}>
              <svg
                className={`w-6 h-6 transition-colors ${saved ? 'fill-[#262626] text-[#262626]' : 'fill-none text-[#262626]'}`}
                stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Caption */}
        <p className="text-[13px] text-[#262626] mb-0.5">
          <span className="font-semibold mr-1">{product.seller?.username}</span>
          {product.description}
        </p>
        <p className="text-[12px] text-[#8e8e8e] mb-2">
          {product.condition} · {product.category}
        </p>

        {/* CTA */}
        <button
          onClick={onClick}
          className="w-full py-[9px] bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold rounded-lg transition-colors mb-3"
        >
          {t.home.viewListing}
        </button>
      </div>
    </article>
  );
};