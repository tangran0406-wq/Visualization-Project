import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { FoodItem } from '../types';

interface OverviewChartProps {
  items: FoodItem[];
}

type SortOption = 'calories' | 'protein' | 'fat' | 'carbs';
type ViewMode = 'ranking' | 'scatter' | 'radial';

const OverviewChart: React.FC<OverviewChartProps> = ({ items }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('scatter');
  const [sortBy, setSortBy] = useState<SortOption>('calories');

  // --- Data Preparation ---
  // Common sorting logic
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'calories') return a.calories - b.calories; // Low to High usually better for calories
    return b[sortBy] - a[sortBy]; // High to Low for nutrients
  });

  // Ranking Data
  const rankingData = sortedItems;

  // Scatter Data
  const fatLossItems = items.filter(i => i.category === 'fat-loss').map(i => ({ ...i, x: i.calories, y: i.protein }));
  const standardItems = items.filter(i => i.category === 'standard').map(i => ({ ...i, x: i.calories, y: i.protein }));

  // Radial Data
  // RadialBarChart works best when data is sorted ascending (smallest inner, largest outer)
  // We attach a fill color directly to the data object for the RadialBar to use
  const radialData = [...items]
    .sort((a, b) => a[sortBy] - b[sortBy]) // Ascending for rings (inner to outer)
    .map((item, index) => ({
      ...item,
      // Generate a gradient-like color or distinct colors based on category
      fill: item.category === 'fat-loss' 
        ? '#10B981' // Emerald
        : '#F43F5E', // Rose
      // Add a slight opacity variation based on index to distinguish rings if needed, or keep solid
    }));

  // Dynamic Labels
  const metricLabels: Record<SortOption, string> = {
    calories: '热量 (kcal)',
    protein: '蛋白质 (g)',
    carbs: '碳水 (g)',
    fat: '脂肪 (g)'
  };

  const renderRankingView = () => (
    <div className="animate-fade-in h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={rankingData}
          margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={110} 
            tick={{fontSize: 12, fill: '#4b5563', fontWeight: 500}} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{fill: '#f9fafb'}}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-white/95 backdrop-blur shadow-xl border border-gray-100 p-3 rounded-xl text-sm z-50">
                    <p className="font-bold text-gray-800 mb-2 border-b pb-1">{d.name}</p>
                    <p className="text-gray-600 font-mono">
                      {metricLabels[sortBy]}: <span className="font-bold text-gray-900">{d[sortBy]}</span>
                    </p>
                    {sortBy !== 'calories' && <p className="text-xs text-gray-400 mt-1">热量: {d.calories} kcal</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey={sortBy} 
            radius={[0, 6, 6, 0]} 
            barSize={20}
            animationDuration={800}
          >
            {rankingData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.category === 'fat-loss' ? '#10B981' : '#F43F5E'}
                fillOpacity={0.8}
              />
            ))}
            <LabelList 
              dataKey={sortBy} 
              position="right" 
              fill="#6b7280" 
              fontSize={12} 
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>减脂餐</div>
          <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>普通餐</div>
      </div>
    </div>
  );

  const renderScatterView = () => (
    <div className="animate-fade-in relative h-[500px] w-full">
      {/* Matrix Explanation */}
      <div className="absolute top-0 right-0 z-10 hidden md:block">
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 shadow-sm text-xs max-w-[200px]">
          <p className="font-bold text-gray-700 mb-1">如何看这张图？</p>
          <ul className="space-y-1 text-gray-500">
            <li className="flex items-center"><span className="text-emerald-500 font-bold mr-1">↖</span> 左上角：<b>高蛋白低热量</b> (推荐)</li>
            <li className="flex items-center"><span className="text-rose-500 font-bold mr-1">↘</span> 右下角：<b>高热量低蛋白</b> (少吃)</li>
          </ul>
        </div>
      </div>

      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="热量" 
              unit="kcal" 
              label={{ value: '热量 (kcal)', position: 'bottom', offset: 0, fill: '#9ca3af', fontSize: 12 }} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="蛋白质" 
              unit="g" 
              label={{ value: '蛋白质 (g)', angle: -90, position: 'left', offset: 0, fill: '#9ca3af', fontSize: 12 }}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="id" range={[100, 100]} /> {/* Fixed size bubbles */}
            
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur shadow-xl border border-gray-100 p-3 rounded-xl text-sm z-50">
                      <p className="font-bold text-gray-800 mb-2 border-b pb-1">{d.name}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <span className="text-gray-500">热量:</span> 
                          <span className="font-bold text-gray-900">{d.calories} kcal</span>
                          <span className="text-gray-500">蛋白质:</span> 
                          <span className="font-bold text-blue-600">{d.protein} g</span>
                          <span className="text-gray-500">碳水:</span> 
                          <span className="font-bold text-amber-600">{d.carbs} g</span>
                          <span className="text-gray-500">脂肪:</span> 
                          <span className="font-bold text-violet-600">{d.fat} g</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', color: '#666', paddingTop: '10px' }} />
            
            {/* Reference Lines for 'Good' zones */}
            <ReferenceLine x={800} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: '高热量警戒线', position: 'insideTopRight', fill: '#94a3b8', fontSize: 10 }} />
            
            <Scatter name="减脂优选 (低卡)" data={fatLossItems} fill="#10B981" shape="circle" />
            <Scatter name="家常风味 (高卡)" data={standardItems} fill="#F43F5E" shape="diamond" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderRadialView = () => (
    <div className="animate-fade-in relative h-[500px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="20%" 
          outerRadius="90%" 
          data={radialData} 
          startAngle={180} 
          endAngle={0}
        >
          <RadialBar
            label={{ position: 'insideStart', fill: '#fff', fontSize: 10, formatter: (val: any) => '' }} 
            background
            dataKey={sortBy}
            cornerRadius={10}
          />
          <Legend 
            iconSize={10} 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ fontSize: '11px', lineHeight: '20px', color: '#4b5563' }}
            content={() => {
              const legendItems = radialData.map(item => ({
                id: item.id,
                value: `${item.name} (${item[sortBy]})`,
                color: item.fill
              })).reverse();
              return (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {legendItems.map((entry, index) => (
                    <li key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: entry.color, marginRight: 8 }}></span>
                      <span style={{ color: '#4b5563' }}>{entry.value}</span>
                    </li>
                  ))}
                </ul>
              )
            }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-white/95 backdrop-blur shadow-xl border border-gray-100 p-3 rounded-xl text-sm z-50">
                    <p className="font-bold text-gray-800 mb-1">{d.name}</p>
                    <p className="text-emerald-600 font-mono font-bold">
                       {metricLabels[sortBy]}: {d[sortBy]}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4 lg:mt-0 lg:ml-[-80px]">
         <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">Current Metric</div>
         <div className="text-xl font-bold text-gray-700">{metricLabels[sortBy]}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 animate-fade-in-up">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3 text-xl">🧭</span>
            全局营养透视
          </h3>
          <p className="text-sm text-gray-500 mt-1">比较所有菜品，发现最优选择</p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
           <button
             onClick={() => setViewMode('ranking')}
             className={`px-3 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap flex items-center ${
               viewMode === 'ranking' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             📊 排行榜
           </button>
           <button
             onClick={() => setViewMode('scatter')}
             className={`px-3 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap flex items-center ${
               viewMode === 'scatter' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             🧩 效率矩阵
           </button>
           <button
             onClick={() => setViewMode('radial')}
             className={`px-3 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap flex items-center ${
               viewMode === 'radial' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             🎯 环形图
           </button>
        </div>
      </div>

      {/* Metric Filters (Only relevant for Ranking and Radial) */}
      {viewMode !== 'scatter' && (
        <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
          {(Object.keys(metricLabels) as SortOption[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                sortBy === key 
                  ? `bg-${key === 'calories' ? 'rose' : key === 'protein' ? 'blue' : key === 'carbs' ? 'amber' : 'violet'}-50 border-${key === 'calories' ? 'rose' : key === 'protein' ? 'blue' : key === 'carbs' ? 'amber' : 'violet'}-200 text-${key === 'calories' ? 'rose' : key === 'protein' ? 'blue' : key === 'carbs' ? 'amber' : 'violet'}-700`
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {metricLabels[key]}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      {viewMode === 'ranking' && renderRankingView()}
      {viewMode === 'scatter' && renderScatterView()}
      {viewMode === 'radial' && renderRadialView()}

    </div>
  );
};

export default OverviewChart;