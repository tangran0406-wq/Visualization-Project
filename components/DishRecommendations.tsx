import React, { useState, useMemo } from 'react';
import { 
  Utensils, Clock, Star, Flame, Zap, DollarSign, BarChart2, 
  TrendingUp, Award, Users 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie
} from 'recharts';

// 直接内联窗口数据，无需外部文件（保留原有菜品 + 添加新菜品）
const cafeteriaWindows = {
  south: {
    floor1: [
      // 原有菜品
      { id: 1, name: "小笼包", rating: 4.8, popularity: 92, avgPrice: 6, waitTime: 8 },
      { id: 2, name: "馋嘴砂锅", rating: 4.5, popularity: 83, avgPrice: 12, waitTime: 7 },
      { id: 3, name: "辣椒炒肉", rating: 4.6, popularity: 88, avgPrice: 12, waitTime: 8 },
      { id: 4, name: "三汁焖锅", rating: 4.6, popularity: 78, avgPrice: 12, waitTime: 9 },
      // 新增菜品
      { id: 5, name: "老友粉", rating: 4.7, popularity: 80, avgPrice: 12, waitTime: 6 },
      { id: 6, name: "轻食套餐", rating: 4.5, popularity: 82, avgPrice: 15, waitTime: 8 },
      { id: 7, name: "油泼面", rating: 4.8, popularity: 78, avgPrice: 12, waitTime: 5 },
      { id: 8, name: "土豆泥拌面", rating: 4.6, popularity: 81, avgPrice: 13, waitTime: 7 },
      { id: 9, name: "青岛风味", rating: 4.4, popularity: 75, avgPrice: 12, waitTime: 9 },
      { id: 10, name: "紫薯芋泥年糕", rating: 4.9, popularity: 82, avgPrice: 10, waitTime: 6 },
      { id: 11, name: "台湾卤肉饭", rating: 4.7, popularity: 89, avgPrice: 14, waitTime: 5 },
      { id: 12, name: "鸡丝拌粉", rating: 4.6, popularity: 81, avgPrice: 12, waitTime: 7 },
    ],
    floor2: [
      // 原有菜品
      { id: 13, name: "重庆小面", rating: 4.7, popularity: 93, avgPrice: 13, waitTime: 9 },
      { id: 14, name: "巴西烤肉饭", rating: 4.9, popularity: 95, avgPrice: 13, waitTime: 10 },
      { id: 15, name: "羊肉烩面", rating: 4.6, popularity: 90, avgPrice: 13, waitTime: 9 },
      { id: 16, name: "烧鸭饭", rating: 4.6, popularity: 88, avgPrice: 16, waitTime: 8 },
      // 新增菜品
      { id: 17, name: "茶香鸡米饭", rating: 4.8, popularity: 83, avgPrice: 15, waitTime: 6 },
      { id: 18, name: "自选称重烤盘饭", rating: 4.7, popularity: 90, avgPrice: 18, waitTime: 10 },
      { id: 19, name: "鸭血粉丝汤", rating: 4.6, popularity: 85, avgPrice: 10, waitTime: 7 },
      { id: 20, name: "吊龙米线", rating: 4.9, popularity: 86, avgPrice: 15, waitTime: 6 },
      { id: 21, name: "石锅拌饭", rating: 4.7, popularity: 88, avgPrice: 15, waitTime: 8 },
      { id: 22, name: "沙茶面", rating: 4.5, popularity: 82, avgPrice: 12, waitTime: 7 },
      { id: 23, name: "蜀香烤鱼饭", rating: 4.8, popularity: 89, avgPrice: 15, waitTime: 10 },
      { id: 24, name: "京味小厨", rating: 4.6, popularity: 79, avgPrice: 15, waitTime: 8 },
      { id: 25, name: "隆江猪肘饭", rating: 4.7, popularity: 83, avgPrice: 15, waitTime: 7 },
    ],
  },
  north: {
    floor1: [
      // 原有菜品
      { id: 26, name: "手工水饺", rating: 4.7, popularity: 92, avgPrice: 10, waitTime: 9 },
      { id: 27, name: "台湾卤肉饭", rating: 4.6, popularity: 80, avgPrice: 12, waitTime: 5 },
      { id: 28, name: "旋转小火锅", rating: 4.8, popularity: 84, avgPrice: 20, waitTime: 10 },
      { id: 29, name: "麻辣香锅", rating: 4.6, popularity: 78, avgPrice: 16, waitTime: 8 },
      // 新增菜品
      { id: 30, name: "面面俱到", rating: 4.8, popularity: 91, avgPrice: 15, waitTime: 6 },
      { id: 31, name: "四季稻香", rating: 4.6, popularity: 87, avgPrice: 15, waitTime: 7 },
      { id: 32, name: "土豆泥拌饭", rating: 4.7, popularity: 90, avgPrice: 13, waitTime: 6 },
      { id: 33, name: "小晨汤饼", rating: 4.5, popularity: 83, avgPrice: 13, waitTime: 8 },
      { id: 34, name: "苏式面", rating: 4.8, popularity: 92, avgPrice: 15, waitTime: 7 },
    ],
  },
};

