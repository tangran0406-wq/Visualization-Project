import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_DATA } from '../services/mockDataService';

const TakeoutAnalysis: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Charts */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-6">外卖 vs 食堂：数据真相</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA.takeoutComparison} layout="vertical" barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} style={{fontSize: '12px'}} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="canteen" name="食堂" fill="#10B981" radius={[0,4,4,0]} />
                            <Bar dataKey="takeout" name="外卖" fill="#6366f1" radius={[0,4,4,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 border-l-4 border-emerald-500 pl-2">食堂人气榜</h4>
                    {MOCK_DATA.popularCanteen.map((i, idx) => (
                        <div key={idx} className="flex items-center justify-between mb-3 text-sm">
                            <span className="text-gray-600">{idx+1}. {i.name}</span>
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{width: `${i.value}%`, background: i.color}}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 border-l-4 border-purple-500 pl-2">外卖红榜</h4>
                    {MOCK_DATA.popularTakeout.map((i, idx) => (
                        <div key={idx} className="flex items-center justify-between mb-3 text-sm">
                            <span className="text-gray-600">{idx+1}. {i.name}</span>
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{width: `${i.value}%`, background: i.color}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Niche Recommendations */}
        <div>
            <h3 className="font-bold text-xl text-gray-800 mb-4">宝藏小众外卖 (月销少但好评多)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_DATA.nicheTakeout.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400">月销 {item.sales}</div>
                            <div className="text-orange-500 font-bold">{item.rating} ★</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default TakeoutAnalysis;