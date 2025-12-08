import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import './style.css';

// 这是一个 TypeScript 接口，如果不严谨可以去掉
interface DishData {
    name: string;
    score: number;
}

const Dashboard: React.FC = () => {
    // 使用 useRef 来引用 DOM 节点，比 getElementById 在 React 中更安全
    const timeChartRef = useRef<HTMLDivElement>(null);
    const rankChartRef = useRef<HTMLDivElement>(null);
    const radarChartRef = useRef<HTMLDivElement>(null);
    const scatterChartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // --- 1. 时间趋势图 ---
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
                tooltip: { 
                    trigger: 'axis', 
                    formatter: (params: any) => {
                        const item = data[data.length - 1 - params[0].dataIndex];
                        return `<b>${item.name}</b><br/>综合评分：${item.score}`;
                    }
                },
                grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
                xAxis: { type: 'value', max: 10, splitLine: {show: false} },
                yAxis: { type: 'category', data: data.map(i => i.name).reverse(), axisLabel: { interval: 0 } },
                series: [{
                    type: 'bar',
                    data: data.map(i => i.score).reverse(),
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#f0a500' }, { offset: 1, color: '#980a0e' }]), borderRadius: [0, 4, 4, 0] },
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
                title: { text: '⭐ 本周之星：潮汕蚝烙煎', left: 'center', bottom: 10, textStyle: { fontSize: 15, fontWeight: 'bold', color: '#980a0e' } },
                tooltip: {},
                radar: {
                    indicator: [
                        { name: '口味', max: 100 },
                        { name: '分量', max: 100 },
                        { name: '不需要排队', max: 100 },
                        { name: '性价比', max: 100 },
                        { name: '健康度', max: 100 }
                    ],
                    radius: '60%',
                    center: ['50%', '50%']
                },
                series: [{
                    type: 'radar',
                    data: [{
                        value: [95, 80, 40, 85, 90],
                        name: '潮汕蚝烙煎',
                        areaStyle: { color: 'rgba(152, 10, 14, 0.4)' },
                        itemStyle: { color: '#980a0e' },
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
                    itemGap: 15
                },
                grid: { top: 80, right: 50, bottom: 40, left: 50 },
                tooltip: {
                    formatter: function (param: any) {
                        return `<b>${param.data[3]}</b><br/>价格: ¥${param.data[0]}<br/>综合评分: ${param.data[1]}`;
                    }
                },
                xAxis: { type: 'value', name: '价格(元)', splitLine: { lineStyle: { type: 'dashed' } } },
                yAxis: { type: 'value', name: '推荐分', min: 7, max: 10, splitLine: { lineStyle: { type: 'dashed' } } },
                series: [{
                    type: 'scatter',
                    symbolSize: function (data: any) { return data[2] / 1.3; },
                    data: data,
                    itemStyle: { 
                        color: (p: any) => p.data[0]<15 && p.data[1]>9 ? '#f0a500' : '#980a0e', 
                        shadowBlur: 8,
                        shadowColor: 'rgba(0,0,0,0.2)'
                    },
                    label: { show: true, formatter: (p: any) => p.data[3], position: 'top', fontSize: 11 }
                }]
            };
            scatterChart.setOption(option as any);
        }

        // 监听窗口大小改变，重绘图表
        const handleResize = () => {
            timeChart?.resize();
            rankChart?.resize();
            radarChart?.resize();
            scatterChart?.resize();
        };
        window.addEventListener('resize', handleResize);

        // 组件卸载时清理
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
                
                <div className="section-card" id="trend">
                    <h2 className="section-title">食堂拥挤度趋势监测 & 就餐建议</h2>
                    {/* 使用 ref 绑定 DOM 元素 */}
                    <div ref={timeChartRef} className="full-width" style={{height: '380px'}}></div>
                    <div className="trend-tips">
                        <div className="tip-card">
                            <h4>🔴 下课高峰 (建议避开)</h4>
                            <p>11:30 - 12:15 是教学楼下课洪峰，排队平均耗时 15-20 分钟。</p>
                        </div>
                        <div className="tip-card" style={{background: '#f0fdf4', borderColor: '#22c55e'}}>
                            <h4>🟢 黄金时段 (强烈推荐)</h4>
                            <p><strong>10:45 - 11:15</strong>：菜品刚出锅，最新鲜，几乎不用排队！</p>
                        </div>
                        <div className="tip-card" style={{background: '#fff7ed', borderColor: '#f97316'}}>
                            <h4>🟠 晚餐策略</h4>
                            <p>17:30 是运动/社团活动结束高峰。推荐 17:00 提前就餐。</p>
                        </div>
                    </div>
                </div>

                <div className="section-card" id="analysis">
                    <h2 className="section-title">
                        12月新品推荐综合看板
                        <span style={{fontSize: '0.9rem', color: '#666', fontWeight: 'normal', marginLeft: '10px'}}>(综合评分维度：口味 / 价格 / 营养 / 排队时长)</span>
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

                <div className="section-card" id="details">
                    <h2 className="section-title">新品图文详情</h2>
                    
                    <div className="article-feed">

{/* 冬日暖食地图卡片 */}
<div className="article-card">
    <div className="article-header">
        <div className="date-badge" style={{background:'#f97316'}}>08<span>12月</span></div>
        <div className="article-title">冬日暖食地图：从香辣蟹到冰糖雪梨</div>
        <div className="expand-hint">点击展开查看详情 ▼</div>
    </div>
    <div className="article-content">
        <div className="dish-grid">
            <div className="dish-item">
                <div className="dish-img-box">
                    <img src="/picture/香辣蟹.jpg" alt="香辣蟹" onError={(e) => e.target.parentNode.innerHTML='📷 图片加载中'} />
                </div>
                <div className="dish-info">
                    <div className="dish-name">曦园香辣蟹 <span className="score-badge">9.9分</span></div>
                    <div className="dish-meta">
                        <span className="dish-price">¥38.00/份</span>
                        <span>一食堂·15号窗</span>
                    </div>
                </div>
            </div>
            
            <div className="dish-item">
                <div className="dish-img-box">
                    <img src="/picture/青椒烤鱼饭.jpg" alt="青椒烤鱼饭" onError={(e) => e.target.parentNode.innerHTML='📷 图片加载中'} />
                </div>
                <div className="dish-info">
                    <div className="dish-name">青椒烤鱼饭 <span className="score-badge">9.4分</span></div>
                    <div className="dish-meta">
                        <span className="dish-price">¥16.00/份</span>
                        <span>二食堂·5号窗</span>
                    </div>
                </div>
            </div>
            
            <div className="dish-item">
                <div className="dish-img-box">
                    <img src="/picture/冰糖雪梨.jpg" alt="冰糖雪梨" onError={(e) => e.target.parentNode.innerHTML='📷 图片加载中'} />
                </div>
                <div className="dish-info">
                    <div className="dish-name">润肺冰糖雪梨 <span className="score-badge">9.5分</span></div>
                    <div className="dish-meta">
                        <span className="dish-price">¥6.00/盅</span>
                        <span>二食堂·汤饼档</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                 
                                        <div className="article-card">
                    <div className="article-header">
                        <div className="date-badge">04<span>12月</span></div>
                        <div className="article-title">鲜味预警！大虾 & 鸭腿齐上线，谁是性价比之王？</div>
                        <div className="expand-hint">点击展开查看详情 ▼</div>
                    </div>
                    <div className="article-content">
                        <div className="dish-grid">
                            <div className="dish-item">
                                <div className="dish-img-box"><img src="/picture/白灼大虾.jpg" alt="白灼大虾" onError="this.parentNode.innerHTML='📷 图片加载中'" /></div>
                                <div className="dish-info">
                                    <div className="dish-name">白灼海捕大虾 <span className="score-badge">9.8分</span></div>
                                    <div className="dish-meta">
                                        <span className="dish-price">¥32.00/斤</span>
                                        <span>二食堂·炸鸡窗</span>
                                    </div>
                                </div>
                            </div>
                            <div className="dish-item">
                                <div className="dish-img-box"><img src="/picture/茄汁大虾.jpg" alt="茄汁大虾" onError="this.parentNode.innerHTML='📷 图片加载中'" /></div>
                                <div className="dish-info">
                                    <div className="dish-name">酸甜茄汁大虾 <span className="score-badge">9.6分</span></div>
                                    <div className="dish-meta">
                                        <span className="dish-price">¥1.50/只</span>
                                        <span>二食堂·炸鸡窗</span>
                                    </div>
                                </div>
                            </div>
                            <div className="dish-item">
                                <div className="dish-img-box"><img src="/picture/紫苏鸭腿.jpg" alt="紫苏鸭腿" onError="this.parentNode.innerHTML='📷 图片加载中'" /></div>
                                <div className="dish-info">
                                    <div className="dish-name">秘制紫苏鸭腿 <span className="score-badge">9.7分</span></div>
                                    <div className="dish-meta">
                                        <span className="dish-price">¥8.00/个</span>
                                        <span>10号烤鸭窗</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="article-card">
                    <div className="article-header">
                        <div className="date-badge" style={{background:'#64748b'}}>01<span>12月</span></div>
                        <div className="article-title">南北风味大集合：从潮汕蚝烙到川味水煮</div>
                        <div className="expand-hint">点击展开查看详情 ▼</div>
                    </div>
                    <div className="article-content">
                        <div className="dish-grid">
                            <div className="dish-item">
                                <div className="dish-img-box"><img src="/picture/蚝烙煎.jpg" alt="蚝烙煎" onError="this.parentNode.innerHTML='📷 图片加载中'" /></div>
                                <div className="dish-info">
                                    <div className="dish-name">潮汕蚝烙煎 <span className="score-badge">9.5分</span></div>
                                    <div className="dish-meta">
                                        <span className="dish-price">¥15.00/份</span>
                                        <span>二食堂·6号窗</span>
                                    </div>
                                </div>
                            </div>
                            <div className="dish-item">
                                <div className="dish-img-box"><img src="/picture/蟹黄小笼包.jpg" alt="小笼包" onError="this.parentNode.innerHTML='📷 图片加载中'" /></div>
                                <div className="dish-info">
                                    <div className="dish-name">蟹黄小笼包 <span className="score-badge">9.2分</span></div>
                                    <div className="dish-meta">
                                        <span className="dish-price">¥10.00/笼</span>
                                        <span>一食堂·6号窗</span>
                                    </div>
                                </div>
                            </div>
                             <div className="dish-item">
                                <div className="dish-img-box"><img src="/picture/水煮肉片.jpg" alt="水煮肉片" onError="this.parentNode.innerHTML='📷 图片加载中'" /></div>
                                <div className="dish-info">
                                    <div className="dish-name">川味水煮肉片 <span className="score-badge">9.6分</span></div>
                                    <div className="dish-meta">
                                        <span className="dish-price">¥12.00/份</span>
                                        <span>一食堂·2号窗</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                        


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;