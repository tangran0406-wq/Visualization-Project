import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';

// ==========================================
// 1. 常量与配置 (移植自 HTML)
// ==========================================
const SCALE = 6;
const CANTEEN_WIDTH = 100;
const CANTEEN_HEIGHT = 110;
const WIDTH_PX = CANTEEN_WIDTH * SCALE;
const HEIGHT_PX = CANTEEN_HEIGHT * SCALE;

const WINDOW_SIZE = { w: 3, h: 2 };
const TABLE_SIZE = { w: 3, h: 2 };
const TABLE_SPACING = 4;
const TABLE_CAPACITY = 4;
const PREFERENCE_DECAY = 10;
const DISTANCE_WEIGHT = 3.0;
const DISTANCE_SCALE = 5.0;
const WINDOW_CROWD_DECAY = 0.5;

const BASE_STAY_TIME_WINDOW = 8;
const TIME_GROWTH_RATE = 5;
const PEOPLE_NUM = 800;
const SIMULATION_FRAMES = 5000;
const PEAK_FRAME = 500;
const PEAK_SD = 100;
const BASE_STAY_TIME_TABLE = 550;
const TABLE_TIME_FLUCTUATION = 200;
const LEAVE_PROB = 0.01;

const GRID_SIZE = 2;
const GRID_W = Math.ceil(CANTEEN_WIDTH / GRID_SIZE) + 2;
const GRID_H = Math.ceil(CANTEEN_HEIGHT / GRID_SIZE) + 2;

const ENTRY_EXIT_AREAS = [
    { x: 40, y: 0, w: 4, h: 4, label: '南出入口' },
    { x: 0, y: 45, w: 4, h: 4, label: '西出入口' }
];
const COURTYARD_AREA = { x: 30, y: 30, w: 20, h: 30 };

const COLORS = {
    state0: '#00FFFF', // 前往窗口
    state1: '#FF0000', // 打饭中
    state2: '#FF00FF', // 前往餐桌
    state3: '#008000', // 就餐中
    state4: '#000000', // 离开中
    winNorth: 'rgba(255, 0, 0, 0.4)',
    winSouth: 'rgba(255, 165, 0, 0.4)',
    winCenter: 'rgba(0, 0, 255, 0.4)',
    winEast: 'rgba(128, 0, 128, 0.4)',
    table: 'rgba(211, 211, 211, 0.5)',
    courtyard: 'rgba(255, 0, 0, 0.7)'
};

const TABLE_INDEX = {
    NORTH: [0, 67],
    CENTER_WEST: [68, 140],
    CENTER_EAST: [140, 200],
    EAST_SOUTH: [200, 240]
};

// ==========================================
// 2. 工具类 (MinHeap, A* Utils)
// ==========================================

class MinHeap {
    heap: any[];
    constructor() { this.heap = []; }
    push(node: any) { this.heap.push(node); this.bubbleUp(this.heap.length - 1); }
    pop() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) { this.heap[0] = end; this.bubbleDown(0); }
        return min;
    }
    bubbleUp(n: number) {
        while (n > 0) {
            let parent = Math.floor((n - 1) / 2);
            if (this.heap[n].f >= this.heap[parent].f) break;
            [this.heap[n], this.heap[parent]] = [this.heap[parent], this.heap[n]];
            n = parent;
        }
    }
    bubbleDown(n: number) {
        while (true) {
            let left = 2 * n + 1, right = 2 * n + 2, swap = null;
            if (left < this.heap.length) if (this.heap[left].f < this.heap[n].f) swap = left;
            if (right < this.heap.length) {
                if ((swap === null && this.heap[right].f < this.heap[n].f) || (swap !== null && this.heap[right].f < this.heap[swap].f)) swap = right;
            }
            if (swap === null) break;
            [this.heap[n], this.heap[swap]] = [this.heap[swap], this.heap[n]];
            n = swap;
        }
    }
    size() { return this.heap.length; }
}

// Helper functions
const toScreenX = (x: number) => x * SCALE;
const toScreenY = (y: number) => (CANTEEN_HEIGHT - y) * SCALE;
const dist = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x1 - x2, y1 - y2);
const randRange = (min: number, max: number) => Math.random() * (max - min) + min;
const normPdf = (x: number, mean: number, dev: number) => (1 / (dev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / dev, 2));

