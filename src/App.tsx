import React from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import DailyPanel from './components/DailyPanel';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-[#fdfbf7] text-[#4a4a4a] pb-12">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-2xl shadow-lg shadow-gray-200/50">
                <Sparkles className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-gray-800">
                현명한 <span className="text-blue-500">소비하기</span>
              </h1>
            </div>
            <div className="hidden md:block text-sm font-medium text-gray-400 italic">
              "당신의 가치 있는 소비를 기록하고 성찰하세요"
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section: Dashboard & Calendar */}
            <div className="flex-1 space-y-8">
              <Dashboard />
              <Calendar />
            </div>

            {/* Right Section: Daily Detail (Fixed on Desktop, Scroll on Mobile) */}
            <aside className="lg:w-[380px] h-fit lg:sticky lg:top-28">
              <DailyPanel />
            </aside>
          </div>
        </main>

        {/* Footer for Mobile context */}
        <footer className="mt-12 text-center text-gray-300 text-xs font-medium uppercase tracking-widest px-6">
          &copy; 2026 Wise Spending Tracker. All rights reserved.
        </footer>
      </div>
    </ExpenseProvider>
  );
};

export default App;
