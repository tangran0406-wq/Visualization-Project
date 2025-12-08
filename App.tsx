import React, { useState, useEffect } from 'react';
import { FoodItem, AppView, ComparisonAnalysis } from './types';
import { generateCanteenMenu, analyzeComparison } from './services/geminiService';

// --- 组件引入 ---
import MenuCard from './components/MenuCard';
import ComparisonChart from './components/ComparisonChart';
import OverviewChart from './components/OverviewChart';
import Sidebar from './components/Sidebar';
// import NewArrivals from './components/NewArrivals'; // 原有的组件可以注释掉或删掉
import TakeoutAnalysis from './components/TakeoutAnalysis';
import CrowdSimulation from './components/CrowdSimulation';
import WeeklyStory from './components/WeeklyStory';
import DishRecommendations from './components/DishRecommendations';

// --- 新增：引入刚才创建的可视化大屏组件 ---
// 假设你把文件放在了 components/Dashboard/index.tsx
import Dashboard from './components/Dashboard'; 

const App: React.FC = () => {
    const [view, setView] = useState<AppView>(AppView.NUTRITION);
    const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
    const [compareMode, setCompareMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);
    const [analyzing, setAnalyzing] = useState<boolean>(false);

    // Initial Data Load
    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            const data = await generateCanteenMenu();
            setMenuItems(data);
            setLoading(false);
        };
        fetchMenu();
    }, []);

    // Handle Item Selection
    const handleSelect = (item: FoodItem) => {
        setSelectedItems(prev => {
            const isSelected = prev.find(i => i.id === item.id);
            if (isSelected) {
                return prev.filter(i => i.id !== item.id);
            }
            if (prev.length < 2) {
                return [...prev, item];
            }
            return prev;
        });
    };

    // Switch to Comparison Mode
    const handleCompare = async () => {
        if (selectedItems.length === 2) {
            setCompareMode(true);
            setAnalyzing(true);
            const result = await analyzeComparison(selectedItems[0], selectedItems[1]);
            setAnalysis(result);
            setAnalyzing(false);
        }
    };

    const handleClearSelection = () => {
        setSelectedItems([]);
    };

    // --- 修改了这里：将 Dashboard 放入渲染逻辑 ---
    const renderContent = () => {
        switch (view) {
            // 这里将原本的 NewArrivals 替换为新的 Dashboard 组件
            case AppView.NEW_ARRIVALS: 
                return <Dashboard />;
                
            case AppView.TAKEOUT_VS_CANTEEN: return <TakeoutAnalysis />;
            case AppView.CROWD_SIM: return <CrowdSimulation />;
            case AppView.WEEKLY_STORY: return <WeeklyStory />;
            case AppView.DISH_RECOMMENDATIONS: return <DishRecommendations />;
            default:
                // Nutrition View (保持不变)
                if (loading) return (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 animate-pulse">正在获取今日菜单...</p>
                    </div>
                );

                if (compareMode) {
                    return (
                        <div className="animate-fade-in">
                            <button onClick={() => setCompareMode(false)} className="mb-4 flex items-center text-sm text-gray-500 hover:text-indigo-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                返回菜单
                            </button>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <ComparisonChart item1={selectedItems[0]} item2={selectedItems[1]} />
                                </div>
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden sticky top-24">
                                        <div className="bg-indigo-600 p-4"><h3 className="text-white font-bold">AI 营养分析师</h3></div>
                                        <div className="p-6">
                                            {analyzing ? <div className="animate-pulse text-gray-500">正在分析营养成分...</div> : analysis && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase">推荐选择</p>
                                                        <p className="font-bold text-emerald-600 text-lg">{analysis.recommendation}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                        <p className="text-sm text-gray-700">{analysis.keyDifferences}</p>
                                                    </div>
                                                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-start">
                                                        <span className="mr-2">💡</span>
                                                        <p className="text-xs text-yellow-800 mt-0.5">{analysis.nutritionalTips}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                return (
                    <>
                        <OverviewChart items={menuItems} />
                        <div className="flex justify-between items-center mb-4 mt-8">
                            <h2 className="text-lg font-bold text-gray-800 border-l-4 border-emerald-500 pl-3">今日菜品</h2>
                            {selectedItems.length > 0 && <button onClick={handleClearSelection} className="text-sm text-red-500 hover:underline">清空选择</button>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                            {menuItems.map(item => (
                                <MenuCard
                                    key={item.id}
                                    item={item}
                                    isSelected={!!selectedItems.find(i => i.id === item.id)}
                                    onSelect={handleSelect}
                                    disabled={selectedItems.length >= 2 && !selectedItems.find(i => i.id === item.id)}
                                />
                            ))}
                        </div>
                        {selectedItems.length > 0 && !compareMode && (
                            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white/90 backdrop-blur-lg p-4 border-t shadow-lg flex justify-between items-center z-40">
                                <span className="text-sm font-medium">已选 {selectedItems.length}/2</span>
                                <button
                                    onClick={handleCompare}
                                    disabled={selectedItems.length !== 2}
                                    className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${selectedItems.length === 2 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' : 'bg-gray-300'
                                        }`}
                                >
                                    {selectedItems.length === 2 ? '开始对比' : `再选 ${2 - selectedItems.length} 项`}
                                </button>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar currentView={view} onViewChange={(v) => { setView(v); setCompareMode(false); }} />
            {/* 注意：如果 Dashboard 内部自带了背景色或 padding，你可能需要移除这里的 padding 或 bg-[#f3f4f6] */}
            {/* 为了适应全屏 Dashboard，我加了一个判断条件来移除 padding */}
            <main className={`flex-1 md:ml-64 ${view === AppView.NEW_ARRIVALS ? 'p-0' : 'p-4 md:p-8'} bg-[#f3f4f6]`}>
                {renderContent()}
            </main>
        </div>
    );
};

export default App;