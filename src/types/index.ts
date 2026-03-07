export type Category = '여가' | '식비' | '교통비' | '자격증 및 자기개발' | '고정지출' | '기타';

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: Category;
  title: string;
  detail?: string;
  amount: number;
  score: number; // 1-10
}

export interface DailyEvaluation {
  date: string; // YYYY-MM-DD
  comment: string;
}

export interface AppData {
  expenses: Expense[];
  evaluations: DailyEvaluation[];
  monthlyBudget: number;
}
