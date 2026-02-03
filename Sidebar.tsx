
import React from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  QuestionMarkCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeView: 'chat' | 'dashboard';
  setActiveView: (view: 'chat' | 'dashboard') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">OmniSupport</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <button 
          onClick={() => setActiveView('chat')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeView === 'chat' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'hover:bg-slate-800'
          }`}
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span className="font-medium">Support Chat</span>
        </button>

        <button 
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeView === 'dashboard' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'hover:bg-slate-800'
          }`}
        >
          <ChartBarIcon className="w-5 h-5" />
          <span className="font-medium">Ticket Board</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-lg text-sm transition-colors">
          <QuestionMarkCircleIcon className="w-5 h-5" />
          <span>Help Center</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-lg text-sm transition-colors">
          <Cog6ToothIcon className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>

      <div className="p-6 mt-auto">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Usage</p>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400">45% of monthly tokens used</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
