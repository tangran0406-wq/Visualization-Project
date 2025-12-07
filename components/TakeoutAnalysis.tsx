import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import { 
  Utensils, Store, Users, BarChart3, TrendingUp, DollarSign, 
  Award, ThumbsUp, Clock, Star, Sparkles
} from 'lucide-react';

// 食堂数据
const cafeteriaWindows = {
  south: {
    floor1: [
      { id: 1, name: "小笼包", rating: 4.8, popularity: 92, avgPrice: 6, waitTime: 8 },
      { id: 2, name: "馋嘴砂锅", rating: 4.5, popularity: 85, avgPrice: 12, waitTime: 7 },
      { id: 3, name: "辣椒炒肉", rating: 4.6, popularity: 78, avgPrice: 12, waitTime: 8 },
      { id: 4, name: "三汁焖锅", rating: 4.6, popularity: 78, avgPrice: 12, waitTime: 9 },
    ],
    floor2: [
      { id: 5, name: "重庆小面", rating: 4.7, popularity: 88, avgPrice: 13, waitTime: 5 },
      { id: 6, name: "巴西烤肉饭", rating: 4.9, popularity: 95, avgPrice: 13, waitTime: 6 },
      { id: 7, name: "羊肉烩面", rating: 4.6, popularity: 83, avgPrice: 13, waitTime: 5 },
      { id: 8, name: "烧鸭饭", rating: 4.6, popularity: 78, avgPrice: 16, waitTime: 6 },
    ],
  },
  north: {
    floor1: [
      { id: 9, name: "手工水饺", rating: 4.7, popularity: 82, avgPrice: 10, waitTime: 9 },
      { id: 10, name: "台湾卤肉饭", rating: 4.6, popularity: 80, avgPrice: 12, waitTime: 5 },
      { id: 11, name: "旋转小火锅", rating: 4.8, popularity: 90, avgPrice: 20, waitTime: 10 },
      { id: 12, name: "麻辣香锅", rating: 4.6, popularity: 78, avgPrice: 15, waitTime: 8 },
    ],
  },
};

// 外卖数据
const deliveryStores = [
  { id: 1, name: "肯德基宅急送", rating: 4.9, popularity: 4000, avgPrice: 33, deliveryTime: 35, recommendRate: 96 },
  { id: 2, name: "隆江猪肘饭", rating: 4.8, popularity: 4000, avgPrice: 16, deliveryTime: 42, recommendRate: 94 },
  { id: 3, name: "状元府烤肉拌饭", rating: 4.9, popularity: 3000, avgPrice: 13, deliveryTime: 50, recommendRate: 95 },
  { id: 4, name: "最高鸡密", rating: 4.8, popularity: 2000, avgPrice: 10, deliveryTime: 53, recommendRate: 92 },
  { id: 5, name: "华莱士·全鸡汉堡", rating: 4.7, popularity: 2000, avgPrice: 21, deliveryTime: 29, recommendRate: 90 },
  { id: 6, name: "哆味记·干锅排骨烤鸭饭", rating: 4.9, popularity: 1000, avgPrice: 18, deliveryTime: 45, recommendRate: 96 },
];

// 组织食堂数据
const canteenSections = [
  {
    name: "晨园一楼",
    items: cafeteriaWindows.north.floor1.map(w => ({...w, canteen: "晨园一楼"})),
    color: "#f97316"
  },
  {
    name: "曦园一楼",
    items: cafeteriaWindows.south.floor1.map(w => ({...w, canteen: "曦园一楼"})),
    color: "#10B981"
  },
  {
    name: "曦园二楼",
    items: cafeteriaWindows.south.floor2.map(w => ({...w, canteen: "曦园二楼"})),
    color: "#6366f1"
  }
];

// 统一配色方案
const colors = {
  canteen: {
    primary: "#f97316", // 橙色
    secondary: "#fb923c",
    light: "#ffedd5",
    area: "rgba(249, 115, 22, 0.1)"
  },
  delivery: {
    primary: "#3b82f6", // 蓝色
    secondary: "#60a5fa",
    light: "#dbeafe",
    area: "rgba(59, 130, 246, 0.1)"
  },
  background: {
    card: "#ffffff",
    chart: "#f8fafc",
    grid: "#e2e8f0"
  },
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    light: "#94a3b8"
  }
};

