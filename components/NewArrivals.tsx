import React from 'react';
import { MOCK_DATA } from '../services/mockDataService';

const NewArrivals: React.FC = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 rounded-3xl text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-2">晨曦食记 · 新品速递</h2>
            <p className="opacity-90">探索本周食堂隐藏菜单与限时特供</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_DATA.arrivals.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                    <div className="h-32 bg-gray-100 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                        {item.image}
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">⭐ {item.rating}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{item.location}</p>
                        <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default NewArrivals;