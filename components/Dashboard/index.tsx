import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import './style.css';

// --- 类型定义 ---
interface DishData {
    name: string;
    score: number;
}

// 定义卡片展示所需的数据结构
interface DishCardItem {
    id: number;
    name: string;
    price: string;
    location: string;
    score: number;       // 评分 (10分制)
    popularity: number;  // 人气 (百分比)
    imgUrl: string;
}

const Dashboard: React.FC = () => {
    // --- Refs for ECharts ---
    const timeChartRef = useRef<HTMLDivElement>(null);
    const rankChartRef = useRef<HTMLDivElement>(null);
    const radarChartRef = useRef<HTMLDivElement>(null);
    const scatterChartRef = useRef<HTMLDivElement>(null);

    // --- 数据准备：将原代码中的 HTML 内容转化为结构化数据 ---
    const dishList: DishCardItem[] = [
        // 冬日暖食系列
        { id: 1, name: '曦园香辣蟹', price: '¥38', location: '一食堂·15号窗', score: 9.9, popularity: 92, imgUrl: '/picture/香辣蟹.jpg' },
        { id: 2, name: '青椒烤鱼饭', price: '¥16', location: '二食堂·5号窗', score: 9.4, popularity: 88, imgUrl: '/picture/青椒烤鱼饭.jpg' },
        { id: 3, name: '润肺冰糖雪梨', price: '¥6', location: '二食堂·汤饼档', score: 9.5, popularity: 83, imgUrl: '/picture/冰糖雪梨.jpg' },
        // 鲜味预警系列
        { id: 4, name: '白灼海捕大虾', price: '¥32', location: '二食堂·炸鸡窗', score: 9.8, popularity: 90, imgUrl: '/picture/白灼大虾.jpg' },
        { id: 5, name: '酸甜茄汁大虾', price: '¥1.5', location: '二食堂·炸鸡窗', score: 9.6, popularity: 85, imgUrl: '/picture/茄汁大虾.jpg' },
        { id: 6, name: '秘制紫苏鸭腿', price: '¥8', location: '10号烤鸭窗', score: 9.7, popularity: 96, imgUrl: '/picture/紫苏鸭腿.jpg' },
        // 南北风味系列
        { id: 7, name: '潮汕蚝烙煎', price: '¥15', location: '二食堂·6号窗', score: 9.5, popularity: 82, imgUrl: '/picture/蚝烙煎.jpg' },
        { id: 8, name: '蟹黄小笼包', price: '¥10', location: '一食堂·6号窗', score: 9.2, popularity: 95, imgUrl: '/picture/蟹黄小笼包.jpg' },
        { id: 9, name: '川味水煮肉片', price: '¥12', location: '一食堂·2号窗', score: 9.6, popularity: 89, imgUrl: '/picture/水煮肉片.jpg' },
    ];

    useEffect(() => {
        // --- 1. 时间趋势图 (ECharts Logic) ---
        let timeChart: echarts.ECharts | undefined;
        if (timeChartRef.current) {
            timeChart = echarts.init(timeChartRef.current);
            const option = {
                tooltip: { trigger: 'axis' },
                grid: { top: 30, right: 30, left: 50, bottom: 20, containLabel: true },
                xAxis: { type: 'category', boundaryGap: false, data: ['6:30', '7:00', '7:30', '8:00', '9:00', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '17:00', '17:30', '18:00', '19:00'] },
                yAxis: { type: 'value', max: 100, name: '拥挤度(%)' },
                visualMap: { show: false, pieces: [{ lte: 40, color: '#22c55e' }, { gt: 40, lte: 80, color: '#f97316' }, { gt: 80, color: '#ef4444' }] },
                series: [{ 
                    data: [10, 40, 85, 60, 20, 15, 20, 35, 95, 100, 90, 40, 50, 85, 90, 30], 
                    type: 'line', smooth: true, areaStyle: { opacity: 0.2 },
                    markArea: { itemStyle: { color: 'rgba(255, 173, 177, 0.4)' }, data: [ [{ name: '避雷', xAxis: '11:30' }, { xAxis: '12:00' }] ] }
                }]
            };
            timeChart.setOption(option as any);
        }

        // --- 2. 推荐排行榜 ---
        let rankChart: echarts.ECharts | undefined;
        if (rankChartRef.current) {
            rankChart = echarts.init(rankChartRef.current);
            const data: DishData[] = [
                {name: '曦园香辣蟹', score: 9.9},
                {name: '潮汕蚝烙煎', score: 9.8},
                {name: '白灼海捕大虾', score: 9.6},
                {name: '润肺冰糖雪梨', score: 9.5},
                {name: '青椒烤鱼饭', score: 9.4},   
                {name: '蟹黄小笼包', score: 9.2}
            ];
            
            const option = {
                title: { text: '🏆 12月综合推荐指数 Top 6', left: 'center' },
                tooltip: { trigger: 'axis', formatter: (params: any) => `<b>${params[0].name}</b><br/>综合评分：${params[0].value}` },
                grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
                xAxis: { type: 'value', max: 10, splitLine: {show: false} },
                yAxis: { type: 'category', data: data.map(i => i.name).reverse(), axisLabel: { interval: 0 } },
                series: [{
                    type: 'bar',
                    data: data.map(i => i.score).reverse(),
                    // 调整为橙色渐变，呼应新主题
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#ea580c' }]), borderRadius: [0, 4, 4, 0] },
                    label: { show: true, position: 'right', formatter: '{@score}分' },
                    barWidth: '50%'
                }]
            };
            rankChart.setOption(option as any);
        }

        // --- 3. 雷达图 ---
        let radarChart: echarts.ECharts | undefined;
        if (radarChartRef.current) {
            radarChart = echarts.init(radarChartRef.current);
            const option = {
                title: { text: '⭐ 本周之星：潮汕蚝烙煎', left: 'center', bottom: 10, textStyle: { fontSize: 15, fontWeight: 'bold', color: '#ea580c' } },
                tooltip: {},
                radar: {
                    indicator: [
                        { name: '口味', max: 100 },
                        { name: '分量', max: 100 },
                        { name: '不排队', max: 100 },
                        { name: '性价比', max: 100 },
                        { name: '健康度', max: 100 }
                    ],
                    radius: '60%',
                    center: ['50%', '50%'],
                    axisName: { color: '#666' }
                },
                series: [{
                    type: 'radar',
                    data: [{
                        value: [95, 80, 40, 85, 90],
                        name: '潮汕蚝烙煎',
                        areaStyle: { color: 'rgba(234, 88, 12, 0.2)' },
                        itemStyle: { color: '#ea580c' },
                        lineStyle: { width: 2 }
                    }]
                }]
            };
            radarChart.setOption(option as any);
        }

        // --- 4. 散点图 ---
        let scatterChart: echarts.ECharts | undefined;
        if (scatterChartRef.current) {
            scatterChart = echarts.init(scatterChartRef.current);
            const data = [
                [15, 9.8, 80, '潮汕蚝烙煎'],
                [32, 9.6, 60, '白灼海捕大虾'],
                [8, 9.4, 90, '秘制紫苏鸭腿'],
                [10, 9.2, 75, '蟹黄小笼包'],
                [12, 8.9, 70, '川味水煮肉片'],
                [38, 9.9, 90, '曦园香辣蟹'],  
                [16, 9.4, 85, '青椒烤鱼饭'],   
                [6, 9.5, 70, '润肺冰糖雪梨']   
            ];

            const option = {
                title: { 
                    text: '💰 价格 vs 评分 分布图', 
                    subtext: '右上区: 贵但好吃 / 左上区: 宝藏性价比',
                    itemGap: 10
                },
                grid: { top: 70, right: 30, bottom: 30, left: 40, containLabel: true },
                tooltip: {
                    formatter: function (param: any) {
                        return `<b>${param.data[3]}</b><br/>价格: ¥${param.data[0]}<br/>综合评分: ${param.data[1]}`;
                    }
                },
                xAxis: { type: 'value', name: '价格', splitLine: { lineStyle: { type: 'dashed' } } },
                yAxis: { type: 'value', name: '评分', min: 7, max: 10, splitLine: { lineStyle: { type: 'dashed' } } },
                series: [{
                    type: 'scatter',
                    symbolSize: function (data: any) { return data[2] / 1.5; },
                    data: data,
                    itemStyle: { 
                        color: (p: any) => p.data[0]<15 && p.data[1]>9 ? '#ea580c' : '#4f46e5', // 橙色/紫色区分
                        shadowBlur: 5,
                        shadowColor: 'rgba(0,0,0,0.2)'
                    },
                    label: { show: true, formatter: (p: any) => p.data[3], position: 'top', fontSize: 10, color: '#666' }
                }]
            };
            scatterChart.setOption(option as any);
        }

        const handleResize = () => {
            timeChart?.resize();
            rankChart?.resize();
            radarChart?.resize();
            scatterChart?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            timeChart?.dispose();
            rankChart?.dispose();
            radarChart?.dispose();
            scatterChart?.dispose();
        };
    }, []);

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <div className="header-container">
                    <div className="logo">
                        <h1>智慧食堂数据看板</h1>
                        <span>Data Visualization Dashboard</span>
                    </div>
                    <nav className="dashboard-nav">
                        <ul>
                            <li><a href="#trend">拥挤趋势</a></li>
                            <li><a href="#analysis">数据分析</a></li>
                            <li><a href="#details">新品详情</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <section className="hero-section">
                <div className="hero-content">
                    <h1>从数据看美食，用理性选午餐</h1>
                    <p>食堂 12 月新品全维度测评报告</p>
                </div>
            </section>

            <div className="page-container">
                
                {/* --- 区域 1: 趋势图 --- */}
                <div className="section-card" id="trend">
                    <h2 className="section-title">食堂拥挤度趋势监测 & 就餐建议</h2>
                    <div ref={timeChartRef} className="full-width" style={{height: '350px'}}></div>
                    <div className="trend-tips">
                        <div className="tip-card">
                            <h4 style={{color:'#ef4444'}}>🔴 下课高峰</h4>
                            <p>11:30 - 12:15 是教学楼下课洪峰，排队耗时 15-20 分钟。</p>
                        </div>
                        <div className="tip-card">
                            <h4 style={{color:'#22c55e'}}>🟢 黄金时段</h4>
                            <p><strong>10:45 - 11:15</strong>：菜品刚出锅，最新鲜，几乎不用排队！</p>
                        </div>
                        <div className="tip-card">
                            <h4 style={{color:'#f97316'}}>🟠 晚餐策略</h4>
                            <p>17:30 是运动/社团活动结束高峰。推荐 17:00 提前就餐。</p>
                        </div>
                    </div>
                </div>

                {/* --- 区域 2: 数据分析图表 (排行/雷达/散点) --- */}
                <div className="section-card" id="analysis">
                    <h2 className="section-title">
                        12月新品推荐综合看板
                        <span style={{fontSize: '0.85rem', color: '#999', fontWeight: 'normal', marginLeft: '10px'}}>(综合维度：口味 / 价格 / 营养 / 拥挤度)</span>
                    </h2>
                    
                    <div className="chart-grid">
                        <div className="chart-box">
                            <div ref={rankChartRef} style={{width: '100%', height: '100%'}}></div>
                        </div>

                        <div className="chart-box">
                            <div ref={radarChartRef} style={{width: '100%', height: '100%'}}></div>
                        </div>

                        <div className="chart-box full-width">
                            <div ref={scatterChartRef} style={{width: '100%', height: '100%'}}></div>
                        </div>
                    </div>
                </div>

                {/* --- 区域 3: 新品详情 (样式重构为卡片风格) --- */}
                <div className="section-card" id="details" style={{background: 'transparent', boxShadow: 'none', padding: 0}}>
                    <h2 className="section-title" style={{marginLeft: '10px'}}>新品图文详情</h2>
                    
                    {/* 使用 Grid 布局渲染单个卡片，而非原来的列表 */}
                    <div className="cards-grid">
                        {dishList.map((dish) => (
                            <div className="style-card" key={dish.id}>
                                {/* 上半部分：图片 */}
                                <div className="card-top">
                                    <img 
                                        src={dish.imgUrl} 
                                        alt={dish.name} 
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            if(target.parentElement) target.parentElement.innerText = '📷';
                                        }} 
                                    />
                                </div>

                                {/* 下半部分：信息 */}
                                <div className="card-body">
                                    <div className="card-header-row">
                                        <div className="dish-name">{dish.name}</div>
                                        <div className="price-capsule">{dish.price}</div>
                                    </div>

                                    {/* 评分进度条 (黄色) */}
                                    <div className="stat-row">
                                        <span className="stat-icon">⭐</span>
                                        <span className="stat-label">评分</span>
                                        <div className="progress-track">
                                            <div className="progress-bar bar-yellow" style={{width: `${(dish.score / 10) * 100}%`}}></div>
                                        </div>
                                        <span className="stat-value val-yellow">{dish.score}</span>
                                    </div>

                                    {/* 人气进度条 (橙色) */}
                                    <div className="stat-row">
                                        <span className="stat-icon">🔥</span>
                                        <span className="stat-label">人气</span>
                                        <div className="progress-track">
                                            <div className="progress-bar bar-orange" style={{width: `${dish.popularity}%`}}></div>
                                        </div>
                                        <span className="stat-value val-orange">{dish.popularity}%</span>
                                    </div>
                                    
                                    <div style={{fontSize: '0.8rem', color: '#9ca3af', marginTop: '8px', textAlign: 'right'}}>
                                        📍 {dish.location}
                                    </div>

                                    {/* 装饰性小雷达图 (纯CSS/SVG模拟) */}
                                    <div className="card-footer-radar">
                                        <svg width="40" height="40" viewBox="0 0 100 100">
                                            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="rgba(79, 70, 229, 0.05)" stroke="#4f46e5" strokeWidth="1" />
                                            <polygon points="50,25 75,38 75,62 50,75 25,62 25,38" fill="rgba(79, 70, 229, 0.2)" stroke="none" />
                                            <line x1="50" y1="10" x2="50" y2="90" stroke="#e5e7eb" strokeWidth="1" />
                                            <line x1="10" y1="30" x2="90" y2="70" stroke="#e5e7eb" strokeWidth="1" />
                                            <line x1="90" y1="30" x2="10" y2="70" stroke="#e5e7eb" strokeWidth="1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;