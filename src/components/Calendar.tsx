import React, { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar: React.FC = () => {
  const { expenses, selectedDate, setSelectedDate } = useExpenses();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getDayStats = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayExpenses = expenses.filter(exp => exp.date === dateStr);
    const totalAmount = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgScore = dayExpenses.length > 0 
      ? dayExpenses.reduce((sum, exp) => sum + exp.score, 0) / dayExpenses.length 
      : 0;
    return { totalAmount, avgScore };
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const scoreToColor = (score: number) => {
    if (score === 0) return '';
    if (score >= 8) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 5) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const scoreToDot = (score: number) => {
    if (score === 0) return null;
    if (score >= 8) return <div className="w-1.5 h-1.5 rounded-full bg-green-400" />;
    if (score >= 5) return <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />;
    return <div className="w-1.5 h-1.5 rounded-full bg-red-400" />;
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'yyyy년 MM월', { locale: ko })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 bg-gray-50/50">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div key={day} className={`py-3 text-center text-xs font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 border-t border-gray-100">
        {calendarDays.map((day, i) => {
          const stats = getDayStats(day);
          const isSelected = isSameDay(day, parseISO(selectedDate));
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toString()}
              onClick={() => setSelectedDate(format(day, 'yyyy-MM-dd'))}
              className={`
                min-h-[100px] p-2 border-r border-b border-gray-100 cursor-pointer transition-all relative
                ${!isCurrentMonth ? 'bg-gray-50/30' : 'bg-white'}
                ${isSelected ? 'ring-2 ring-blue-300 ring-inset z-10 bg-blue-50/30' : 'hover:bg-gray-50'}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${!isCurrentMonth ? 'text-gray-300' : i % 7 === 0 ? 'text-red-400' : i % 7 === 6 ? 'text-blue-400' : 'text-gray-600'}`}>
                  {format(day, 'd')}
                </span>
                {scoreToDot(stats.avgScore)}
              </div>
              
              {stats.totalAmount > 0 && (
                <div className={`mt-1 py-1 px-1.5 rounded-md text-[10px] font-bold text-right truncate ${scoreToColor(stats.avgScore)}`}>
                  {stats.totalAmount.toLocaleString()}원
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