const isPointValid = (x: number, y: number) => {
    if (x < 1 || x > CANTEEN_WIDTH - 1 || y < 1 || y > CANTEEN_HEIGHT - 1) return false;
    let c = COURTYARD_AREA;
    if (x >= c.x - 0.5 && x <= c.x + c.w + 0.5 && y >= c.y - 0.5 && y <= c.y + c.h + 0.5) return false;
    return true;
};

// A* Algorithm
const aStarSearch = (start: number[], goal: number[]) => {
    // Safety check for bounds
    if (!isPointValid(start[0], start[1])) start = [Math.max(1, Math.min(CANTEEN_WIDTH - 1, start[0])), Math.max(1, Math.min(CANTEEN_HEIGHT - 1, start[1]))];
    if (!isPointValid(goal[0], goal[1])) goal = [Math.max(1, Math.min(CANTEEN_WIDTH - 1, goal[0])), Math.max(1, Math.min(CANTEEN_HEIGHT - 1, goal[1]))];

    let startG = [Math.round(start[0] / GRID_SIZE), Math.round(start[1] / GRID_SIZE)];
    let goalG = [Math.round(goal[0] / GRID_SIZE), Math.round(goal[1] / GRID_SIZE)];
    let startKey = startG[0] + "," + startG[1];
    let goalKey = goalG[0] + "," + goalG[1];

    if (startKey === goalKey) return [start, goal];

    let openSet = new MinHeap();
    openSet.push({ pos: startG, f: 0, key: startKey });
    let cameFrom = new Map();
    let gScore = new Map();
    gScore.set(startKey, 0);

    let neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    while (openSet.size() > 0) {
        let current = openSet.pop();
        if (current.key === goalKey) {
            let path = [];
            let currKey = goalKey;
            while (cameFrom.has(currKey)) {
                let p = currKey.split(',').map(Number);
                let rx = p[0] * GRID_SIZE + GRID_SIZE / 2;
                let ry = p[1] * GRID_SIZE + GRID_SIZE / 2;
                if (isPointValid(rx, ry)) path.push([rx, ry]);
                currKey = cameFrom.get(currKey);
            }
            path.push(start);
            return path.reverse();
        }

        for (let offset of neighbors) {
            let nx = current.pos[0] + offset[0];
            let ny = current.pos[1] + offset[1];
            let rnx = nx * GRID_SIZE + GRID_SIZE / 2;
            let rny = ny * GRID_SIZE + GRID_SIZE / 2;

            if (!isPointValid(rnx, rny)) continue;

            let nKey = nx + "," + ny;
            let tentativeG = gScore.get(current.key) + 1;

            if (!gScore.has(nKey) || tentativeG < gScore.get(nKey)) {
                cameFrom.set(nKey, current.key);
                gScore.set(nKey, tentativeG);
                let h = Math.abs(nx - goalG[0]) + Math.abs(ny - goalG[1]);
                openSet.push({ pos: [nx, ny], f: tentativeG + h, key: nKey });
            }
        }
    }
    // Fallback
    return [start, [(start[0] + goal[0]) / 2, (start[1] + goal[1]) / 2], goal];
};

// ==========================================
// 3. 实体类 (Person)
// ==========================================
// 注意：为了在 React 中使用，我们将此类改为工厂函数或保持为类，
// 但它需要访问仿真环境的上下文 (windows, tables 等)。
// 我们将在组件内部实例化 SimulationContext 来传递这些引用。

class Person {
    x: number; y: number;
    state: number; // 0:前往窗口, 1:打饭, 2:前往餐桌, 3:就餐, 4:离开
    stateTimer: number;
    windowWaitTimer: number;
    targetX: number; targetY: number;
    assignedTableIdx: number;
    assignedWindowIdx: number;
    path: number[][];
    pathIndex: number;
    windowStayTime: number;
    personalStayTimeTable: number;
    entryArea: any;
    ctx: any; // Simulation Context