// 定义标签类型
type ZoneTab = 'southFirst' | 'southSecond' | 'northFirst';

// 主题颜色
const theme = {
  primary: '#6366f1', // 靛蓝
  secondary: '#f97316', // 橙色
  success: '#10b981', // 绿色
  warning: '#f59e0b', // 黄色
  info: '#3b82f6', // 蓝色
  light: '#f8fafc',
  dark: '#1e293b',
  gray: '#64748b',
};

// 错误边界组件
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("组件错误:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center py-8 text-red-500">出现错误，请刷新页面重试。</div>;
    }

    return this.props.children;
  }
}

const CanteenWindowRecommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ZoneTab>('southFirst');

  // 窗口数据类型（内联定义，无需外部类型文件）
  type CanteenWindow = typeof cafeteriaWindows.south.floor1[0];

  // 根据窗口名称返回对应的图标（包含原有 + 新增菜品）
  const getWindowIcon = (name: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      // 原有菜品图标
      "小笼包": <span className="text-5xl">🥟</span>,
      "馋嘴砂锅": <span className="text-5xl">🍲</span>,
      "辣椒炒肉": <span className="text-5xl">🌶️</span>,
      "三汁焖锅": <span className="text-5xl">🥘</span>,
      "重庆小面": <span className="text-5xl">🍜</span>,
      "巴西烤肉饭": <span className="text-5xl">🍖</span>,
      "羊肉烩面": <span className="text-5xl">🍜</span>,
      "烧鸭饭": <span className="text-5xl">🦆</span>,
      "手工水饺": <span className="text-5xl">🥟</span>,
      "旋转小火锅": <span className="text-5xl">🍲</span>,
      "麻辣香锅": <span className="text-5xl">🌶️</span>,
      // 新增菜品图标
      "老友粉": <span className="text-5xl">🍜</span>,
      "轻食套餐": <span className="text-5xl">🥗</span>,
      "油泼面": <span className="text-5xl">🍜</span>,
      "土豆泥拌面": <span className="text-5xl">🍝</span>,
      "青岛风味": <span className="text-5xl">🦞</span>,
      "紫薯芋泥年糕": <span className="text-5xl">🍠</span>,
      "鸡丝拌粉": <span className="text-5xl">🍜</span>,
      "茶香鸡米饭": <span className="text-5xl">🍗</span>,
      "自选称重烤盘饭": <span className="text-5xl">🥘</span>,
      "鸭血粉丝汤": <span className="text-5xl">🍲</span>,
      "吊龙米线": <span className="text-5xl">🍜</span>,
      "石锅拌饭": <span className="text-5xl">🍚</span>,
      "沙茶面": <span className="text-5xl">🍜</span>,
      "蜀香烤鱼饭": <span className="text-5xl">🐟</span>,
      "京味小厨": <span className="text-5xl">🍲</span>,
      "隆江猪肘饭": <span className="text-5xl">🍖</span>,
      "面面俱到": <span className="text-5xl">🍜</span>,
      "四季稻香": <span className="text-5xl">🌾</span>,
      "小晨汤饼": <span className="text-5xl">🥟</span>,
      "苏式面": <span className="text-5xl">🍜</span>,
    };
    return iconMap[name] || <Utensils className="w-16 h-16 text-indigo-500" />;
  };

  // 根据当前标签获取对应数据
  const getCurrentData = () => {
    switch (activeTab) {
      case 'southFirst':
        return cafeteriaWindows.south.floor1;
      case 'southSecond':
        return cafeteriaWindows.south.floor2;
      case 'northFirst':
        return cafeteriaWindows.north.floor1;
      default:
        return [];
    }
  };

  // 计算当前楼层的统计数据
  const getFloorStats = (data: CanteenWindow[]) => {
    if (data.length === 0) return null;
    
    const avgRating = (data.reduce((sum, item) => sum + item.rating, 0) / data.length).toFixed(1);
    const avgWaitTime = Math.round(data.reduce((sum, item) => sum + item.waitTime, 0) / data.length);
    const avgPrice = Math.round(data.reduce((sum, item) => sum + item.avgPrice, 0) / data.length);
    const totalPopularity = data.reduce((sum, item) => sum + item.popularity, 0);
    
    return {
      avgRating,
      avgWaitTime,
      avgPrice,
      totalPopularity,
      windowCount: data.length,
      topWindow: data.reduce((max, item) => item.popularity > max.popularity ? item : max, data[0])
    };
  };

  // 生成雷达图数据
  const getRadarData = (item: CanteenWindow) => {
    return [
      { subject: '评分', value: item.rating * 20, fullMark: 100 },
      { subject: '人气', value: item.popularity, fullMark: 100 },
      { subject: '性价比', value: (25 - item.avgPrice) * 5, fullMark: 100 },
      { subject: '速度', value: (15 - item.waitTime) * 10, fullMark: 100 },
    ];
  };

  // 使用 useMemo 优化数据计算，避免重复计算
  const currentData = useMemo(() => getCurrentData(), [activeTab]);
  const floorStats = useMemo(() => getFloorStats(currentData), [currentData]);
  const sortedData = useMemo(() => [...currentData].sort((a, b) => b.popularity - a.popularity), [currentData]);
  
  // 生成评分分布数据
  const ratingDistribution = useMemo(() => {
    const above45 = currentData.filter(item => item.rating >= 4.5).length;
    const below45 = currentData.filter(item => item.rating < 4.5).length;
    return [
      { name: '4.5分以上', value: above45 },
      { name: '4.5分以下', value: below45 }
    ];
  }, [currentData]);

  const renderWindowCard = (item: CanteenWindow) => (
    <div 
      key={item.id} 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-1"
    >
      {/* 卡片顶部插图区域 */}
      <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
        {getWindowIcon(item.name)}
      </div>
      
      <div className="p-5">
        {/* 名称和价格 */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
          <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">¥{item.avgPrice}</span>
        </div>
        
        {/* 评分和人气 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* 评分 */}
          <div>
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium">评分</span>
            </div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${item.rating * 20}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-yellow-600">{item.rating}</span>
            </div>
          </div>
          
          {/* 人气 */}
          <div>
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <Flame className="w-3 h-3 text-orange-500 mr-1" />
              <span className="font-medium">人气</span>
            </div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${item.popularity}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-orange-600">{item.popularity}%</span>
            </div>
          </div>
        </div>
        
        {/* 迷你雷达图 */}
        <div className="h-24 mb-3" key={`radar-${item.id}`}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={30} data={getRadarData(item)}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
              <Radar 
                name={item.name} 
                dataKey="value" 
                stroke={theme.primary} 
                fill={theme.primary} 
                fillOpacity={0.3} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {item.rating >= 4.8 && (
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
              <Star className="w-3 h-3 fill-green-600" />
              五星推荐
            </span>
          )}
          {item.waitTime <= 5 && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-blue-600" />
              快速取餐
            </span>
          )}
          {item.avgPrice <= 10 && (
            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-100 flex items-center gap-1">
              <DollarSign className="w-3 h-3 fill-purple-600" />
              经济实惠
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Utensils className="w-10 h-10" />
            食堂窗口推荐
          </h2>
          <p className="opacity-90">实时更新各窗口人气与等待时间，助你高效就餐</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('southFirst')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'southFirst' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📍 南区（曦园）一楼
          </button>
          <button
            onClick={() => setActiveTab('southSecond')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'southSecond' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📍 南区（曦园）二楼
          </button>
          <button
            onClick={() => setActiveTab('northFirst')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'northFirst' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📍 北区（晨园）
          </button>
        </div>

        {/* 楼层统计概览 */}
        {floorStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">平均评分</div>
                  <div className="text-2xl font-bold text-indigo-600">{floorStats.avgRating}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">平均等待</div>
                  <div className="text-2xl font-bold text-orange-600">{floorStats.avgWaitTime}分钟</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">平均价格</div>
                  <div className="text-2xl font-bold text-green-600">¥{floorStats.avgPrice}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">窗口数量</div>
                  <div className="text-2xl font-bold text-blue-600">20+</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 热门窗口统计 */}
        {floorStats && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              楼层热门窗口
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 热门窗口柱状图 - 添加key确保重新渲染 */}
              <div className="h-48" key={`bar-chart-${activeTab}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }} 
                      angle={-45} 
                      textAnchor="end" 
                      height={60} 
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Bar dataKey="popularity" radius={[4, 4, 0, 0]}>
                      {sortedData.map((entry, index) => (
                        <Cell 
                          key={`cell-${entry.id}`} 
                          fill={index === 0 ? theme.secondary : theme.primary} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* 热门窗口详情 */}
              <div className="flex flex-col justify-center">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-500 mb-1">当前最热门</div>
                  <div className="text-2xl font-bold text-gray-800">{floorStats.topWindow.name}</div>
                  <div className="text-sm text-gray-500 mt-1">人气 {floorStats.topWindow.popularity}%</div>
                </div>
                
                {/* 评分分布饼图 - 添加key确保重新渲染 */}
                <div className="h-32" key={`pie-chart-${activeTab}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ratingDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {/* Cell数量与数据项数量匹配 */}
                        {ratingDistribution.map((_, index) => (
                          <Cell 
                            key={`pie-cell-${index}`} 
                            fill={index === 0 ? theme.success : theme.warning} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid - 一行四个 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentData.map(renderWindowCard)}
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-400 text-sm">
          <p>以上数据综合自「晨曦食记」公众号与问卷调查统计</p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CanteenWindowRecommendations;
