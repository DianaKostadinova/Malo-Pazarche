import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Облека', 'Обувки', 'Аксесоари', 'Електроника', 'Спорт', 'Дом'];
const CONDITIONS = ['Ново', 'Kako ново', 'Одлично', 'Добро', 'Прифатливо'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const SellPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: '', condition: '', size: '', price: '',
  });
  const [step, setStep] = useState<1 | 2>(1);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const canNext = form.title && form.category && form.condition && form.price;

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#dbdbdb]">
        <div className="max-w-[480px] mx-auto px-4 h-[54px] flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-[#262626]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-[17px] font-semibold text-[#262626]">Нов оглас</span>
          {step === 2 ? (
            <button
              className="text-[#0095f6] text-sm font-semibold disabled:opacity-40"
              disabled={!canNext}
            >
              Објави
            </button>
          ) : (
            <button
              className="text-[#0095f6] text-sm font-semibold disabled:opacity-40"
              disabled={!canNext}
              onClick={() => setStep(2)}
            >
              Следно
            </button>
          )}
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pb-10">

        {step === 1 && (
          <>
            {/* Photo upload area */}
            <div className="bg-white border-b border-[#efefef] p-4">
              <div className="flex gap-3">
                <button className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-[#dbdbdb] flex flex-col items-center justify-center gap-1 bg-[#fafafa]">
                  <svg className="w-7 h-7 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] text-[#8e8e8e]">Додај слика</span>
                </button>
                <div className="flex-1 flex items-center">
                  <p className="text-xs text-[#8e8e8e]">Додај до 10 слики. Прва слика е насловна.</p>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="bg-white border-b border-[#efefef] divide-y divide-[#efefef]">

              {/* Title */}
              <div className="px-4 py-3">
                <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Наслов *</label>
                <input
                  type="text"
                  placeholder="На пр. Nike патики, Кожена јакна..."
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  className="w-full mt-1 text-sm text-[#262626] placeholder-[#8e8e8e] outline-none"
                />
              </div>

              {/* Description */}
              <div className="px-4 py-3">
                <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Опис</label>
                <textarea
                  placeholder="Опиши го производот, состојба, бренд..."
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={3}
                  className="w-full mt-1 text-sm text-[#262626] placeholder-[#8e8e8e] outline-none resize-none"
                />
              </div>

              {/* Category */}
              <div className="px-4 py-3">
                <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Категорија *</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => set('category', c)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                        form.category === c
                          ? 'bg-[#262626] text-white'
                          : 'bg-[#efefef] text-[#262626]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="px-4 py-3">
                <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Состојба *</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CONDITIONS.map(c => (
                    <button
                      key={c}
                      onClick={() => set('condition', c)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                        form.condition === c
                          ? 'bg-[#262626] text-white'
                          : 'bg-[#efefef] text-[#262626]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size (optional) */}
              {(form.category === 'Облека' || form.category === 'Обувки') && (
                <div className="px-4 py-3">
                  <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Големина</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SIZES.map(s => (
                      <button
                        key={s}
                        onClick={() => set('size', s)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                          form.size === s
                            ? 'bg-[#262626] text-white'
                            : 'bg-[#efefef] text-[#262626]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="px-4 py-3">
                <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Цена * (€)</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-[#262626]">€</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    className="flex-1 text-lg font-bold text-[#262626] placeholder-[#dbdbdb] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 pt-4">
              <button
                disabled={!canNext}
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#0095f6] disabled:bg-[#b2dffc] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Продолжи
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="px-4 pt-4 flex flex-col gap-3">
            <div className="bg-white rounded-xl border border-[#efefef] p-4">
              <h3 className="text-sm font-semibold text-[#262626] mb-3">Преглед на оглас</h3>
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-[#efefef] rounded-lg flex items-center justify-center text-2xl">📦</div>
                <div>
                  <p className="text-sm font-semibold text-[#262626]">{form.title}</p>
                  <p className="text-xs text-[#8e8e8e]">{form.condition} · {form.category}</p>
                  <p className="text-base font-bold text-[#262626] mt-1">{form.price}€</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#efefef] p-4">
              <h3 className="text-sm font-semibold text-[#262626] mb-2">Достава</h3>
              <p className="text-xs text-[#8e8e8e]">Итар Пост / Ауто Пакет · Плаќа купувачот</p>
            </div>

            <button
              className="w-full py-3 bg-[#0095f6] text-white text-sm font-semibold rounded-xl"
              onClick={() => navigate('/')}
            >
              Објави оглас
            </button>
            <button
              className="w-full py-3 border border-[#dbdbdb] text-[#262626] text-sm font-semibold rounded-xl"
              onClick={() => setStep(1)}
            >
              Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
};