    constructor(context: any) {
        this.ctx = context;
        let entryIdx = Math.floor(Math.random() * ENTRY_EXIT_AREAS.length);
        this.entryArea = ENTRY_EXIT_AREAS[entryIdx];
        let attempts = 0;
        do {
            this.x = randRange(this.entryArea.x + 1, this.entryArea.x + this.entryArea.w - 1);
            this.y = randRange(this.entryArea.y + 1, this.entryArea.y + this.entryArea.h - 1);
            attempts++;
        } while (!isPointValid(this.x, this.y) && attempts < 100);

        if (attempts >= 100) {
            this.x = (entryIdx === 0) ? 42 : 2;
            this.y = (entryIdx === 0) ? 2 : 47;
        }

        this.state = 0;
        this.stateTimer = 0;
        this.windowWaitTimer = 0;
        this.targetX = 0; this.targetY = 0;
        this.assignedTableIdx = -1;
        this.assignedWindowIdx = -1;
        this.path = [];
        this.pathIndex = 0;
        this.windowStayTime = BASE_STAY_TIME_WINDOW;
        this.personalStayTimeTable = Math.max(400, BASE_STAY_TIME_TABLE + randRange(-TABLE_TIME_FLUCTUATION, TABLE_TIME_FLUCTUATION));

        this.selectTarget();
    }

    selectTarget() {
        const { windows, windowPeopleCount, tables, tableOccupancy } = this.ctx;

        if (this.state === 0) {
            // 选择窗口
            let prefs = windows.map((w: any, i: number) => (1 / (1 + dist(this.x, this.y, w.x + w.w / 2, w.y + w.h / 2) / 10)) * Math.exp(-WINDOW_CROWD_DECAY * windowPeopleCount[i]));
            let totalPref = prefs.reduce((a: number, b: number) => a + b, 0);
            let winIdx = -1;
            if (totalPref === 0) winIdx = Math.floor(Math.random() * windows.length);
            else {
                let r = Math.random() * totalPref, acc = 0;
                for (let i = 0; i < prefs.length; i++) { acc += prefs[i]; if (r <= acc) { winIdx = i; break; } }
            }
            if (winIdx === -1) winIdx = prefs.length - 1;

            this.assignedWindowIdx = winIdx;
            windowPeopleCount[winIdx]++;
            this.windowStayTime = BASE_STAY_TIME_WINDOW + TIME_GROWTH_RATE * windowPeopleCount[winIdx];

            let w = windows[winIdx];
            // 修复：目标位置在窗口外侧
            this.targetX = w.x + w.w / 2 + randRange(-0.5, 0.5);
            if (w.area === '北部窗口') {
                this.targetY = w.y - 1.5;
            } else if (w.area === '南部窗口') {
                this.targetY = w.y + w.h + 1.5;
            } else {
                this.targetY = w.y - 1.5;
            }

            this.path = aStarSearch([this.x, this.y], [this.targetX, this.targetY]);
            this.pathIndex = 0;
        }
        else if (this.state === 2) {
            // 选择餐桌
            let minD = Infinity, closestWinIdx = 0;
            windows.forEach((w: any, i: number) => { let d = dist(w.x + w.w / 2, w.y + w.h / 2, this.x, this.y); if (d < minD) { minD = d; closestWinIdx = i; } });
            let area = windows[closestWinIdx].area;

            let prefs = tables.map((t: any, idx: number) => {
                if (area === '北部窗口' && !(idx >= TABLE_INDEX.NORTH[0] && idx < TABLE_INDEX.NORTH[1])) return 0;
                if ((area === '中部窗口' || area === '南部窗口') && !(idx >= TABLE_INDEX.CENTER_WEST[0] && idx < TABLE_INDEX.CENTER_EAST[1])) return 0;
                if (area === '东部窗口' && !(idx >= TABLE_INDEX.EAST_SOUTH[0] && idx < TABLE_INDEX.EAST_SOUTH[1])) return 0;
                if (tableOccupancy[idx] >= TABLE_CAPACITY) return 0;
                return Math.exp(-DISTANCE_WEIGHT * dist(this.x, this.y, t.x + t.w / 2, t.y + t.h / 2) / DISTANCE_SCALE) * Math.exp(-PREFERENCE_DECAY * tableOccupancy[idx]);
            });

            let totalPref = prefs.reduce((a: number, b: number) => a + b, 0);
            if (totalPref === 0) {
                let available = tables.findIndex((_: any, i: number) => tableOccupancy[i] < TABLE_CAPACITY);
                if (available !== -1) this.assignedTableIdx = available;
                else { this.state = 4; this.selectExit(); return; }
            } else {
                let r = Math.random() * totalPref, acc = 0;
                for (let i = 0; i < prefs.length; i++) { acc += prefs[i]; if (r <= acc) { this.assignedTableIdx = i; break; } }
            }
            if (this.assignedTableIdx === -1) this.assignedTableIdx = prefs.length - 1;

            let t = tables[this.assignedTableIdx];
            this.targetX = t.x + t.w / 2;
            this.targetY = t.y + t.h / 2;
            tableOccupancy[this.assignedTableIdx]++;

            this.path = (this.assignedTableIdx >= TABLE_INDEX.EAST_SOUTH[0] && this.assignedTableIdx < TABLE_INDEX.EAST_SOUTH[1])
                ? aStarSearch([this.x, this.y], [this.x, this.targetY]).concat(aStarSearch([this.x, this.targetY], [this.targetX, this.targetY]).slice(1))
                : aStarSearch([this.x, this.y], [this.targetX, this.targetY]);
            this.pathIndex = 0;
        }
        else if (this.state === 4) {
            this.selectExit();
        }
    }

