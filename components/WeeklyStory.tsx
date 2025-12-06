
import React, { useState } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, Tooltip, YAxis
} from 'recharts';
import { MOCK_DATA } from '../services/mockDataService';
import { MealDetail } from '../types';

const COLORS = {
    breakfast: '#93c5fd', // blue-300
    lunch: '#fdba74',     // orange-300
    dinner: '#c4b5fd',    // violet-300
    highlight: '#6366f1', // indigo-500
    defaultBar: '#e2e8f0' // slate-200
};

const ThemeBadge = ({ color, text }: { color: string, text: string }) => {
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        blue: 'bg-blue-100 text-blue-700 border-blue-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        orange: 'bg-orange-100 text-orange-700 border-orange-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        purple: 'bg-purple-100 text-purple-700 border-purple-200',
        gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    const style = colorMap[color] || colorMap.gray;
    return (
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${style}`}>
            {text}
        </span>
    );
};

const MealRow = ({ label, data, color }: { label: string, data: MealDetail, color: string }) => (
    <div className="flex items-start py-5 border-b border-gray-50 last:border-0 group relative pl-4">
        <div className="absolute left-0 top-6 w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
        <div className="flex-1 ml-3 mr-6">
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition-colors">{data.name}</span>
                <span className="text-sm font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{data.cal} kcal</span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-1 mb-2">{data.desc}</p>
        </div>

        {/* Recommendation Rate Visualization */}
        {data.recommendationRate && (
            <div className="flex flex-col items-end w-20 flex-shrink-0">
                <div className="flex items-center space-x-1 mb-1">
                    <span className={`text-sm font-black ${data.recommendationRate >= 90 ? 'text-emerald-500' : 'text-indigo-500'}`}>
                        {data.recommendationRate}%
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${data.recommendationRate >= 90 ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                        style={{ width: `${data.recommendationRate}%` }}
                    ></div>
                </div>
                <span className="text-[10px] text-gray-300 transform scale-90 origin-right mt-1">推荐指数</span>
            </div>
        )}
    </div>
);

const WeeklyStory: React.FC = () => {
    const story = MOCK_DATA.weeklyStory;
    const [currentIndex, setCurrentIndex] = useState(0);
    const dailyPlan = story.weeklyIdeally[currentIndex];

    // Data for Pie Chart
    const dailyPieData = [
        { name: '早餐', value: dailyPlan.breakfast.cal, color: COLORS.breakfast },
        { name: '午餐', value: dailyPlan.lunch.cal, color: COLORS.lunch },
        { name: '晚餐', value: dailyPlan.dinner.cal, color: COLORS.dinner },
    ];

    // Data for Trend Chart
    const trendData = story.weeklyIdeally.map((day, index) => ({
        day: day.day.substring(0, 3), // Mon, Tue...
        cal: day.totalCal,
        isCurrent: index === currentIndex
    }));

    const nextDay = () => {
        if (currentIndex < story.weeklyIdeally.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevDay = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12 max-w-3xl mx-auto">

            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-4 md:px-0">
                <button
                    onClick={prevDay}
                    disabled={currentIndex === 0}
                    className={`p-3 rounded-full transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-lg active:scale-95 text-gray-600 bg-white/50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="text-center">
                    <h3 className="text-3xl font-black text-gray-800 tracking-tight">{dailyPlan.date} {dailyPlan.day}</h3>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">Personalized Meal Plan</p>
                </div>
                <button
                    onClick={nextDay}
                    disabled={currentIndex === story.weeklyIdeally.length - 1}
                    className={`p-3 rounded-full transition-all ${currentIndex === story.weeklyIdeally.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-lg active:scale-95 text-gray-600 bg-white/50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Main Day Card */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 transform relative">

                {/* Visual Header Section */}
                <div className={`p-8 pb-4 bg-gradient-to-b ${dailyPlan.themeColor === 'emerald' ? 'from-emerald-50/80 to-white' :
                        dailyPlan.themeColor === 'rose' ? 'from-rose-50/80 to-white' :
                            dailyPlan.themeColor === 'blue' ? 'from-blue-50/80 to-white' :
                                dailyPlan.themeColor === 'amber' ? 'from-amber-50/80 to-white' :
                                    dailyPlan.themeColor === 'purple' ? 'from-purple-50/80 to-white' :
                                        dailyPlan.themeColor === 'orange' ? 'from-orange-50/80 to-white' :
                                            'from-gray-50/80 to-white'
                    }`}>
                    <div className="flex justify-between items-center mb-6">
                        <ThemeBadge color={dailyPlan.themeColor} text={dailyPlan.theme} />
                        <span className="text-5xl filter drop-shadow-sm transform hover:scale-110 transition-transform cursor-default">{dailyPlan.mood}</span>
                    </div>

                    {/* Chart & Stats Container */}
                    <div className="flex flex-col md:flex-row items-center justify-between mt-2 gap-8">
                        {/* Enlarged Donut Chart */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dailyPieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={4}
                                    >
                                        {dailyPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-gray-800 leading-none">{dailyPlan.totalCal}</span>
                                <span className="text-xs text-gray-400 font-bold uppercase mt-1">kcal total</span>
                            </div>
                        </div>

                        {/* Meal List */}
                        <div className="flex-1 w-full space-y-2">
                            <MealRow label="早" data={dailyPlan.breakfast} color={COLORS.breakfast} />
                            <MealRow label="午" data={dailyPlan.lunch} color={COLORS.lunch} />
                            <MealRow label="晚" data={dailyPlan.dinner} color={COLORS.dinner} />
                        </div>
                    </div>
                </div>

                {/* Footer Section: Tip & Weekly Trend */}
                <div className="p-8 pt-4">
                    {/* Tip */}
                    <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100 flex items-start gap-4 mb-8">
                        <span className="text-2xl">💡</span>
                        <p className="text-sm text-yellow-800 leading-relaxed pt-1 font-medium">
                            {dailyPlan.tips}
                        </p>
                    </div>

                    {/* Weekly Trend Chart - Enlarged */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Weekly Calorie Overview</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-sm"></span>
                                <span className="text-xs text-gray-400">Selected Day</span>
                            </div>
                        </div>
                        <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                                        interval={0}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-gray-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl font-mono">
                                                        {payload[0].value} kcal
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="cal" radius={[4, 4, 4, 4]} barSize={30}>
                                        {trendData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.isCurrent ? COLORS.highlight : COLORS.defaultBar}
                                                className="transition-all duration-300"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyStory;
