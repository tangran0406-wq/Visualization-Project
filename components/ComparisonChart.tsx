import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FoodItem } from '../types';

interface ComparisonChartProps {
  item1: FoodItem;
  item2: FoodItem;
}

const COLORS = {
  item1: '#10B981', // Emerald-500
  item2: '#F43F5E', // Rose-500
  macros: {
    protein: '#3B82F6', // Blue
    carbs: '#F59E0B',   // Amber
    fat: '#8B5CF6'      // Violet
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-gray-200 shadow-xl rounded-xl text-sm z-50">
        <p className="font-bold text-gray-700 mb-2 border-b pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-bold font-mono" style={{ color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SummaryCard = ({ item, colorCode, label }: { item: FoodItem, colorCode: string, label: string }) => {
  const borderColor = colorCode === 'emerald' ? 'border-emerald-500' : 'border-rose-500';
  const bgColor = colorCode === 'emerald' ? 'bg-emerald-50' : 'bg-rose-50';
  const textColor = colorCode === 'emerald' ? 'text-emerald-700' : 'text-rose-700';

  return (
    <div className={`p-4 rounded-2xl border-l-4 shadow-sm bg-white ${borderColor} relative overflow-hidden group`}>
       <div className={`absolute top-0 right-0 p-2 opacity-10 ${bgColor} rounded-bl-2xl`}>
          <span className="text-4xl font-bold">{label}</span>
       </div>
       <div className="relative z-10">
          <h3 className="font-bold text-gray-800 text-lg truncate pr-8">{item.name}</h3>
          <p className="text-3xl font-black text-gray-900 mt-2 tracking-tight">
            {item.calories} <span className="text-sm font-medium text-gray-500">kcal</span>
          </p>
          <div className="mt-3 flex items-center space-x-3 text-xs font-medium text-gray-500">
             <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">P: {item.protein}g</span>
             <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded">C: {item.carbs}g</span>
             <span className="bg-violet-50 text-violet-600 px-2 py-1 rounded">F: {item.fat}g</span>
          </div>
       </div>
    </div>
  );
};

const ComparisonChart: React.FC<ComparisonChartProps> = ({ item1, item2 }) => {
  // 1. Calorie Comparison Data
  const calorieData = [
    {
      name: '热量 (kcal)',
      [item1.name]: item1.calories,
      [item2.name]: item2.calories,
    },
  ];

  // 2. Macro Breakdown (Grams) Data for Grouped Bar
  const macroBarData = [
    { name: '蛋白质', [item1.name]: item1.protein, [item2.name]: item2.protein },
    { name: '碳水', [item1.name]: item1.carbs, [item2.name]: item2.carbs },
    { name: '脂肪', [item1.name]: item1.fat, [item2.name]: item2.fat },
  ];

  // 3. Macro Ratio (Source of Calories) Data for Pie Charts
  const getMacroPieData = (item: FoodItem) => [
    { name: '蛋白质', value: item.protein * 4, color: COLORS.macros.protein },
    { name: '碳水', value: item.carbs * 4, color: COLORS.macros.carbs },
    { name: '脂肪', value: item.fat * 9, color: COLORS.macros.fat },
  ];

  // 4. Radar Data
  const radarData = [
    { subject: '蛋白质', A: item1.protein, B: item2.protein, fullMark: 100 },
    { subject: '碳水', A: item1.carbs, B: item2.carbs, fullMark: 150 },
    { subject: '脂肪', A: item1.fat, B: item2.fat, fullMark: 80 },
    { subject: '热量', A: item1.calories / 10, B: item2.calories / 10, fullMark: 100 }, 
    { subject: '价格', A: item1.price * 2, B: item2.price * 2, fullMark: 100 }, 
  ];

  // Burn Time Calculation (Est)
  const calcBurn = (kcal: number) => ({
    run: Math.round(kcal / 10), // ~10kcal/min
    walk: Math.round(kcal / 4)  // ~4kcal/min
  });

  const burn1 = calcBurn(item1.calories);
  const burn2 = calcBurn(item2.calories);

  return (
    <div className="flex flex-col space-y-6 w-full animate-fade-in-up">
      
      {/* 0. Summary Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard item={item1} colorCode="emerald" label="A" />
        <SummaryCard item={item2} colorCode="rose" label="B" />
      </div>

      {/* 1. Calorie & Activity Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <span className="bg-red-100 text-red-600 p-1 rounded mr-2">🔥</span> 
          热量与运动消耗
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Bar Chart */}
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={calorieData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                barSize={32}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide width={10} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Legend iconType="circle" />
                <Bar dataKey={item1.name} fill={COLORS.item1} radius={[0, 6, 6, 0]} animationDuration={1500} />
                <Bar dataKey={item2.name} fill={COLORS.item2} radius={[0, 6, 6, 0]} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Equivalent */}
          <div className="space-y-4">
            {/* Item 1 Burn */}
            <div className="flex items-center justify-between p-3 bg-emerald-50/30 rounded-xl border border-emerald-100">
              <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                 <span className="text-sm font-semibold text-gray-700 truncate max-w-[100px]">{item1.name}</span>
              </div>
              <div className="flex space-x-4 text-xs text-gray-600">
                 <div className="flex flex-col items-center">
                    <span className="text-lg">🏃</span>
                    <span>{burn1.run} min</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-lg">🚶</span>
                    <span>{burn1.walk} min</span>
                 </div>
              </div>
            </div>

             {/* Item 2 Burn */}
            <div className="flex items-center justify-between p-3 bg-rose-50/30 rounded-xl border border-rose-100">
              <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                 <span className="text-sm font-semibold text-gray-700 truncate max-w-[100px]">{item2.name}</span>
              </div>
              <div className="flex space-x-4 text-xs text-gray-600">
                 <div className="flex flex-col items-center">
                    <span className="text-lg">🏃</span>
                    <span>{burn2.run} min</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-lg">🚶</span>
                    <span>{burn2.walk} min</span>
                 </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">* 估算值：跑步10kcal/min，步行4kcal/min</p>
          </div>
        </div>
      </div>

      {/* 2. Macro Nutrient Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nutrient Grams Comparison */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-emerald-100 text-emerald-600 p-1 rounded mr-2">📊</span>
              三大营养素对比 (g)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={macroBarData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fill: '#666', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f9fafb'}} />
                  <Legend iconType="circle" />
                  <Bar dataKey={item1.name} fill={COLORS.item1} radius={[4, 4, 0, 0]} />
                  <Bar dataKey={item2.name} fill={COLORS.item2} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Macro Distribution (Donuts) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
               <span className="bg-amber-100 text-amber-600 p-1 rounded mr-2">🍩</span>
               热量来源占比
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Item 1 Pie */}
                <div className="flex flex-col items-center">
                   <div className="h-40 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getMacroPieData(item1)}
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                          >
                            {getMacroPieData(item1).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <span className="text-xs font-bold text-gray-500 max-w-[80px] text-center truncate">{item1.name}</span>
                      </div>
                   </div>
                </div>

                {/* Item 2 Pie */}
                <div className="flex flex-col items-center">
                   <div className="h-40 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getMacroPieData(item2)}
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                          >
                            {getMacroPieData(item2).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <span className="text-xs font-bold text-gray-500 max-w-[80px] text-center truncate">{item2.name}</span>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Shared Legend */}
             <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-gray-600">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>蛋白质</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2 bg-amber-500"></div>碳水</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2 bg-violet-500"></div>脂肪</div>
             </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-purple-100 text-purple-600 p-1 rounded mr-2">🕸️</span>
              综合维度评估
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={100} data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <Radar
                    name={item1.name}
                    dataKey="A"
                    stroke={COLORS.item1}
                    fill={COLORS.item1}
                    fillOpacity={0.3}
                  />
                  <Radar
                    name={item2.name}
                    dataKey="B"
                    stroke={COLORS.item2}
                    fill={COLORS.item2}
                    fillOpacity={0.3}
                  />
                  <Legend iconType="rect" wrapperStyle={{ paddingTop: '10px' }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">* 数据标准化处理以便于对比，非绝对值</p>
          </div>

      </div>
    </div>
  );
};

export default ComparisonChart;