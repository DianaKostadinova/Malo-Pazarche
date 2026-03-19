import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@services/api';

const CATEGORIES = ['Облека', 'Обувки', 'Аксесоари', 'Електроника', 'Спорт', 'Дом'];
const CONDITIONS = ['Ново', 'Kako ново', 'Одлично', 'Добро', 'Прифатливо'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  size: string;
  price: string;
}

export const SellPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    title: '', description: '', category: '', condition: '', size: '', price: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));
  const canNext = form.title && form.category && form.condition && form.price;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      setError('Максимум 10 слики');
      return;
    }
    const newImages = [...images, ...files].slice(0, 10);
    setImages(newImages);
    setPreviews(newImages.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create product
      const res = await apiClient.post('/api/products', {
        title: form.title,
        description: form.description || undefined,
        category: form.category,
        size: form.size || undefined,
        condition: form.condition,
        price: parseFloat(form.price),
      });

      const productId = res.data.id;

      // 2. Upload images one by one
      for (const file of images) {
        const fd = new FormData();
        fd.append('file', file);
        await apiClient.post(`/api/products/${productId}/images`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/');
    } catch (err: any) {
      const data = err.response?.data;
      let message = 'Грешка при објавување';
      if (data?.errors) {
        message = Object.values(data.errors).flat().join(' ');
      } else if (data?.message) {
        message = data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-6" />
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pb-10">

        {error && (
          <div className="mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            {/* Image upload */}
            <div className="bg-white border-b border-[#efefef] p-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.length < 10 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-[90px] h-[90px] flex-shrink-0 rounded-xl border-2 border-dashed border-[#dbdbdb] flex flex-col items-center justify-center gap-1 bg-[#fafafa]"
                  >
                    <svg className="w-6 h-6 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] text-[#8e8e8e]">{images.length}/10</span>
                  </button>
                )}
                {previews.map((src, i) => (
                  <div key={i} className="relative w-[90px] h-[90px] flex-shrink-0 rounded-xl overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] text-center py-0.5 font-semibold">
                        НАСЛОВНА
                      </div>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form fields */}
            <div className="bg-white border-b border-[#efefef] divide-y divide-[#efefef]">

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

              <div className="px-4 py-3">
                <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Категорија *</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => set('category', c)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${form.category === c ? 'bg-[#262626] text-white' : 'bg-[#efefef] text-[#262626]'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3">
                <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Состојба *</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CONDITIONS.map(c => (
                    <button key={c} onClick={() => set('condition', c)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${form.condition === c ? 'bg-[#262626] text-white' : 'bg-[#efefef] text-[#262626]'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {(form.category === 'Облека' || form.category === 'Обувки') && (
                <div className="px-4 py-3">
                  <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Големина</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SIZES.map(s => (
                      <button key={s} onClick={() => set('size', s)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${form.size === s ? 'bg-[#262626] text-white' : 'bg-[#efefef] text-[#262626]'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                className="w-full py-3 bg-[#0095f6] disabled:bg-[#b2dffc] text-white text-sm font-semibold rounded-xl"
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
                {previews[0] ? (
                  <img src={previews[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-[#efefef] rounded-lg flex items-center justify-center text-2xl">📦</div>
                )}
                <div>
                  <p className="text-sm font-semibold text-[#262626]">{form.title}</p>
                  <p className="text-xs text-[#8e8e8e]">{form.condition} · {form.category}{form.size ? ` · ${form.size}` : ''}</p>
                  <p className="text-base font-bold text-[#262626] mt-1">{form.price}€</p>
                </div>
              </div>
              {images.length > 0 && (
                <p className="text-xs text-[#8e8e8e] mt-2">{images.length} {images.length === 1 ? 'слика' : 'слики'}</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#efefef] p-4">
              <h3 className="text-sm font-semibold text-[#262626] mb-1">Достава</h3>
              <p className="text-xs text-[#8e8e8e]">Итар Пост / Ауто Пакет · Плаќа купувачот</p>
            </div>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="w-full py-3 bg-[#0095f6] disabled:bg-[#b2dffc] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Се објавува...
                </>
              ) : 'Објави оглас'}
            </button>
            <button disabled={loading} onClick={() => setStep(1)}
              className="w-full py-3 border border-[#dbdbdb] text-[#262626] text-sm font-semibold rounded-xl">
              Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
};