    selectExit() {
        let minD = Infinity, ex = null;
        for (let e of ENTRY_EXIT_AREAS) { let d = dist(this.x, this.y, e.x + e.w / 2, e.y + e.h / 2); if (d < minD) { minD = d; ex = e; } }
        if (ex) {
            this.targetX = ex.x + ex.w / 2;
            this.targetY = ex.y + ex.h / 2;
            this.path = aStarSearch([this.x, this.y], [this.targetX, this.targetY]);
            this.pathIndex = 0;
        }
    }

    move(speed: number) {
        if (!isPointValid(this.x, this.y)) {
            let c = COURTYARD_AREA;
            if (this.x > c.x && this.x < c.x + c.w && this.y > c.y && this.y < c.y + c.h) this.x = (this.x < c.x + c.w / 2) ? c.x - 1 : c.x + c.w + 1;
            this.path = aStarSearch([this.x, this.y], [this.targetX, this.targetY]);
            this.pathIndex = 0;
        }

        if (this.state === 4) return this.moveToExit(speed);

        this.stateTimer++;
        if (this.state === 1) this.windowWaitTimer++;

        if (this.state === 1 && this.stateTimer >= this.windowStayTime) {
            if (this.assignedWindowIdx !== -1) {
                this.ctx.windowPeopleCount[this.assignedWindowIdx] = Math.max(0, this.ctx.windowPeopleCount[this.assignedWindowIdx] - 1);
                this.assignedWindowIdx = -1;
            }
            this.state = 2; this.stateTimer = 0; this.windowWaitTimer = 0; this.selectTarget();
        }
        else if (this.state === 3) {
            if (this.stateTimer >= this.personalStayTimeTable && Math.random() < LEAVE_PROB * 2) {
                this.state = 4; this.stateTimer = 0; this.selectTarget();
            }
        }
        this.followPath(speed);
        return false;
    }

    followPath(speed: number) {
        if (!this.path || this.pathIndex >= this.path.length) {
            if (dist(this.x, this.y, this.targetX, this.targetY) > 2) {
                this.path = aStarSearch([this.x, this.y], [this.targetX, this.targetY]);
                this.pathIndex = 0;
            }
            return;
        }
        let target = this.path[this.pathIndex];
        let dx = target[0] - this.x, dy = target[1] - this.y;
        let d = Math.hypot(dx, dy);

        if (d < speed) {
            this.x = target[0]; this.y = target[1];
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                if (this.state === 0) { this.state = 1; this.stateTimer = 0; this.windowWaitTimer = 0; }
                else if (this.state === 2) { this.state = 3; this.stateTimer = 0; }
            }
        } else {
            let stepX = (dx / d) * speed, stepY = (dy / d) * speed;
            let nx = this.x + stepX, ny = this.y + stepY;
            if (!isPointValid(nx, ny)) {
                if (isPointValid(nx, this.y)) stepY = 0; else if (isPointValid(this.x, ny)) stepX = 0; else { stepX = -stepX; stepY = -stepY; }
            }
            this.x += stepX; this.y += stepY;
        }
    }

    moveToExit(speed: number) {
        this.followPath(speed);
        // 修复：放宽判定，避免卡在门口
        if (dist(this.x, this.y, this.targetX, this.targetY) < 5 || (this.path && this.pathIndex >= this.path.length)) {
            if (this.assignedTableIdx !== -1 && this.ctx.tableOccupancy[this.assignedTableIdx] > 0) {
                this.ctx.tableOccupancy[this.assignedTableIdx]--;
            }
            return true; // remove
        }
        return false;
    }
}

