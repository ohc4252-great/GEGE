import React, { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, Upload, Wallet, ThermometerSun, PieChart as PieIcon } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const CATEGORY_COLORS: Record<string, string> = {
  '여가': '#93c5fd',
  '식비': '#fbbf24',
  '교통비': '#c084fc',
  '자격증 및 자기개발': '#4ade80',
  '고정지출': '#94a3b8',
  '기타': '#f472b6',
};

const Dashboard: React.FC = () => {
  const { expenses, budget, setBudget, exportData, importData } = useExpenses();

  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const monthExpenses = expenses.filter(exp => 
      isWithinInterval(parseISO(exp.date), { start, end })
    );

    const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgScore = monthExpenses.length > 0 
      ? monthExpenses.reduce((sum, exp) => sum + exp.score, 0) / monthExpenses.length 
      : 0;

    const categoryData = monthExpenses.reduce((acc: any[], exp) => {
      const existing = acc.find(item => item.name === exp.category);
      if (existing) {
        existing.value += exp.amount;
      } else {
        acc.push({ name: exp.category, value: exp.amount });
      }
      return acc;
    }, []);

    return { totalSpent, avgScore, categoryData };
  }, [expenses]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (importData(text)) alert('데이터를 성공적으로 불러왔습니다!');
        else alert('파일 형식이 올바르지 않습니다.');
      };
      reader.readAsText(file);
    }
  };

  const progress = budget > 0 ? Math.min((currentMonthStats.totalSpent / budget) * 100, 100) : 0;
  const scoreColor = currentMonthStats.avgScore >= 8 ? 'bg-green-400' : currentMonthStats.avgScore >= 5 ? 'bg-yellow-400' : 'bg-red-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Budget Card */}
      <div className="glass-card p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="text-blue-500" size={20} />
            <h3 className="font-bold text-gray-700">이번 달 목표 예산</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={exportData} title="백업"><Download size={18} className="text-gray-400 hover:text-blue-500" /></button>
            <label className="cursor-pointer" title="복구">
              <Upload size={18} className="text-gray-400 hover:text-blue-500" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-2xl font-black text-gray-800">{currentMonthStats.totalSpent.toLocaleString()}원</span>
            <span className="text-sm text-gray-400">/ {budget.toLocaleString()}원</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${progress > 90 ? 'bg-red-300' : 'bg-blue-300'}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <input 
          type="number" 
          placeholder="목표 예산 설정"
          className="w-full text-sm bg-gray-50 border-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          value={budget || ''}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>

      {/* Score Gauge Card */}
      <div className="glass-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <ThermometerSun className="text-orange-500" size={20} />
          <h3 className="font-bold text-gray-700">소비 온도탑</h3>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-4xl font-black mb-2" style={{ color: currentMonthStats.avgScore >= 8 ? '#4ade80' : currentMonthStats.avgScore >= 5 ? '#fbbf24' : '#f87171' }}>
            {currentMonthStats.avgScore.toFixed(1)}<span className="text-lg text-gray-400 ml-1">점</span>
          </div>
          <div className="w-full max-w-[200px] h-4 bg-gray-100 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-700 ${scoreColor}`}
              style={{ width: `${currentMonthStats.avgScore * 10}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            {currentMonthStats.avgScore >= 8 ? '훌륭해요! 현명하게 소비하고 계시네요.' : currentMonthStats.avgScore >= 5 ? '괜찮아요. 조금만 더 신중해져 볼까요?' : '앗, 반성이 필요한 지출이 많아요.'}
          </p>
        </div>
      </div>

      {/* Category Chart Card */}
      <div className="glass-card p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <PieIcon className="text-purple-500" size={20} />
          <h3 className="font-bold text-gray-700">카테고리 비율</h3>
        </div>
        <div className="flex-1 h-[140px]">
          {currentMonthStats.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentMonthStats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {currentMonthStats.categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 text-sm italic">기록된 지출이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
