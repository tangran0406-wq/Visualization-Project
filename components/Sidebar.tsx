
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
    currentView: AppView;
    onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    const menuItems = [
        { id: AppView.NUTRITION, icon: "🥗", label: "营养助手" },
        { id: AppView.DISH_RECOMMENDATIONS, icon: "👍", label: "菜品推荐" },
        { id: AppView.NEW_ARRIVALS, icon: "🆕", label: "新品推荐" },
        { id: AppView.TAKEOUT_VS_CANTEEN, icon: "🛵", label: "外卖PK食堂" },
        { id: AppView.CROWD_SIM, icon: "👥", label: "人流模拟" },
        { id: AppView.WEEKLY_STORY, icon: "📅", label: "一周食谱" },
    ];

    return (
        <div className="bg-white w-full md:w-64 md:h-screen md:fixed flex flex-row md:flex-col shadow-lg z-50 md:z-auto overflow-x-auto md:overflow-visible no-scrollbar">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center md:block min-w-max md:min-w-0">
                <span className="text-2xl mr-2">🏫</span>
                <h1 className="font-bold text-gray-800 text-lg md:text-xl inline-block">舌尖上的山青</h1>
            </div>
            <nav className="flex-1 p-2 md:p-4 flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all whitespace-nowrap ${currentView === item.id
                                ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span className="mr-3 text-xl">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
