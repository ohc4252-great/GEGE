import React, { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { X, CheckCircle2 } from 'lucide-react';
import type { Category, Expense } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Expense;
}

const CATEGORIES: Category[] = ['여가', '식비', '교통비', '자격증 및 자기개발', '고정지출', '기타'];

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addExpense, updateExpense, selectedDate } = useExpenses();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '식비' as Category,
    detail: '',
    score: 7,
    date: selectedDate,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount.toString(),
        category: initialData.category,
        detail: initialData.detail || '',
        score: initialData.score,
        date: initialData.date,
      });
    } else {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [initialData, selectedDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const data = {
      ...formData,
      amount: parseInt(formData.amount.replace(/,/g, ''), 10),
    };

    if (initialData) {
      updateExpense(initialData.id, data);
    } else {
      addExpense(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-800">
              {initialData ? '지출 내역 수정' : '소비 기록하기'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">분류</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all border ${
                      formData.category === cat 
                        ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-gray-200/50' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Amount */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">소비 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 스타벅스 아메리카노"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">금액 (원)</label>
                <input
                  type="text"
                  required
                  placeholder="0"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-lg font-black text-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={Number(formData.amount.replace(/,/g, '')).toLocaleString()}
                  onChange={e => setFormData({ ...formData, amount: e.target.value.replace(/[^0-9]/g, '') })}
                />
              </div>
            </div>

            {/* Score Slider */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase">소비 점수</label>
                <span className={`text-xl font-black ${formData.score >= 8 ? 'text-green-500' : formData.score >= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {formData.score}점
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                value={formData.score}
                onChange={e => setFormData({ ...formData, score: parseInt(e.target.value, 10) })}
              />
              <div className="flex justify-between text-[10px] text-gray-300 font-bold mt-1 uppercase">
                <span>후회해요 (1)</span>
                <span>가치있어요 (10)</span>
              </div>
            </div>

            {/* Detail */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">세부 내역 (선택)</label>
              <textarea
                placeholder="지출에 대한 자세한 내용을 적어보세요."
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={2}
                value={formData.detail}
                onChange={e => setFormData({ ...formData, detail: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-gray-200/50 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} />
              {initialData ? '기록 수정하기' : '소비 기록 저장'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
