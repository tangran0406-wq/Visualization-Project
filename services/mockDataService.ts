
import { ArrivalItem, CrowdData, WeeklyStoryData, ZoneRecommendations } from '../types';

export const MOCK_DATA = {
    arrivals: [
        { id: 1, name: "春日樱花气泡水", location: "二楼饮品吧", rating: 4.8, tags: ["限时", "颜值爆表"], image: "🌸" },
        { id: 2, name: "藤椒乌鱼片", location: "一楼川湘窗口", rating: 4.6, tags: ["麻辣鲜香", "下饭神器"], image: "🐟" },
        { id: 3, name: "低卡荞麦冷面", location: "一楼轻食档", rating: 4.9, tags: ["减脂", "清凉"], image: "🍜" },
    ] as ArrivalItem[],

    takeoutComparison: [
        { name: '平均价格', canteen: 18, takeout: 28 },
        { name: '平均送达(分)', canteen: 5, takeout: 40 },
        { name: '食品安全指数', canteen: 95, takeout: 75 },
        { name: '热量超标率(%)', canteen: 30, takeout: 85 },
    ],

    popularCanteen: [
        { name: '一楼-自选餐线', value: 95, color: '#10B981' },
        { name: '一楼-麻辣香锅', value: 88, color: '#F59E0B' },
        { name: '二楼-特色小炒', value: 82, color: '#3B82F6' },
    ],

    popularTakeout: [
        { name: '疯狂星期四炸鸡', value: 92, color: '#F43F5E' },
        { name: '老王猪脚饭', value: 85, color: '#8B5CF6' },
        { name: '蜜雪冰城', value: 98, color: '#EC4899' },
    ],

    nicheTakeout: [
        { name: '奶奶家的红烧肉', sales: 120, rating: 4.9, desc: "月销虽少，但全是回头客" },
        { name: '素食主义沙拉', sales: 85, rating: 5.0, desc: "隐藏在巷子里的神仙草料" },
    ],

    crowd: [
        { time: '11:00', load: 20 },
        { time: '11:30', load: 60 },
        { time: '12:00', load: 100 },
        { time: '12:30', load: 85 },
        { time: '13:00', load: 40 },
        { time: '17:30', load: 70 },
        { time: '18:00', load: 90 },
    ] as CrowdData[],

    weeklyStory: {
        totalCalories: 14500,
        topDish: "麻婆豆腐盖饭",
        topDishCount: 5,
        keywords: ["重口味", "碳水狂魔", "夜宵达人"],
        weeklyIdeally: [
            {
                day: 'Monday', date: '周一', theme: '元气减脂', themeColor: 'emerald', mood: '💪', totalCal: 1400,
                breakfast: { name: '全麦面包 + 黑咖啡', cal: 300, desc: '消除周末水肿', recommendationRate: 95 },
                lunch: { name: '清蒸龙利鱼 + 杂粮饭', cal: 500, desc: '一楼减脂窗口', recommendationRate: 98 },
                dinner: { name: '白灼菜心 + 玉米段', cal: 300, desc: '清淡刮油', recommendationRate: 92 },
                tips: '周一综合症需要清淡饮食来唤醒身体，多喝水！'
            },
            {
                day: 'Tuesday', date: '周二', theme: '高效蛋白', themeColor: 'blue', mood: '⚡', totalCal: 1600,
                breakfast: { name: '水煮蛋 + 豆浆', cal: 250, desc: '优质蛋白补充', recommendationRate: 90 },
                lunch: { name: '小炒黄牛肉 + 米饭', cal: 700, desc: '二楼特色小炒', recommendationRate: 88 },
                dinner: { name: '鸡胸肉沙拉', cal: 350, desc: '轻食补给', recommendationRate: 94 },
                tips: '今天课程较满，中午吃点牛肉补充精力，下午不犯困。'
            },
            {
                day: 'Wednesday', date: '周三', theme: '快乐碳水', themeColor: 'amber', mood: '😋', totalCal: 1800,
                breakfast: { name: '肉包子 + 小米粥', cal: 400, desc: '传统中式早餐', recommendationRate: 85 },
                lunch: { name: '土豆泥拌面 (网红)', cal: 915, desc: '一楼必吃！碳水炸弹', recommendationRate: 99 },
                dinner: { name: '番茄鸡蛋汤', cal: 150, desc: '中午吃多了晚上平衡一下', recommendationRate: 80 },
                tips: '周三小周末，中午吃顿好的犒劳自己，那碗面虽然热量高但是真香！'
            },
            {
                day: 'Thursday', date: '周四', theme: '麻辣鲜香', themeColor: 'orange', mood: '🌶️', totalCal: 1700,
                breakfast: { name: '燕麦片 + 牛奶', cal: 300, desc: '简单快速', recommendationRate: 88 },
                lunch: { name: '麻辣香锅 (微辣)', cal: 800, desc: '多点素菜少点油', recommendationRate: 92 },
                dinner: { name: '素三鲜水饺', cal: 400, desc: '二楼面食档', recommendationRate: 85 },
                tips: '想吃辣的时候可以选择香锅，记得把油沥干一点再吃哦。'
            },
            {
                day: 'Friday', date: '周五', theme: '放纵时刻', themeColor: 'rose', mood: '🎉', totalCal: 2200,
                breakfast: { name: '油条 + 豆腐脑', cal: 450, desc: '偶尔放纵', recommendationRate: 75 },
                lunch: { name: '红烧肉盖饭', cal: 950, desc: '肥而不腻大满足', recommendationRate: 90 },
                dinner: { name: '炸鸡腿 + 快乐水', cal: 800, desc: '迎接周末！', recommendationRate: 85 },
                tips: '辛苦一周了，今天热量不设限！吃饱了才有力气过周末。'
            },
            {
                day: 'Saturday', date: '周六', theme: '甚至想点外卖', themeColor: 'purple', mood: '🛵', totalCal: 1900,
                breakfast: { name: '睡到自然醒', cal: 0, desc: 'Brunch走起', recommendationRate: 100 },
                lunch: { name: '外卖: 猪脚饭', cal: 850, desc: '外卖红榜第一名', recommendationRate: 88 },
                dinner: { name: '水果捞', cal: 400, desc: '补充维生素', recommendationRate: 92 },
                tips: '周末食堂人少，其实二楼的瓦罐汤很适合今天去喝。'
            },
            {
                day: 'Sunday', date: '周日', theme: '轻断食', themeColor: 'gray', mood: '🧘', totalCal: 1200,
                breakfast: { name: '美式咖啡', cal: 10, desc: '消肿利尿', recommendationRate: 90 },
                lunch: { name: '杂粮煎饼 (不加脆)', cal: 400, desc: '一楼面点', recommendationRate: 85 },
                dinner: { name: '黄瓜 + 苹果', cal: 200, desc: '准备迎接周一', recommendationRate: 95 },
                tips: '通过轻断食减轻肠胃负担，为新的一周做准备。'
            },
        ]
    } as WeeklyStoryData,

    canteenRecommendations: {
        southFirst: [
            { id: 101, name: "滑蛋牛肉饭", price: 18, rating: 4.8, stall: "港式烧腊", tags: ["嫩滑", "排队王"], description: "鸡蛋嫩滑如豆花，牛肉分量足，酱汁拌饭一绝。", image: "🍛" },
            { id: 102, name: "大盘鸡拌面", price: 22, rating: 4.7, stall: "西北面食", tags: ["量大", "微辣"], description: "手工宽面劲道，土豆软糯入味，适合男生。", image: "🍜" },
            { id: 103, name: "糖醋里脊套餐", price: 16, rating: 4.5, stall: "大众自选", tags: ["酸甜", "经典"], description: "外酥里嫩，酸甜汁浓稠适中，性价比之王。", image: "🍖" },
        ],
        southSecond: [
            { id: 201, name: "石锅拌饭", price: 20, rating: 4.9, stall: "韩式料理", tags: ["滋滋响", "锅巴"], description: "配菜丰富有五六种，底下的锅巴焦香酥脆。", image: "🍲" },
            { id: 202, name: "铁板黑椒牛柳", price: 25, rating: 4.6, stall: "铁板烧", tags: ["现做", "热气腾腾"], description: "现场炒制，烟火气十足，黑椒味浓郁。", image: "🥩" },
            { id: 203, name: "瓦罐煨汤 (莲藕排骨)", price: 8, rating: 4.8, stall: "江西煨汤", tags: ["养生", "鲜美"], description: "熬足4小时，汤色浓白，莲藕粉糯拉丝。", image: "🥘" },
        ],
        north: [
            { id: 301, name: "麻辣烫 (称重)", price: 18, rating: 4.7, stall: "北区自选", tags: ["自由搭配", "骨汤"], description: "北区排队最长的窗口，骨汤底很鲜，芝麻酱纯。", image: "🥣" },
            { id: 302, name: "脆皮烤鸭饭", price: 22, rating: 4.6, stall: "烧腊档", tags: ["皮脆肉嫩", "赠例汤"], description: "鸭皮烤得枣红油亮，一口下去油脂爆香。", image: "🦆" },
            { id: 303, name: "手工水饺 (玉米猪肉)", price: 15, rating: 4.5, stall: "北方面点", tags: ["现包", "皮薄馅大"], description: "阿姨现包现煮，玉米粒清甜，有家的味道。", image: "🥟" },
        ]
    } as ZoneRecommendations
};
