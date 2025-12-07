import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { MOCK_DATA } from '../services/mockDataService';

const CrowdSimulation: React.FC = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2">食堂人流热力模拟</h3>
            <p className="text-sm text-gray-500 mb-6">基于历史数据预测，助你错峰就餐</p>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_DATA.crowd}>
                        <defs>
                            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="load" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLoad)" name="拥挤度" />
                        <ReferenceLine y={80} label="极度拥挤" stroke="red" strokeDasharray="3 3" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 text-sm mb-2">智能建议</h4>
                <p className="text-sm text-blue-600">
                    当前预测 12:00 是高峰期。建议如果您没课，可以选择 <b>11:30 前往二楼</b>，或者 <b>12:45 后前往一楼</b>，平均节省排队时间 15 分钟。
                </p>
            </div>
        </div>
    </div>
);

export default CrowdSimulation;