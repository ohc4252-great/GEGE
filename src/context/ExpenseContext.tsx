import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Expense, DailyEvaluation, AppData } from '../types';
import { format } from 'date-fns';

interface ExpenseContextType {
  expenses: Expense[];
  evaluations: DailyEvaluation[];
  budget: number;
  selectedDate: string;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setBudget: (amount: number) => void;
  setSelectedDate: (date: string) => void;
  setDailyEvaluation: (date: string, comment: string) => void;
  exportData: () => void;
  importData: (data: string) => boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const STORAGE_KEY = 'wise_spending_data';

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [evaluations, setEvaluations] = useState<DailyEvaluation[]>([]);
  const [budget, setBudgetState] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Load Initial Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppData = JSON.parse(saved);
        setExpenses(parsed.expenses || []);
        setEvaluations(parsed.evaluations || []);
        setBudgetState(parsed.monthlyBudget || 0);
      } catch (e) {
        console.error('Failed to parse local storage data', e);
      }
    }
  }, []);

  // Save Data on Change
  useEffect(() => {
    const data: AppData = {
      expenses,
      evaluations,
      monthlyBudget: budget,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [expenses, evaluations, budget]);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
    };
    setExpenses(prev => [...prev, newExpense]);
  }, []);

  const updateExpense = useCallback((id: string, updated: Partial<Expense>) => {
    setExpenses(prev => prev.map(exp => (exp.id === id ? { ...exp, ...updated } : exp)));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, []);

  const setBudget = useCallback((amount: number) => {
    setBudgetState(amount);
  }, []);

  const setDailyEvaluation = useCallback((date: string, comment: string) => {
    setEvaluations(prev => {
      const existing = prev.find(ev => ev.date === date);
      if (existing) {
        return prev.map(ev => (ev.date === date ? { ...ev, comment } : ev));
      }
      return [...prev, { date, comment }];
    });
  }, []);

  const exportData = useCallback(() => {
    const data: AppData = { expenses, evaluations, monthlyBudget: budget };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `현명한소비하기_데이터_${format(new Date(), 'yyyyMMdd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [expenses, evaluations, budget]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed: AppData = JSON.parse(jsonString);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.evaluations) setEvaluations(parsed.evaluations);
      if (typeof parsed.monthlyBudget === 'number') setBudgetState(parsed.monthlyBudget);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        evaluations,
        budget,
        selectedDate,
        addExpense,
        updateExpense,
        deleteExpense,
        setBudget,
        setSelectedDate,
        setDailyEvaluation,
        exportData,
        importData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within an ExpenseProvider');
  return context;
};
