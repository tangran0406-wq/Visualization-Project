
import React, { useState } from 'react';
import { MOCK_DATA } from '../services/mockDataService';
import { RecommendationItem } from '../types';

type ZoneTab = 'southFirst' | 'southSecond' | 'north';

const DishRecommendations: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ZoneTab>('southFirst');

    const renderCard = (item: RecommendationItem) => (
        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
            <div className="h-32 bg-gray-50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                {item.image}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                    <span className="font-mono font-bold text-indigo-600">¥{item.price}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{item.stall}</span>
                    <span className="flex items-center text-orange-500 font-bold">
                        ★ {item.rating}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                        <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl">
                <h2 className="text-3xl font-bold mb-2">食堂口碑榜</h2>
                <p className="opacity-90">学长学姐吃出来的宝藏菜单，绝不踩雷</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('southFirst')}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'southFirst' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    📍 南区一楼
                </button>
                <button
                    onClick={() => setActiveTab('southSecond')}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'southSecond' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    📍 南区二楼
                </button>
                <button
                    onClick={() => setActiveTab('north')}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'north' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    📍 北区食堂
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_DATA.canteenRecommendations[activeTab].map(renderCard)}
            </div>

            {/* Empty State / Footer */}
            <div className="text-center py-8 text-gray-400 text-sm">
                <p>以上数据综合自「晨曦食记」公众号好评统计</p>
            </div>
        </div>
    );
};

export default DishRecommendations;