// ==========================================
// 4. React 组件
// ==========================================

const CrowdSimulation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    
    // 仿真状态 (Mutable, refs to avoid re-renders)
    const simState = useRef({
        windows: [] as any[],
        tables: [] as any[],
        tableOccupancy: [] as number[],
        windowPeopleCount: [] as number[],
        totalCapacity: 0,
        peopleList: [] as Person[],
        currentFrame: 0,
        currentSpawnCount: 0,
        frameSpawnNum: [] as number[],
        isPaused: true,
        moveSpeed: 0.2,
        frameDelay: 30
    });

    // UI 状态 (触发重绘)
    const [uiStats, setUiStats] = useState({
        frame: 0,
        totalPeople: 0,
        queueCount: 0,
        diningCount: 0,
        tableUtil: 0,
        capRatio: 0
    });

    // 图表数据
    const [chartData, setChartData] = useState<any[]>([]);

    // 初始化布局 (只运行一次)
    useEffect(() => {
        initLayout();
        setupSpawnSchedule();
        draw(); // 初始绘制
        
        // 启动循环
        animate();
        
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initLayout = () => {
        const state = simState.current;
        state.windows = [];
        state.tables = [];

        // 窗口
        for (let i = 0; i < 14; i++) state.windows.push({ x: 5 + i * 5, y: 80, w: 3, h: 2, area: '北部窗口', color: COLORS.winNorth });
        for (let i = 0; i < 4; i++) state.windows.push({ x: 5 + i * 4, y: 5, w: 3, h: 2, area: '南部窗口', color: COLORS.winSouth });
        for (let i = 0; i < 4; i++) state.windows.push({ x: 32 + i * 5, y: 25, w: 3, h: 2, area: '中部窗口', color: COLORS.winCenter });
        for (let i = 0; i < 4; i++) state.windows.push({ x: 75 + i * 5, y: 55, w: 3, h: 2, area: '东部窗口', color: COLORS.winEast });
        state.windowPeopleCount = new Array(state.windows.length).fill(0);

        // 餐桌
        const ALIGN_BASE_X = 5, ALIGN_BASE_Y = 15;
        const addTable = (x: number, y: number) => state.tables.push({ x, y, w: 3, h: 2 });
        for (let row = 0; row < 4; row++) for (let col = 0; col < 17; col++) addTable(ALIGN_BASE_X + col * TABLE_SPACING, 75 - row * TABLE_SPACING);
        for (let col = 0; col < 6; col++) for (let row = 0; row < 12; row++) addTable(ALIGN_BASE_X + col * TABLE_SPACING, ALIGN_BASE_Y + row * TABLE_SPACING);
        for (let col = 0; col < 5; col++) for (let row = 0; row < 12; row++) addTable(ALIGN_BASE_X + 48 + col * TABLE_SPACING, ALIGN_BASE_Y + row * TABLE_SPACING);
        for (let col = 0; col < 4; col++) for (let row = 0; row < 8; row++) addTable(ALIGN_BASE_X + 72 + col * TABLE_SPACING, ALIGN_BASE_Y + row * TABLE_SPACING);

        state.tableOccupancy = new Array(state.tables.length).fill(0);
        state.totalCapacity = state.tables.length * TABLE_CAPACITY;
    };

    const setupSpawnSchedule = () => {
        const state = simState.current;
        state.frameSpawnNum = new Array(SIMULATION_FRAMES).fill(0);
        let pdfs = state.frameSpawnNum.map((_, i) => normPdf(i, PEAK_FRAME, PEAK_SD));
        let sumPdf = pdfs.reduce((a, b) => a + b, 0);
        let totalGenerated = 0;
        for (let i = 0; i < SIMULATION_FRAMES; i++) {
            state.frameSpawnNum[i] = Math.floor((pdfs[i] / sumPdf) * PEOPLE_NUM);
            if (i < 100) state.frameSpawnNum[i] = Math.max(state.frameSpawnNum[i], 1);
            totalGenerated += state.frameSpawnNum[i];
        }
        let diff = PEOPLE_NUM - totalGenerated;
        if (diff > 0) state.frameSpawnNum[PEAK_FRAME] += diff;
    };

    const resetSim = () => {
        const state = simState.current;
        state.peopleList = [];
        state.currentFrame = 0;
        state.currentSpawnCount = 0;
        state.isPaused = true;
        state.windowPeopleCount.fill(0);
        state.tableOccupancy.fill(0);
        setChartData([]);
        setUiStats({ frame: 0, totalPeople: 0, queueCount: 0, diningCount: 0, tableUtil: 0, capRatio: 0 });
        draw();
    };

    const update = () => {
        const state = simState.current;
        if (state.currentSpawnCount < PEOPLE_NUM) {
            let num = (state.currentFrame < state.frameSpawnNum.length) ? state.frameSpawnNum[state.currentFrame] : 0;
            num = Math.min(num, PEOPLE_NUM - state.currentSpawnCount);
            if (state.currentSpawnCount + num < PEOPLE_NUM && num === 0) num = 1;
            for (let i = 0; i < num; i++) {
                // 传递 state 上下文给 Person
                state.peopleList.push(new Person(state));
                state.currentSpawnCount++;
            }
        }

        // 移动逻辑
        for (let i = state.peopleList.length - 1; i >= 0; i--) {
            if (state.peopleList[i].move(state.moveSpeed)) {
                state.peopleList.splice(i, 1);
            }
        }

        // 统计更新
        if (state.currentFrame % 5 === 0) { // 降频更新 React 状态以提高性能
            let stats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 } as any;
            state.peopleList.forEach(p => stats[p.state]++);
            let usedTables = state.tables.filter((_, i) => state.tableOccupancy[i] > 0).length;
            let tableUtil = (usedTables / state.tables.length) * 100;
            let capRatio = (state.tableOccupancy.reduce((a, b) => a + b, 0) / state.totalCapacity) * 100;

            setUiStats({
                frame: state.currentFrame,
                totalPeople: state.peopleList.length,
                queueCount: stats[1],
                diningCount: stats[3],
                tableUtil,
                capRatio
            });

            // 更新图表数据
            setChartData(prev => {
                const newData = [...prev, {
                    frame: state.currentFrame,
                    total: state.peopleList.length,
                    queue: stats[1],
                    util: parseFloat(tableUtil.toFixed(1)),
                    ratio: parseFloat(capRatio.toFixed(1))
                }];
                // 保持图表数据窗口不过大，防止 React 渲染卡顿
                if (newData.length > 200) return newData.slice(newData.length - 200);
                return newData;
            });
        }

        state.currentFrame++;
        if (state.currentFrame >= SIMULATION_FRAMES) state.isPaused = true;
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const state = simState.current;

        ctx.clearRect(0, 0, WIDTH_PX, HEIGHT_PX);
        
        // 绘制背景/天井
        ctx.fillStyle = COLORS.courtyard;
        ctx.fillRect(toScreenX(COURTYARD_AREA.x), toScreenY(COURTYARD_AREA.y + COURTYARD_AREA.h), COURTYARD_AREA.w * SCALE, COURTYARD_AREA.h * SCALE);
        ctx.strokeStyle = "black"; ctx.lineWidth = 3;
        ctx.strokeRect(toScreenX(COURTYARD_AREA.x), toScreenY(COURTYARD_AREA.y + COURTYARD_AREA.h), COURTYARD_AREA.w * SCALE, COURTYARD_AREA.h * SCALE);

        // 绘制窗口
        state.windows.forEach(w => {
            ctx.fillStyle = w.color;
            let sx = toScreenX(w.x), sy = toScreenY(w.y + w.h);
            ctx.fillRect(sx, sy, w.w * SCALE, w.h * SCALE);
            ctx.strokeStyle = "black"; ctx.lineWidth = 1;
            ctx.strokeRect(sx, sy, w.w * SCALE, w.h * SCALE);
        });

        // 绘制餐桌
        ctx.fillStyle = COLORS.table;
        state.tables.forEach(t => {
            let sx = toScreenX(t.x), sy = toScreenY(t.y + t.h);
            ctx.fillRect(sx, sy, t.w * SCALE, t.h * SCALE);
            ctx.lineWidth = 0.5;
            ctx.strokeRect(sx, sy, t.w * SCALE, t.h * SCALE);
        });

        // 绘制出入口
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ENTRY_EXIT_AREAS.forEach(e => {
            let sx = toScreenX(e.x), sy = toScreenY(e.y + e.h);
            ctx.fillRect(sx, sy, e.w * SCALE, e.h * SCALE);
            ctx.fillStyle = "black"; ctx.font = "12px sans-serif";
            ctx.fillText(e.label, sx, sy - 5);
            ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        });

        // 绘制人物
        state.peopleList.forEach(p => {
            let sx = toScreenX(p.x), sy = toScreenY(p.y);
            ctx.beginPath(); ctx.arc(sx, sy, 3, 0, 2 * Math.PI);
            ctx.fillStyle = (COLORS as any)[`state${p.state}`] || 'black';
            ctx.fill(); ctx.strokeStyle = "black"; ctx.lineWidth = 0.5; ctx.stroke();
        });
    };

    const animate = () => {
        if (!simState.current.isPaused) {
            update();
        }
        draw();
        
        // 使用 setTimeout 控制帧率
        setTimeout(() => {
            requestRef.current = requestAnimationFrame(animate);
        }, simState.current.frameDelay);
    };

    // 控制函数
    const handleStart = () => { simState.current.isPaused = !simState.current.isPaused; };
    const handlePause = () => { simState.current.isPaused = true; };
    const handleReset = () => { resetSim(); };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">食堂人流实时模拟</h3>
                        <p className="text-sm text-gray-500">基于 Agent-based Model 的动态仿真系统</p>
                    </div>
                    <div className="space-x-2">
                        <button onClick={handleStart} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors">开始/继续</button>
                        <button onClick={handlePause} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm transition-colors">暂停</button>
                        <button onClick={handleReset} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors">重置</button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* 左侧：Canvas 仿真区 */}
                    <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 relative flex justify-center p-2">
                         {/* 图例 */}
                         <div className="absolute top-2 left-2 bg-white/90 p-2 rounded text-xs shadow pointer-events-none flex flex-wrap gap-2 max-w-[200px]">
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full mr-1 bg-[#00FFFF]"></span>前往窗口</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full mr-1 bg-[#FF0000]"></span>打饭中</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full mr-1 bg-[#FF00FF]"></span>前往餐桌</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full mr-1 bg-[#008000]"></span>就餐中</div>
                        </div>
                        <canvas 
                            ref={canvasRef} 
                            width={WIDTH_PX} 
                            height={HEIGHT_PX} 
                            className="max-w-full h-auto shadow-sm bg-white"
                        />
                    </div>

                    {/* 右侧：控制与统计 */}
                    <div className="w-full lg:w-80 space-y-4">
                        {/* 速度控制 */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-gray-700 mb-3 text-sm">仿真控制</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>动画延迟</span>
                                        <span className="font-mono">{simState.current.frameDelay}ms</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="200" defaultValue="30"
                                        onChange={(e) => simState.current.frameDelay = parseInt(e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>移动速度</span>
                                        <span className="font-mono">{simState.current.moveSpeed}</span>
                                    </div>
                                    <input 
                                        type="range" min="0.1" max="2.0" step="0.1" defaultValue="0.2"
                                        onChange={(e) => simState.current.moveSpeed = parseFloat(e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 实时数据面板 */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-3 text-sm">实时数据 (帧: {uiStats.frame})</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <div className="text-gray-500 text-xs">总人数</div>
                                    <div className="font-bold text-lg text-blue-600">{uiStats.totalPeople}</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <div className="text-gray-500 text-xs">排队人数</div>
                                    <div className="font-bold text-lg text-red-500">{uiStats.queueCount}</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <div className="text-gray-500 text-xs">就餐人数</div>
                                    <div className="font-bold text-lg text-green-600">{uiStats.diningCount}</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <div className="text-gray-500 text-xs">餐桌利用率</div>
                                    <div className="font-bold text-lg text-purple-600">{uiStats.tableUtil.toFixed(1)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 底部图表区 */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h5 className="text-xs font-bold text-gray-500 mb-2">人数变化趋势</h5>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="frame" tick={false} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="总人数" />
                                <Area type="monotone" dataKey="queue" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="排队中" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h5 className="text-xs font-bold text-gray-500 mb-2">拥挤度指标</h5>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="frame" tick={false} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="util" stroke="#8b5cf6" strokeWidth={2} dot={false} name="餐桌利用率%" />
                                <Line type="monotone" dataKey="ratio" stroke="#10b981" strokeWidth={2} dot={false} name="容量占比%" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CrowdSimulation;