// 雷达图数据
const radarData = [
  { subject: "价格实惠", 食堂: 95, 外卖: 70 },
  { subject: "速度快捷", 食堂: 90, 外卖: 65 },
  { subject: "口味质量", 食堂: 82, 外卖: 85 },
  { subject: "便利程度", 食堂: 75, 外卖: 98 },
  { subject: "选择丰富", 食堂: 70, 外卖: 95 },
  { subject: "环境舒适", 食堂: 70, 外卖: 90 },
];

// 趋势数据
const trendData = [
  { time: "周一", 食堂: 520, 外卖: 180 },
  { time: "周二", 食堂: 480, 外卖: 220 },
  { time: "周三", 食堂: 510, 外卖: 190 },
  { time: "周四", 食堂: 490, 外卖: 210 },
  { time: "周五", 食堂: 460, 外卖: 240 },
  { time: "周六", 食堂: 280, 外卖: 420 },
  { time: "周日", 食堂: 250, 外卖: 450 },
];

// 价格分布数据
const priceDistribution = [
  { range: "0-10元", 食堂: 3, 外卖: 1 },
  { range: "10-20元", 食堂: 5, 外卖: 3 },
  { range: "20-30元", 食堂: 1, 外卖: 1 },
  { range: "30元+", 食堂: 0, 外卖: 1 },
];

// 占比数据
const pieData = [
  { name: "食堂", value: 68, color: colors.canteen.primary },
  { name: "外卖", value: 32, color: colors.delivery.primary }
];

// 推荐率对比数据
const recommendationData = [
  ...[...cafeteriaWindows.south.floor1, ...cafeteriaWindows.south.floor2, ...cafeteriaWindows.north.floor1]
    .slice(0, 6)
    .map(item => ({
      name: item.name,
      推荐率: item.popularity,
      type: "食堂"
    })),
  ...deliveryStores.slice(0, 6).map(item => ({
    name: item.name,
    推荐率: item.recommendRate,
    type: "外卖"
  }))
].sort((a, b) => b.推荐率 - a.推荐率);

