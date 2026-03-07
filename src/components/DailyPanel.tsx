import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Plus, Trash2, Edit2, Check, X, MessageSquareQuote } from 'lucide-react';
import ExpenseModal from './ExpenseModal';
import { Expense } from '../types';

const DailyPanel: React.FC = () => {
  const { expenses, evaluations, selectedDate, deleteExpense, setDailyEvaluation } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [isEditingEvaluation, setIsEditingEvaluation] = useState(false);
  const [evaluationInput, setEvaluationInput] = useState('');

  const dayExpenses = expenses.filter(exp => exp.date === selectedDate);
  const evaluation = evaluations.find(ev => ev.date === selectedDate);
  const totalAmount = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleEditEvaluation = () => {
    setEvaluationInput(evaluation?.comment || '');
    setIsEditingEvaluation(true);
  };

  const handleSaveEvaluation = () => {
    setDailyEvaluation(selectedDate, evaluationInput);
    setIsEditingEvaluation(false);
  };

  const handleOpenModal = (expense?: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full glass-card p-6 min-w-[320px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-gray-800">
            {format(parseISO(selectedDate), 'MM월 dd일 (eeee)', { locale: ko })}
          </h3>
          <p className="text-sm text-gray-400">총 {totalAmount.toLocaleString()}원 지출</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl soft-shadow transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Evaluation Section */}
      <div className="bg-gray-50/80 rounded-2xl p-4 mb-6 relative">
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <MessageSquareQuote size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">오늘의 소비 평가</span>
        </div>
        
        {isEditingEvaluation ? (
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full bg-white border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              rows={3}
              placeholder="오늘의 소비는 어땠나요? 스스로를 칭찬하거나 반성해 보세요."
              value={evaluationInput}
              onChange={(e) => setEvaluationInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingEvaluation(false)} className="p-1.5 text-gray-400 hover:text-red-400"><X size={18} /></button>
              <button onClick={handleSaveEvaluation} className="p-1.5 text-blue-500 hover:text-blue-600"><Check size={18} /></button>
            </div>
          </div>
        ) : (
          <div onClick={handleEditEvaluation} className="cursor-pointer group">
            <p className={`text-sm ${evaluation?.comment ? 'text-gray-600 italic' : 'text-gray-300 italic'}`}>
              {evaluation?.comment || '이날의 소비를 한 줄로 요약하고 평가해 보세요.'}
            </p>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 size={14} className="text-gray-300" />
            </div>
          </div>
        )}
      </div>

      {/* Expense List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {dayExpenses.length > 0 ? (
          dayExpenses.map(exp => (
            <div key={exp.id} className="bg-white border border-gray-100 rounded-2xl p-4 soft-shadow-sm group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-[10px] text-gray-500 rounded-md font-bold mb-1">
                    {exp.category}
                  </span>
                  <h4 className="font-bold text-gray-800 leading-tight">{exp.title}</h4>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(exp)} className="p-1.5 text-gray-300 hover:text-blue-400 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => deleteExpense(exp.id)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-lg font-black text-blue-500">{exp.amount.toLocaleString()}원</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${exp.score >= 8 ? 'bg-green-100 text-green-600' : exp.score >= 5 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                  {exp.score}점
                </div>
              </div>
              {exp.detail && <p className="mt-2 text-xs text-gray-400 italic line-clamp-2 border-t border-gray-50 pt-2">{exp.detail}</p>}
            </div>
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-gray-300 gap-2">
            <Plus size={32} className="opacity-20" />
            <p className="text-sm italic">기록된 소비 내역이 없습니다.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ExpenseModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialData={editingExpense} 
        />
      )}
    </div>
  );
};

export default DailyPanel;