// 自定义Tooltip组件
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="flex items-center gap-2 text-sm" style={{ color: entry.color }}>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="font-medium">{entry.name}:</span>
            <span className="text-gray-700">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TakeoutAnalysis: React.FC = () => (
  <div className="space-y-8 animate-fade-in">
    {/* 核心对比卡片 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-800">食堂概况</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">平均价格</span>
              <span className="font-bold text-orange-600">¥15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">等待时间</span>
              <span className="font-bold text-orange-600">7分钟</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">综合评分</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-orange-600">4.7</span>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">窗口数量</span>
              <span className="font-bold text-orange-600">70+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">选择占比</span>
              <span className="font-bold text-orange-600">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">满意度</span>
              <span className="font-bold text-orange-600">92%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-800">外卖概况</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">平均价格</span>
              <span className="font-bold text-blue-600">¥19</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">配送时间</span>
              <span className="font-bold text-blue-600">39分钟</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">综合评分</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-blue-600">4.7</span>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">商家数量</span>
              <span className="font-bold text-blue-600">100+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">选择占比</span>
              <span className="font-bold text-blue-600">32%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">满意度</span>
              <span className="font-bold text-blue-600">88%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* 选择分布饼图 - 缩小版 */}
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Users className="w-4 h-4 text-purple-500" />
      选择分布
    </h3>
    <div className="h-52 flex items-center justify-center"> {/* 减小高度：h-72 → h-52 */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={45} 
            outerRadius={70} 
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={{ stroke: colors.text.light, strokeWidth: 1 }}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* 多维度对比雷达图 - 缩小版 */}
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
      <BarChart3 className="w-4 h-4 text-orange-500" />
      多维度综合对比
    </h3>
    <div className="h-52"> {/* 减小高度：h-72 → h-52 */}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid stroke={colors.background.grid} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: colors.text.secondary, fontSize: 10 }} 
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: colors.text.light, fontSize: 8 }} 
          />
          <Radar 
            name="食堂" 
            dataKey="食堂" 
            stroke={colors.canteen.primary} 
            fill={colors.canteen.primary} 
            fillOpacity={0.5} 
            animationDuration={1500}
          />
          <Radar 
            name="外卖" 
            dataKey="外卖" 
            stroke={colors.delivery.primary} 
            fill={colors.delivery.primary} 
            fillOpacity={0.5} 
            animationDuration={1500}
          />
          <Legend 
            verticalAlign="bottom" 
            height={30} 
            wrapperStyle={{ paddingTop: 5, fontSize: '0.75rem' }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* 一周趋势图 - 保持不变 */}
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
      <TrendingUp className="w-4 h-4 text-green-500" />
      一周使用趋势
    </h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="colorCanteen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.canteen.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.canteen.primary} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.delivery.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.delivery.primary} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.background.grid} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: colors.text.secondary }}
          />
          <YAxis 
            tick={{ fill: colors.text.secondary }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="食堂" 
            stroke={colors.canteen.primary} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCanteen)" 
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="外卖" 
            stroke={colors.delivery.primary} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorDelivery)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

    {/* 价格分布和推荐率对比 - 优化版 */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 价格区间分布 */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          价格区间分布
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.background.grid} />
              <XAxis 
                dataKey="range" 
                tick={{ fill: colors.text.secondary }}
              />
              <YAxis 
                tick={{ fill: colors.text.secondary }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="食堂" 
                fill={colors.canteen.primary} 
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="外卖" 
                fill={colors.delivery.primary} 
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 推荐率对比 */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-pink-500" />
          推荐率对比（Top 12）
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recommendationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.background.grid} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: colors.text.secondary }} 
                angle={-45} 
                textAnchor="end" 
                height={70} 
              />
              <YAxis 
                tick={{ fill: colors.text.secondary }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="推荐率" 
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {recommendationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.type === "食堂" ? colors.canteen.primary : colors.delivery.primary} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

        {/* 核心优势分析 - 缩小版 */}
    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
        <Award className="w-3 h-3 text-purple-500" />
        核心优势分析
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
            <Utensils className="w-3 h-3 text-orange-500" />
            食堂核心优势
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg hover:shadow-sm transition-shadow duration-200">
              <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                <DollarSign className="w-2 h-2 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-800">性价比高</div>
                <div className="text-xs text-gray-600 mt-0.5">平均价格比外卖低26%</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg hover:shadow-sm transition-shadow duration-200">
              <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                <Clock className="w-2 h-2 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-800">速度快捷</div>
                <div className="text-xs text-gray-600 mt-0.5">平均等待时间仅7分钟</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg hover:shadow-sm transition-shadow duration-200">
              <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                <Users className="w-2 h-2 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-800">社交体验</div>
                <div className="text-xs text-gray-600 mt-0.5">就餐环境更舒适，适合交流</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
            <Store className="w-3 h-3 text-blue-500" />
            外卖核心优势
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg hover:shadow-sm transition-shadow duration-200">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <Sparkles className="w-2 h-2 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-800">便利程度高</div>
                <div className="text-xs text-gray-600 mt-0.5">送餐上门，无需亲自前往</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg hover:shadow-sm transition-shadow duration-200">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <BarChart3 className="w-2 h-2 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-800">选择丰富</div>
                <div className="text-xs text-gray-600 mt-0.5">100+商家可供选择</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg hover:shadow-sm transition-shadow duration-200">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <Star className="w-2 h-2 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-800">口味质量</div>
                <div className="text-xs text-gray-600 mt-0.5">专业餐饮品质，种类多样</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* 外卖红榜 */}
    <div>
      <h3 className="font-bold text-xl text-gray-800 mb-4">外卖红榜</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveryStores.map((store, idx) => (
          <div key={store.id} className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center hover:shadow-md transition-shadow duration-300">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-gray-800">{store.name}</h4>
              </div>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span>{store.rating}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{store.deliveryTime}分钟</span>
                </div>
                <div>
                  <span>¥{store.avgPrice}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">月销 {store.popularity}</div>
              <div className="text-green-500 font-bold">{store.recommendRate}% 推荐</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TakeoutAnalysis;
