/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Server, Cpu, HardDrive, Network, Box, Building2, ChevronRight,
  Zap, Snowflake, Globe, ClipboardList, ShieldCheck, ArrowUpRight,
  Layers, Bell, AlertTriangle, AlertCircle, Info, ChevronDown, Clock,
  Users, BarChart3, Settings, Search, Check, FolderOpen, Folder, FileText,
  GitFork, X, Filter
} from 'lucide-react';
import { cn } from './utils';
import { Panel } from './components/Panel';
import { TopologyMap } from './components/TopologyMap';
import { 
  kpiData, infraData, nodeStatusCards, alarmSummary, 
  alarmTrendData, topAlarmEvents, costTrendData, bottomRealtimeMetrics, trendData,
  hostResourceStats, resourceAllocationData, loadTrendSeries,
  alarmStatsData, hostTop5Data, vmTop5Data, vmTop10Data, departmentAppsData, getDepartmentAppsData,
  organizationTree, getAllDepartments, getDepartmentPath, DepartmentNode
} from './data';

interface OrganizationSwitcherProps {
  selectedDept: DepartmentNode;
  onSelectDept: (dept: DepartmentNode) => void;
}

function OrganizationSwitcher({ selectedDept, onSelectDept }: OrganizationSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'org-root': true,
    'org-rd': true,
    'org-ops': true,
    'org-data': true,
    'org-sec': true,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allDepts = getAllDepartments(organizationTree);
  const deptPath = getDepartmentPath(selectedDept.id, organizationTree);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isMatchSearch = (node: DepartmentNode): boolean => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchesSelf = node.name.toLowerCase().includes(term) || node.code.toLowerCase().includes(term);
    const matchesChild = node.children?.some((child) => isMatchSearch(child)) ?? false;
    return matchesSelf || matchesChild;
  };

  const counts = {
    all: allDepts.length,
    l1: allDepts.filter((d) => d.level === 1).length,
    l2: allDepts.filter((d) => d.level === 2).length,
    l3: allDepts.filter((d) => d.level === 3).length,
  };

  const renderTreeNode = (node: DepartmentNode) => {
    if (!isMatchSearch(node)) return null;

    if (levelFilter !== 'all' && node.level !== levelFilter) {
      const hasMatchingDescendant = node.children?.some(
        (child) => isMatchSearch(child) && (child.level === levelFilter || child.children?.some((c) => c.level === levelFilter))
      );
      if (!hasMatchingDescendant) return null;
    }

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id] || !!searchTerm;
    const isSelected = selectedDept.id === node.id;

    const levelBadge = node.level === 1 ? (
      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
        1级
      </span>
    ) : node.level === 2 ? (
      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-400/50">
        2级
      </span>
    ) : (
      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-400/50">
        3级
      </span>
    );

    const nodeIcon = node.level === 1 ? (
      <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
    ) : node.level === 2 ? (
      <FolderOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
    ) : (
      <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
    );

    const indentClass = node.level === 1 ? 'pl-2' : node.level === 2 ? 'pl-6' : 'pl-10';

    return (
      <div key={node.id} className="flex flex-col">
        <div
          onClick={() => {
            onSelectDept(node);
            setIsOpen(false);
          }}
          className={cn(
            "group flex items-center justify-between py-1.5 pr-2.5 rounded-sm transition-all cursor-pointer text-xs my-0.5",
            indentClass,
            isSelected
              ? "bg-cyan-500/20 text-cyan-100 border-l-2 border-cyan-400 font-bold shadow-[inset_0_0_12px_rgba(6,182,212,0.2)]"
              : "text-slate-300 hover:bg-[#0c2548] hover:text-cyan-200 border-l-2 border-transparent"
          )}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className="w-4 h-4 flex items-center justify-center rounded hover:bg-cyan-500/30 text-cyan-300 transition-colors"
              >
                <ChevronRight className={cn("w-3 h-3 transition-transform duration-200", isExpanded ? "rotate-90" : "")} />
              </button>
            ) : (
              <span className="w-4 h-4 flex items-center justify-center text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors" />
              </span>
            )}

            {nodeIcon}
            <span className="truncate">{node.name}</span>
            <span className="text-[10px] text-slate-500 font-mono hidden group-hover:inline ml-1">
              ({node.code})
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {levelBadge}
            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col relative before:absolute before:left-4 before:top-0 before:bottom-2 before:w-[1px] before:bg-cyan-900/40">
            {node.children!.map((child) => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2 relative z-[100]" ref={dropdownRef}>
      <span className="text-xs font-bold text-slate-300 whitespace-nowrap tracking-wide flex items-center gap-1">
        <GitFork className="w-3.5 h-3.5 text-cyan-400" />
        组织架构:
      </span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 px-3 py-1.5 bg-gradient-to-r from-[#071d3a] via-[#092952] to-[#061c3b] border border-cyan-400/80 hover:border-cyan-300 text-cyan-100 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded transition-all cursor-pointer min-w-[210px]"
        >
          <div className="flex items-center gap-1.5 truncate max-w-[210px]">
            <span className={cn(
              "px-1 py-0.2 text-[9px] rounded font-mono font-bold shrink-0",
              selectedDept.level === 1 ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400/60" :
              selectedDept.level === 2 ? "bg-blue-500/30 text-blue-200 border border-blue-400/60" :
              "bg-purple-500/30 text-purple-200 border border-purple-400/60"
            )}>
              L{selectedDept.level}
            </span>
            <span className="truncate text-cyan-100 text-xs tracking-tight">
              {deptPath.length > 1 ? `${deptPath[deptPath.length - 2]} > ${deptPath[deptPath.length - 1]}` : selectedDept.name}
            </span>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 text-cyan-300 transition-transform duration-300 shrink-0", isOpen ? "rotate-180" : "")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute top-full right-0 mt-2 w-[340px] bg-[#030d22]/95 border border-cyan-400/80 rounded-sm shadow-[0_15px_40px_rgba(0,0,0,0.95),0_0_25px_rgba(6,182,212,0.2)] overflow-hidden z-[999] backdrop-blur-xl"
            >
              {/* Dropdown Header & Search */}
              <div className="p-2.5 border-b border-[#1e3a5f]/80 bg-gradient-to-r from-[#071d3a] to-[#041229]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
                    <Filter className="w-3 h-3 text-cyan-400" />
                    组织架构层次 (1级/2级/3级)
                  </span>
                </div>

                {/* 搜索框 */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索 1/2/3 级部门名称..."
                    className="w-full bg-[#07162e] border border-[#1e3a5f] focus:border-cyan-400/90 rounded-xs pl-8 pr-7 py-1 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* 层级 Tag 快捷选择 */}
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => setLevelFilter('all')}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer",
                      levelFilter === 'all'
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "bg-[#0b213f] text-slate-300 hover:bg-cyan-900/40"
                    )}
                  >
                    全部 ({counts.all})
                  </button>
                  <button
                    onClick={() => setLevelFilter(1)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer",
                      levelFilter === 1
                        ? "bg-cyan-400 text-slate-950 font-bold"
                        : "bg-[#0b213f] text-cyan-300 hover:bg-cyan-900/40"
                    )}
                  >
                    1级 ({counts.l1})
                  </button>
                  <button
                    onClick={() => setLevelFilter(2)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer",
                      levelFilter === 2
                        ? "bg-blue-400 text-slate-950 font-bold"
                        : "bg-[#0b213f] text-blue-300 hover:bg-blue-900/40"
                    )}
                  >
                    2级 ({counts.l2})
                  </button>
                  <button
                    onClick={() => setLevelFilter(3)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer",
                      levelFilter === 3
                        ? "bg-purple-400 text-slate-950 font-bold"
                        : "bg-[#0b213f] text-purple-300 hover:bg-purple-900/40"
                    )}
                  >
                    3级 ({counts.l3})
                  </button>
                </div>
              </div>

              {/* Department Tree List */}
              <div className="p-1.5 max-h-[320px] overflow-y-auto custom-scrollbar">
                {organizationTree.map((node) => renderTreeNode(node))}
              </div>

              {/* Dropdown Footer Status */}
              <div className="px-3 py-1.5 border-t border-[#1e3a5f]/80 bg-[#020a1a] flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  当前: <strong className="text-cyan-200">{selectedDept.name}</strong>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface HeaderProps {
  selectedDept: DepartmentNode;
  onSelectDept: (dept: DepartmentNode) => void;
}

function Header({ selectedDept, onSelectDept }: HeaderProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const mins = pad(now.getMinutes());
      const secs = pad(now.getSeconds());
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      setTimeStr(`${year}-${month}-${day} ${hours}:${mins}:${secs} ${days[now.getDay()]}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => setInterval(updateTime, 1000);
  }, []);

  return (
    <header className="shrink-0 bg-[#030917] border-b border-[#1e3a5f]/60 relative z-50 flex flex-col">
      {/* 顶部中央聚光特效 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[40px] bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.35)_0%,_transparent_70%)] pointer-events-none" />

      {/* 单行 Header：左侧时间 + 中央标题 + 右侧组织架构与管理员 */}
      <div className="h-[48px] px-6 flex items-center justify-between relative z-10">
        {/* 左侧：实时时间模块 */}
        <div className="flex items-center gap-2 bg-[#071936]/80 px-3 py-1 rounded border border-[#1e3a5f]/80 shadow-[inset_0_0_8px_rgba(6,182,212,0.2)] text-xs font-mono text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeStr || '2026-08-07 16:07:33 星期五'}</span>
        </div>

        {/* 中央主标题：虚拟化资源池驾驶舱 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full flex items-center justify-center pointer-events-none z-20">
          <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
            虚拟化资源池驾驶舱
          </h1>
        </div>

        {/* 右侧：组织架构下拉选择与管理员 */}
        <div className="flex items-center gap-4 text-xs font-mono text-cyan-300">
          {/* 组织架构下拉选择 */}
          <OrganizationSwitcher selectedDept={selectedDept} onSelectDept={onSelectDept} />

          {/* 管理员 */}
          <div className="flex items-center gap-2 pl-3 border-l border-[#1e3a5f] font-sans">
            <div className="w-6 h-6 rounded-full bg-[#0a1628] border border-cyan-500/40 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=0a1628" alt="User" />
            </div>
            <span className="text-slate-200 font-medium">管理员</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function ActivityIcon(props: any) {
  return <Cpu {...props} />;
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [selectedDept, setSelectedDept] = useState<DepartmentNode>(organizationTree[0]);
  const [loadTab, setLoadTab] = useState<'host' | 'vm'>('host');
  const [hostTop5Tab, setHostTop5Tab] = useState<'cpu' | 'memory'>('cpu');
  const [vmTop5Tab, setVmTop5Tab] = useState<'cpu' | 'memory'>('cpu');
  const [storagePage, setStoragePage] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const storageTimer = setInterval(() => {
      setStoragePage((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(storageTimer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#020713] text-slate-200 font-sans flex flex-col selection:bg-cyan-900/50">
      {/* 网格发光背景 */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(rgba(30, 58, 95, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 58, 95, 0.12) 1px, transparent 1px)`,
             backgroundSize: '36px 36px',
             backgroundPosition: 'center center'
           }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_rgba(6,182,212,0.05),_transparent_70%)] pointer-events-none"></div>

      <Header selectedDept={selectedDept} onSelectDept={setSelectedDept} />

      <main className="flex-1 p-2.5 flex flex-col gap-2 min-h-0 relative z-10 w-full max-w-[1920px] mx-auto overflow-hidden">
        {selectedDept.level === 3 ? (
          <motion.div 
            className="flex-1 flex flex-col gap-2.5 min-h-0"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
            }}
          >
            {/* 上半部分 (等高对齐): 左侧(资源使用率 + 告警统计) 与 右侧(虚拟机负载趋势) 高度完全一致 */}
            <div className="flex-1 flex gap-2.5 min-h-0">
              {/* 上半部分-左侧栏 (23% 宽度): 资源使用率 + 告警统计 */}
              <div className="w-[23%] flex flex-col gap-2.5 shrink-0">
                {/* 1. 资源使用率 (1/2 高度): 参考一级模块 3D 科技圆环 3 环图样式，存储无需切页点 */}
                <motion.div variants={fadeUp} className="flex-1 flex">
                  <Panel 
                    title="资源使用率" 
                    className="w-full"
                  >
                    {(() => {
                      const scale = selectedDept.scaleFactor ?? 0.15;
                      const cpuTotal = Math.round(4290 * scale);
                      const cpuAllocated = Math.round(1924 * scale);

                      const memTotal = (11.65 * scale).toFixed(2);
                      const memAllocated = (5.34 * scale).toFixed(2);

                      const diskTotal = (453.49 * scale).toFixed(2);
                      const diskAllocated = (209.08 * scale).toFixed(2);

                      const ringItems = [
                        { name: 'CPU', percent: 44.85, total: `${cpuTotal.toLocaleString()} 核`, allocated: `${cpuAllocated.toLocaleString()} 核`, color: '#0088ff' },
                        { name: '内存', percent: 45.89, total: `${memTotal} TB`, allocated: `${memAllocated} TB`, color: '#f59e0b' },
                        { name: '存储', percent: 46.10, total: `${diskTotal} TB`, allocated: `${diskAllocated} TB`, color: '#10b981' },
                      ];

                      return (
                        <div className="grid grid-cols-3 gap-1.5 h-full py-0.5">
                          {ringItems.map((res, i) => (
                            <div
                              key={i}
                              className="bg-[#061836]/80 border border-[#1e3a5f]/80 rounded-md p-1.5 flex flex-col justify-between items-center hover:border-cyan-400/60 transition-all text-center group relative overflow-hidden"
                            >
                              {/* 科技感双圈圆环 */}
                              <div className="flex-1 flex flex-col items-center justify-center w-full py-0.5">
                                <div className="relative w-13 h-13 flex items-center justify-center shrink-0">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    {/* 外部背景轨圈 */}
                                    <path
                                      stroke="#112747"
                                      strokeWidth="3.6"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    {/* 内部精致虚线刻度圈 */}
                                    <circle
                                      cx="18"
                                      cy="18"
                                      r="12.2"
                                      stroke="rgba(80, 140, 210, 0.4)"
                                      strokeWidth="0.8"
                                      strokeDasharray="1.2 2.2"
                                      fill="none"
                                    />
                                    {/* 彩色激活进度弧 */}
                                    <path
                                      stroke={res.color}
                                      strokeDasharray={`${res.percent}, 100`}
                                      strokeWidth="3.6"
                                      strokeLinecap="round"
                                      fill="none"
                                      style={{ filter: `drop-shadow(0 0 5px ${res.color}99)` }}
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[10.5px] font-black font-mono text-slate-100 tracking-tight group-hover:scale-105 transition-transform">
                                      {res.percent}%
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-300">
                                      {res.name}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* 圆环下方指标数据 (无需切页点) */}
                              <div className="w-full text-[8.5px] border-t border-[#1e3a5f]/60 pt-1 mt-auto space-y-0.5">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">总量</span>
                                  <span className="font-mono font-bold text-slate-200">{res.total}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">已使用</span>
                                  <span className="font-mono font-bold text-cyan-300">{res.allocated}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </Panel>
                </motion.div>

                {/* 2. 告警统计 (1/2 高度) */}
                <motion.div variants={fadeUp} className="flex-1 flex">
                  <Panel title="告警统计" className="w-full">
                    <div className="flex items-center justify-between h-full px-1 py-1">
                      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={alarmStatsData.slices} cx="50%" cy="50%" innerRadius={22} outerRadius={34} paddingAngle={4} dataKey="value" stroke="none">
                              {alarmStatsData.slices.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xs font-black font-mono text-slate-100">{Math.round(alarmStatsData.totalPending * (selectedDept.scaleFactor ?? 0.15))}</span>
                          <span className="text-[8px] text-slate-400">待处理</span>
                        </div>
                      </div>
                      <div className="flex-1 pl-2 space-y-1 text-[9.5px]">
                        <div className="flex justify-between items-center bg-[#071936]/60 px-1.5 py-0.5 rounded border border-[#1e3a5f]/60">
                          <span className="flex items-center gap-1 text-slate-300"><span className="w-1.5 h-1.5 rounded-xs bg-red-500"></span>灾难</span>
                          <span className="font-mono font-bold text-red-400">{Math.max(1, Math.round(alarmStatsData.disaster * (selectedDept.scaleFactor ?? 0.15)))}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#071936]/60 px-1.5 py-0.5 rounded border border-[#1e3a5f]/60">
                          <span className="flex items-center gap-1 text-slate-300"><span className="w-1.5 h-1.5 rounded-xs bg-amber-500"></span>严重</span>
                          <span className="font-mono font-bold text-amber-400">{Math.max(2, Math.round(alarmStatsData.critical * (selectedDept.scaleFactor ?? 0.15)))}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#071936]/60 px-1.5 py-0.5 rounded border border-[#1e3a5f]/60">
                          <span className="flex items-center gap-1 text-slate-300"><span className="w-1.5 h-1.5 rounded-xs bg-blue-500"></span>一般</span>
                          <span className="font-mono font-bold text-blue-400">{Math.round(alarmStatsData.minor * (selectedDept.scaleFactor ?? 0.15))}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#071936]/60 px-1.5 py-0.5 rounded border border-[#1e3a5f]/60">
                          <span className="flex items-center gap-1 text-slate-300"><span className="w-1.5 h-1.5 rounded-xs bg-slate-400"></span>提示</span>
                          <span className="font-mono font-bold text-slate-300">{Math.round(alarmStatsData.info * (selectedDept.scaleFactor ?? 0.15))}</span>
                        </div>
                      </div>
                    </div>
                  </Panel>
                </motion.div>
              </div>

              {/* 上半部分-右侧 (flex-1 宽度): 虚拟机负载趋势 (4全尺寸图表) */}
              <motion.div variants={fadeUp} className="flex-1 flex min-w-0">
                <Panel 
                  title="虚拟机负载趋势" 
                  className="w-full"
                  action={
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-400/40 font-mono font-bold">
                      虚拟机监控
                    </span>
                  }
                >
                  <div className="grid grid-cols-2 gap-3 h-full p-1">
                    {/* 1. 虚拟机 CPU 使用率 (%) */}
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded-md p-2 flex flex-col justify-between">
                      <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>虚拟机 CPU 使用率 (%)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">均值: 45%</span>
                      </div>
                      <div className="flex-1 min-h-[90px] mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="subCpuGrad3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="cpu" stroke="#38bdf8" strokeWidth={2} fill="url(#subCpuGrad3)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 2. 虚拟机 内存使用率 (%) */}
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded-md p-2 flex flex-col justify-between">
                      <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>虚拟机 内存使用率 (%)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">均值: 68%</span>
                      </div>
                      <div className="flex-1 min-h-[90px] mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="subMemGrad3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0099ff" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#0099ff" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="memory" stroke="#0099ff" strokeWidth={2} fill="url(#subMemGrad3)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 3. 磁盘 IO 监控 */}
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded-md p-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">磁盘 IO 监控 (MB/s)</span>
                        <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>读</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>写</span>
                        </div>
                      </div>
                      <div className="flex-1 min-h-[90px] mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Line type="monotone" dataKey="diskIoRead" stroke="#22d3ee" strokeWidth={2} dot={false} name="读" />
                            <Line type="monotone" dataKey="diskIoWrite" stroke="#3b82f6" strokeWidth={2} dot={false} name="写" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 4. 网络流量监控 */}
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded-md p-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">网络流量监控 (Gbps)</span>
                        <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>流入</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>流出</span>
                        </div>
                      </div>
                      <div className="flex-1 min-h-[90px] mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Line type="monotone" dataKey="netIn" stroke="#34d399" strokeWidth={2} dot={false} name="流入" />
                            <Line type="monotone" dataKey="netOut" stroke="#60a5fa" strokeWidth={2} dot={false} name="流出" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            </div>

            {/* 下半部分 (等高对齐): 虚拟机 CPU TOP10 + 虚拟机 内存 TOP10 + 应用资源情况，三者高度一致 */}
            <div className="flex-1 flex gap-2.5 min-h-0">
              {/* 1. 虚拟机 CPU TOP10 (自动循环无缝动态滚动) */}
              <motion.div variants={fadeUp} className="w-[23%] flex shrink-0">
                <Panel title="虚拟机 CPU TOP10" className="w-full">
                  <div className="h-full overflow-hidden relative">
                    <div className="flex flex-col gap-1 text-[9px] animate-auto-scroll">
                      {[...vmTop10Data.cpu, ...vmTop10Data.cpu].map((item, idx) => (
                        <div key={`${item.rank}-${idx}`} className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded px-1.5 py-1 flex flex-col gap-0.5 hover:border-cyan-400/50 transition-all shrink-0">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 truncate text-slate-200 font-medium" title={item.name}>
                              <span className="px-1 py-0.1 rounded bg-blue-500/20 text-cyan-300 font-mono text-[8.5px] border border-cyan-500/30">{item.rank}</span>
                              <span className="truncate text-[9px]">{item.name}</span>
                            </span>
                            <span className="font-mono font-bold text-cyan-300 shrink-0 ml-1 text-[9px]">{item.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] transition-all duration-500" style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              </motion.div>

              {/* 2. 虚拟机 内存 TOP10 (自动循环无缝动态滚动) */}
              <motion.div variants={fadeUp} className="w-[23%] flex shrink-0">
                <Panel title="虚拟机 内存 TOP10" className="w-full">
                  <div className="h-full overflow-hidden relative">
                    <div className="flex flex-col gap-1 text-[9px] animate-auto-scroll" style={{ animationDuration: '24s' }}>
                      {[...vmTop10Data.memory, ...vmTop10Data.memory].map((item, idx) => (
                        <div key={`${item.rank}-${idx}`} className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded px-1.5 py-1 flex flex-col gap-0.5 hover:border-cyan-400/50 transition-all shrink-0">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 truncate text-slate-200 font-medium" title={item.name}>
                              <span className="px-1 py-0.1 rounded bg-blue-500/20 text-cyan-300 font-mono text-[8.5px] border border-cyan-500/30">{item.rank}</span>
                              <span className="truncate text-[9px]">{item.name}</span>
                            </span>
                            <span className="font-mono font-bold text-cyan-300 shrink-0 ml-1 text-[9px]">{item.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] transition-all duration-500" style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              </motion.div>

              {/* 3. 应用资源情况 */}
              <motion.div variants={fadeUp} className="flex-1 flex min-w-0">
                {(() => {
                  const appsList = getDepartmentAppsData(selectedDept.name);
                  const totalDeptVms = appsList.reduce((acc, a) => acc + a.vms, 0);

                  return (
                    <Panel
                      title="应用资源情况"
                      className="w-full"
                      action={
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-400/30 font-mono font-bold">
                          应用总数: {appsList.length}个
                        </span>
                      }
                    >
                      <div className="flex flex-col h-full overflow-hidden text-[10px]">
                        {/* 组织汇总指标卡格 (4卡片: 虚拟机, CPU, 内存, 磁盘) */}
                        <div className="grid grid-cols-4 gap-1.5 mb-1.5 shrink-0">
                          <div className="bg-[#040e24]/90 border border-[#142d54] rounded-md p-1.5 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-extrabold text-slate-200">虚拟机</span>
                              <div className="w-4 h-4 rounded border border-purple-400/50 bg-purple-500/10 text-purple-300 flex items-center justify-center shrink-0">
                                <Server className="w-2.5 h-2.5" />
                              </div>
                            </div>
                            <div className="flex items-baseline gap-0.5 mt-0.5">
                              <span className="text-sm font-black font-mono text-slate-100">{totalDeptVms}</span>
                              <span className="text-[9px] text-slate-400 font-mono">台</span>
                            </div>
                          </div>

                          <div className="bg-[#040e24]/90 border border-[#142d54] rounded-md p-1.5 flex flex-col justify-between hover:border-blue-500/50 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-extrabold text-slate-200">CPU</span>
                              <div className="w-4 h-4 rounded border border-blue-400/50 bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
                                <Cpu className="w-2.5 h-2.5" />
                              </div>
                            </div>
                            <div className="flex items-baseline gap-0.5 mt-0.5">
                              <span className="text-sm font-black font-mono text-slate-100">292</span>
                              <span className="text-[8.5px] text-slate-400 font-mono">核 (62%)</span>
                            </div>
                          </div>

                          <div className="bg-[#040e24]/90 border border-[#142d54] rounded-md p-1.5 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-extrabold text-slate-200">内存</span>
                              <div className="w-4 h-4 rounded border border-purple-400/50 bg-purple-500/10 text-purple-300 flex items-center justify-center shrink-0">
                                <Server className="w-2.5 h-2.5" />
                              </div>
                            </div>
                            <div className="flex items-baseline gap-0.5 mt-0.5">
                              <span className="text-sm font-black font-mono text-slate-100">752</span>
                              <span className="text-[8.5px] text-slate-400 font-mono">GB (68%)</span>
                            </div>
                          </div>

                          <div className="bg-[#040e24]/90 border border-[#142d54] rounded-md p-1.5 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-extrabold text-slate-200">磁盘</span>
                              <div className="w-4 h-4 rounded border border-emerald-400/50 bg-emerald-500/10 text-emerald-300 flex items-center justify-center shrink-0">
                                <HardDrive className="w-2.5 h-2.5" />
                              </div>
                            </div>
                            <div className="flex items-baseline gap-0.5 mt-0.5">
                              <span className="text-sm font-black font-mono text-slate-100">5300</span>
                              <span className="text-[8.5px] text-slate-400 font-mono">GB (56%)</span>
                            </div>
                          </div>
                        </div>

                        {/* 表头 Header (清晰列隔离分隔线) */}
                        <div className="grid grid-cols-12 gap-2 font-bold text-slate-300 border-b border-[#1e3a5f]/80 pb-1.5 px-2 bg-[#040f24]/90 text-[9.5px] items-center shrink-0">
                          <div className="col-span-3 flex items-center gap-1">
                            <span>应用名称</span>
                            <span className="text-[8px] text-slate-500">⇅</span>
                          </div>
                          <div className="col-span-2 text-center border-l border-[#1e3a5f]/50 pl-2">
                            <span>虚拟机数量</span>
                            <span className="text-[8px] text-slate-500 ml-0.5">⇅</span>
                          </div>
                          <div className="col-span-2 text-center border-l border-[#1e3a5f]/50 pl-2">
                            <span>CPU (利用率)</span>
                            <span className="text-[8px] text-slate-500 ml-0.5">⇅</span>
                          </div>
                          <div className="col-span-2 text-center border-l border-[#1e3a5f]/50 pl-2">
                            <span>内存 (利用率)</span>
                            <span className="text-[8px] text-slate-500 ml-0.5">⇅</span>
                          </div>
                          <div className="col-span-3 text-center border-l border-[#1e3a5f]/50 pl-2">
                            <span>磁盘 (利用率)</span>
                            <span className="text-[8px] text-slate-500 ml-0.5">⇅</span>
                          </div>
                        </div>

                        {/* 表格明细列表 (带清晰列隔离) */}
                        <div className="flex-1 overflow-y-auto space-y-1.5 pt-1.5 pr-0.5">
                          {appsList.map((app) => (
                            <div
                              key={app.id}
                              className="px-2 py-1.5 grid grid-cols-12 gap-2 items-center bg-[#04122d]/70 hover:bg-[#071b40] border border-[#1e3a5f]/60 rounded-md shadow-xs text-slate-300 transition-all group"
                            >
                              {/* 1. 应用名称 */}
                              <div className="col-span-3 text-slate-100 font-semibold text-[10px] truncate group-hover:text-cyan-300 transition-colors" title={app.name}>
                                {app.name}
                              </div>
                              {/* 2. 虚拟机数量 */}
                              <div className="col-span-2 text-center font-mono text-slate-200 font-bold text-[9.5px] border-l border-[#1e3a5f]/50 pl-2">
                                {app.vms} 台
                              </div>
                              {/* 3. CPU (利用率) */}
                              <div className="col-span-2 flex items-center justify-center gap-1.5 font-mono border-l border-[#1e3a5f]/50 pl-2">
                                <span className="text-slate-200 text-[9.5px] font-bold">{app.cpu}</span>
                                <span className={cn(
                                  "px-1 py-0.2 rounded text-[9px] font-mono font-extrabold shrink-0",
                                  app.cpuPercent > 85 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                )}>
                                  {app.cpuPercent}%
                                </span>
                              </div>
                              {/* 4. 内存 (利用率) */}
                              <div className="col-span-2 flex items-center justify-center gap-1.5 font-mono border-l border-[#1e3a5f]/50 pl-2">
                                <span className="text-slate-200 text-[9.5px] font-bold">{app.mem}</span>
                                <span className={cn(
                                  "px-1 py-0.2 rounded text-[9px] font-mono font-extrabold shrink-0",
                                  app.memPercent > 85 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                )}>
                                  {app.memPercent}%
                                </span>
                              </div>
                              {/* 5. 磁盘 (利用率) */}
                              <div className="col-span-3 flex items-center justify-center gap-1.5 font-mono border-l border-[#1e3a5f]/50 pl-2">
                                <span className="text-slate-200 text-[9.5px] font-bold">{app.disk}</span>
                                <span className={cn(
                                  "px-1 py-0.2 rounded text-[9px] font-mono font-extrabold shrink-0",
                                  app.diskPercent > 85 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                )}>
                                  {app.diskPercent}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Panel>
                  );
                })()}
              </motion.div>
            </div>
          </motion.div>
        ) : selectedDept.level === 2 ? (
          <motion.div 
            className="flex-1 flex gap-2.5 min-h-0"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
            }}
          >
            {/* 左侧栏 (20% 宽度): 部门资源使用率 + 部门告警统计 */}
            <div className="w-[20%] flex flex-col gap-2.5 shrink-0">
              {/* 部门资源使用率 */}
              <motion.div variants={fadeUp} className="flex-[1.4] flex">
                <Panel 
                  title="资源使用率" 
                  className="w-full"
                >
                  {(() => {
                    const scale = selectedDept.scaleFactor ?? 0.2;
                    const cpuTotal = Math.round(4290 * scale);
                    const cpuAllocated = Math.round(1924 * scale);
                    const cpuUnallocated = cpuTotal - cpuAllocated;

                    const memTotal = (11.65 * scale).toFixed(2);
                    const memAllocated = (5.34 * scale).toFixed(2);
                    const memUnallocated = ((11.65 - 5.34) * scale).toFixed(2);

                    const diskTotal = (453.49 * scale).toFixed(2);
                    const diskAllocated = (209.08 * scale).toFixed(2);
                    const diskUnallocated = ((453.49 - 209.08) * scale).toFixed(2);

                    return (
                      <div className="flex flex-col justify-between h-full py-0.5 gap-2">
                        {/* Card 1: CPU使用率 */}
                        <div className="flex-1 flex flex-col justify-between bg-[#061836]/90 border border-[#1e3a5f]/80 rounded-md p-2.5 hover:border-cyan-400/60 transition-all gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
                                <Cpu className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-[11px] font-extrabold text-slate-200">CPU使用率</div>
                                <div className="text-[9.5px] text-slate-400 font-mono">总量 {cpuTotal.toLocaleString()} 核</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] text-slate-400">使用率</div>
                              <div className="text-sm font-black font-mono text-cyan-300">44.85 %</div>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] transition-all duration-500" style={{ width: '44.85%' }} />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">已使用</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{cpuAllocated.toLocaleString()} 核</div>
                            </div>
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">未使用</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{cpuUnallocated.toLocaleString()} 核</div>
                            </div>
                          </div>
                        </div>

                        {/* Card 2: 内存使用率 */}
                        <div className="flex-1 flex flex-col justify-between bg-[#061836]/90 border border-[#1e3a5f]/80 rounded-md p-2.5 hover:border-cyan-400/60 transition-all gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
                                <Server className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-[11px] font-extrabold text-slate-200">内存使用率</div>
                                <div className="text-[9.5px] text-slate-400 font-mono">总量 {memTotal} TB</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] text-slate-400">使用率</div>
                              <div className="text-sm font-black font-mono text-cyan-300">45.89 %</div>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] transition-all duration-500" style={{ width: '45.89%' }} />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">已使用</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{memAllocated} TB</div>
                            </div>
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">未使用</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{memUnallocated} TB</div>
                            </div>
                          </div>
                        </div>

                        {/* Card 3: 存储使用率 */}
                        <div className="flex-1 flex flex-col justify-between bg-[#061836]/90 border border-[#1e3a5f]/80 rounded-md p-2.5 hover:border-cyan-400/60 transition-all gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
                                <HardDrive className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-[11px] font-extrabold text-slate-200">存储使用率</div>
                                <div className="text-[9.5px] text-slate-400 font-mono">总量 {diskTotal} TB</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] text-slate-400">使用率</div>
                              <div className="text-sm font-black font-mono text-cyan-300">46.1 %</div>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] transition-all duration-500" style={{ width: '46.1%' }} />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">已使用</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{diskAllocated} TB</div>
                            </div>
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">未使用</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{diskUnallocated} TB</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </Panel>
              </motion.div>

              {/* 部门告警统计 */}
              <motion.div variants={fadeUp} className="flex-[1] flex">
                <Panel title="告警统计" className="w-full">
                  <div className="flex items-center justify-between h-full px-2">
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={alarmStatsData.slices} cx="50%" cy="50%" innerRadius={30} outerRadius={42} paddingAngle={4} dataKey="value" stroke="none">
                            {alarmStatsData.slices.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-black font-mono text-slate-100">{Math.round(alarmStatsData.totalPending * (selectedDept.scaleFactor ?? 0.2))}</span>
                        <span className="text-[9px] text-slate-400">待处理告警</span>
                      </div>
                    </div>
                    <div className="flex-1 pl-3 space-y-1 text-xs">
                      <div className="flex justify-between items-center bg-[#071936]/60 p-1 rounded border border-[#1e3a5f]/60">
                        <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-xs bg-red-500 shadow-[0_0_6px_#ef4444]"></span>灾难</span>
                        <span className="font-mono font-bold text-red-400">{Math.max(1, Math.round(alarmStatsData.disaster * (selectedDept.scaleFactor ?? 0.2)))}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#071936]/60 p-1 rounded border border-[#1e3a5f]/60">
                        <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-xs bg-amber-500 shadow-[0_0_6px_#f59e0b]"></span>严重</span>
                        <span className="font-mono font-bold text-amber-400">{Math.max(2, Math.round(alarmStatsData.critical * (selectedDept.scaleFactor ?? 0.2)))}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#071936]/60 p-1 rounded border border-[#1e3a5f]/60">
                        <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-xs bg-blue-500 shadow-[0_0_6px_#3b82f6]"></span>一般</span>
                        <span className="font-mono font-bold text-blue-400">{Math.round(alarmStatsData.minor * (selectedDept.scaleFactor ?? 0.2))}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#071936]/60 p-1 rounded border border-[#1e3a5f]/60">
                        <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-xs bg-slate-400"></span>提示</span>
                        <span className="font-mono font-bold text-slate-300">{Math.round(alarmStatsData.info * (selectedDept.scaleFactor ?? 0.2))}</span>
                      </div>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            </div>

            {/* 中间栏 (扩宽 flex-1 拓展渲染): 部门虚拟机负载趋势 (4全尺寸图表) */}
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
              <motion.div variants={fadeUp} className="flex-1 flex">
                <Panel 
                  title="虚拟机负载趋势" 
                  className="w-full"
                  action={
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-400/40 font-mono font-bold">
                      虚拟机监控
                    </span>
                  }
                >
                  <div className="grid grid-cols-2 gap-3 h-full p-1">
                    {/* 1. 虚拟机 CPU 使用率 (%) */}
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded-md p-2.5 flex flex-col justify-between">
                      <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>虚拟机 CPU 使用率 (%)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">均值: 45%</span>
                      </div>
                      <div className="flex-1 min-h-[110px] mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="subCpuGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="cpu" stroke="#38bdf8" strokeWidth={2} fill="url(#subCpuGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 2. 虚拟机 内存使用率 (%) */}
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded-md p-2.5 flex flex-col justify-between">
                      <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>虚拟机 内存使用率 (%)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">均值: 68%</span>
                      </div>
                      <div className="flex-1 min-h-[110px] mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="subMemGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0099ff" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#0099ff" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="memory" stroke="#0099ff" strokeWidth={2} fill="url(#subMemGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 3. 磁盘 IO 监控 */}
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded-md p-2.5 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">磁盘 IO 监控 (MB/s)</span>
                        <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>读</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>写</span>
                        </div>
                      </div>
                      <div className="flex-1 min-h-[110px] mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Line type="monotone" dataKey="diskIoRead" stroke="#22d3ee" strokeWidth={2} dot={false} name="读" />
                            <Line type="monotone" dataKey="diskIoWrite" stroke="#3b82f6" strokeWidth={2} dot={false} name="写" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 4. 网络流量监控 */}
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded-md p-2.5 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">网络流量监控 (Gbps)</span>
                        <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>流入</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>流出</span>
                        </div>
                      </div>
                      <div className="flex-1 min-h-[110px] mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Line type="monotone" dataKey="netIn" stroke="#34d399" strokeWidth={2} dot={false} name="流入" />
                            <Line type="monotone" dataKey="netOut" stroke="#60a5fa" strokeWidth={2} dot={false} name="流出" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            </div>

            {/* 右侧栏 (35% 宽度): 部门虚拟机资源 TOP5 + 部门应用资源情况 */}
            <div className="w-[35%] flex flex-col gap-2.5 shrink-0">
              {/* 部门虚拟机资源 TOP5 */}
              <motion.div variants={fadeUp} className="flex-[0.9] flex">
                <Panel 
                  title="虚拟机资源 TOP5" 
                  className="w-full"
                  action={
                    <div className="flex bg-[#040e21] p-0.5 rounded border border-[#1e3a5f] text-[9px]">
                      <button onClick={() => setVmTop5Tab('cpu')} className={cn("px-1.5 py-0.2 rounded transition-colors cursor-pointer", vmTop5Tab === 'cpu' ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200")}>CPU</button>
                      <button onClick={() => setVmTop5Tab('memory')} className={cn("px-1.5 py-0.2 rounded transition-colors cursor-pointer", vmTop5Tab === 'memory' ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200")}>内存</button>
                    </div>
                  }
                >
                  <div className="flex flex-col justify-between h-full py-0.5 space-y-1 text-[10px]">
                    {(vmTop5Tab === 'cpu' ? vmTop5Data.cpu : vmTop5Data.memory).map((item) => (
                      <div key={item.rank} className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded p-1.5 flex flex-col gap-1 hover:border-cyan-400/50 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 truncate text-slate-200 font-medium" title={item.name}>
                            <span className="px-1 py-0.2 rounded bg-blue-500/20 text-cyan-300 font-mono text-[9px] border border-cyan-500/30">{item.rank}</span>
                            <span className="truncate">{item.name}</span>
                          </span>
                          <span className="font-mono font-bold text-cyan-300 shrink-0 ml-1">{item.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] transition-all duration-500" style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </motion.div>

              {/* 部门应用资源情况 (重构科技感组织卡片与舒展表格行) */}
              <motion.div variants={fadeUp} className="flex-[1.4] flex">
                {(() => {
                  const appsList = getDepartmentAppsData(selectedDept.name);
                  const totalDeptVms = appsList.reduce((acc, a) => acc + a.vms, 0);

                  return (
                    <Panel
                      title="应用资源情况"
                      className="w-full"
                      action={
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-400/30 font-mono font-bold">
                          应用总数: {appsList.length}个
                        </span>
                      }
                    >
                      <div className="flex flex-col h-full overflow-hidden text-[10px]">
                        {/* 1. 组织汇总指标卡格 (虚拟机、CPU、内存、磁盘，包含利用率) */}
                        <div className="grid grid-cols-4 gap-2 mb-2 shrink-0">
                          {/* Card 1: 虚拟机 */}
                          <div className="bg-[#040e24]/90 border border-[#142d54] rounded-md p-2 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-slate-200">虚拟机</span>
                              <div className="w-5 h-5 rounded border border-purple-400/50 bg-purple-500/10 text-purple-300 flex items-center justify-center shrink-0">
                                <Server className="w-3 h-3" />
                              </div>
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-base font-black font-mono text-slate-100">{totalDeptVms}</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">台</span>
                            </div>
                          </div>

                          {/* Card 2: CPU */}
                          <div className="bg-[#040e24]/90 border border-[#142d54] rounded-md p-2 flex flex-col justify-between hover:border-blue-500/50 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-slate-200">CPU</span>
                              <div className="w-5 h-5 rounded border border-blue-400/50 bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
                                <Cpu className="w-3 h-3" />
                              </div>
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-base font-black font-mono text-slate-100">292</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">核 (62%)</span>
                            </div>
                          </div>

                          {/* Card 3: 内存 */}
                          <div className="bg-[#040e24]/90 border border-[#142d54] rounded-md p-2 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-slate-200">内存</span>
                              <div className="w-5 h-5 rounded border border-purple-400/50 bg-purple-500/10 text-purple-300 flex items-center justify-center shrink-0">
                                <Server className="w-3 h-3" />
                              </div>
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-base font-black font-mono text-slate-100">752</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">GB (68%)</span>
                            </div>
                          </div>

                          {/* Card 4: 磁盘 */}
                          <div className="bg-[#040e24]/90 border border-[#142d54] rounded-md p-2 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-slate-200">磁盘</span>
                              <div className="w-5 h-5 rounded border border-emerald-400/50 bg-emerald-500/10 text-emerald-300 flex items-center justify-center shrink-0">
                                <HardDrive className="w-3 h-3" />
                              </div>
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-base font-black font-mono text-slate-100">5300</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">GB (56%)</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. 表头 Header (清晰列隔离分隔线) */}
                        <div className="grid grid-cols-12 gap-2 font-bold text-slate-300 border-b border-[#1e3a5f]/80 pb-2 px-3 bg-[#040f24]/90 text-[10px] items-center shrink-0">
                          <div className="col-span-3 flex items-center gap-1">
                            <span>应用名称</span>
                            <span className="text-[8.5px] text-slate-500">⇅</span>
                          </div>
                          <div className="col-span-2 text-center border-l border-[#1e3a5f]/50 pl-2">
                            <span>虚拟机数量</span>
                            <span className="text-[8.5px] text-slate-500 ml-0.5">⇅</span>
                          </div>
                          <div className="col-span-2 text-center border-l border-[#1e3a5f]/50 pl-2">
                            <span>CPU (利用率)</span>
                            <span className="text-[8.5px] text-slate-500 ml-0.5">⇅</span>
                          </div>
                          <div className="col-span-2 text-center border-l border-[#1e3a5f]/50 pl-2">
                            <span>内存 (利用率)</span>
                            <span className="text-[8.5px] text-slate-500 ml-0.5">⇅</span>
                          </div>
                          <div className="col-span-3 text-center border-l border-[#1e3a5f]/50 pl-2">
                            <span>磁盘 (利用率)</span>
                            <span className="text-[8.5px] text-slate-500 ml-0.5">⇅</span>
                          </div>
                        </div>

                        {/* 3. 表格明细列表 (带清晰列隔离与气泡标签) */}
                        <div className="flex-1 overflow-y-auto space-y-2 pt-2 pr-0.5">
                          {appsList.map((app) => (
                            <div
                              key={app.id}
                              className="px-3 py-2 grid grid-cols-12 gap-2 items-center bg-[#04122d]/70 hover:bg-[#071b40] border border-[#1e3a5f]/60 rounded-md shadow-xs text-slate-300 transition-all group"
                            >
                              {/* 1. 应用名称 */}
                              <div className="col-span-3 text-slate-100 font-semibold text-[10.5px] truncate group-hover:text-cyan-300 transition-colors" title={app.name}>
                                {app.name}
                              </div>
                              {/* 2. 虚拟机数量 */}
                              <div className="col-span-2 text-center font-mono text-slate-200 font-bold text-[10px] border-l border-[#1e3a5f]/50 pl-2">
                                {app.vms} 台
                              </div>
                              {/* 3. CPU (利用率) */}
                              <div className="col-span-2 flex items-center justify-center gap-1.5 font-mono border-l border-[#1e3a5f]/50 pl-2">
                                <span className="text-slate-200 text-[10px] font-bold">{app.cpu}</span>
                                <span className={cn(
                                  "px-1.5 py-0.2 rounded text-[9.5px] font-mono font-extrabold shrink-0",
                                  app.cpuPercent > 85 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                )}>
                                  {app.cpuPercent}%
                                </span>
                              </div>
                              {/* 4. 内存 (利用率) */}
                              <div className="col-span-2 flex items-center justify-center gap-1.5 font-mono border-l border-[#1e3a5f]/50 pl-2">
                                <span className="text-slate-200 text-[10px] font-bold">{app.mem}</span>
                                <span className={cn(
                                  "px-1.5 py-0.2 rounded text-[9.5px] font-mono font-extrabold shrink-0",
                                  app.memPercent > 85 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                )}>
                                  {app.memPercent}%
                                </span>
                              </div>
                              {/* 5. 磁盘 (利用率) */}
                              <div className="col-span-3 flex items-center justify-center gap-1.5 font-mono border-l border-[#1e3a5f]/50 pl-2">
                                <span className="text-slate-200 text-[10px] font-bold">{app.disk}</span>
                                <span className={cn(
                                  "px-1.5 py-0.2 rounded text-[9.5px] font-mono font-extrabold shrink-0",
                                  app.diskPercent > 85 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                )}>
                                  {app.diskPercent}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Panel>
                  );
                })()}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* ============================================================ */
          /* 一级部门 (江苏省) 全域驾驶舱视图 (原全功能视图) */
          /* ============================================================ */
          <motion.div 
            className="flex-1 flex gap-2.5 min-h-0"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
            }}
          >
            {/* LEFT COLUMN (27.5% Width - 3 Vertical Panels) */}
            <div className="w-[27.5%] flex flex-col gap-2 shrink-0">
              
              {/* 模块 1: 基础资源概览 */}
              <motion.div variants={fadeUp} className="flex-[0.85] flex">
                <Panel title="基础资源概览" className="w-full">
                  <div className="grid grid-cols-3 gap-2 h-full py-0.5">
                    {hostResourceStats.map((item) => {
                      const iconsMap: Record<string, any> = { Server, Box, HardDrive };
                      const IconComp = iconsMap[item.icon] || Server;
                      const colorClasses: Record<string, string> = {
                        cyan: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
                        purple: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
                        blue: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
                      };
                      const badgeStyle = colorClasses[item.colorName] || colorClasses.cyan;

                      return (
                        <div key={item.id} className="bg-[#061836]/80 border border-[#1e3a5f]/80 rounded-md p-1.5 flex flex-col justify-between hover:border-cyan-400/60 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-slate-300 truncate">{item.title}</span>
                            <div className={cn("w-4.5 h-4.5 rounded flex items-center justify-center border shrink-0", badgeStyle)}>
                              <IconComp className="w-2.8 h-2.8" />
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1 my-0.5">
                            <span className="text-lg font-black font-mono text-slate-100">{item.total}</span>
                            <span className="text-[9.5px] text-slate-400 font-normal">{item.unit}</span>
                          </div>
                          <div className="space-y-0.5 text-[9px] border-t border-[#1e3a5f]/50 pt-1">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 flex items-center gap-1"><span className="w-1.2 h-1.2 rounded-full bg-emerald-400"></span>{item.activeLabel}</span>
                              <span className="font-mono font-bold text-emerald-300">{item.active} {item.unit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 flex items-center gap-1"><span className="w-1.2 h-1.2 rounded-full bg-amber-400"></span>{item.inactiveLabel}</span>
                              <span className="font-mono font-bold text-amber-300">{item.inactive} {item.unit}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </motion.div>

              {/* 模块 2: 资源分配率 (一级全域 3环图样式 - 块存储具备切页滑点) */}
              <motion.div variants={fadeUp} className="flex-[1] flex">
                <Panel title="资源分配率" className="w-full">
                  <div className="grid grid-cols-3 gap-2 h-full py-0.5">
                    {resourceAllocationData.map((res, i) => {
                      const isStorageCard = res.name === '块存储';
                      return (
                        <div
                          key={i}
                          className="bg-[#061836]/80 border border-[#1e3a5f]/80 rounded-md p-2 flex flex-col justify-between items-center hover:border-cyan-400/60 transition-all text-center group relative overflow-hidden"
                        >
                          {/* 科技感双圈圆环（外侧半透明清晰轨圈 + 内侧虚线刻度圈 + 彩色激活弧） */}
                          <div className="flex-1 flex flex-col items-center justify-center w-full py-1">
                            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {/* 1. 外部背景半透明深蓝轨道圈 (清晰且不突兀) */}
                                <path
                                  stroke="#112747"
                                  strokeWidth="3.6"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                {/* 2. 内部精致虚线刻度圈 */}
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="12.2"
                                  stroke="rgba(80, 140, 210, 0.4)"
                                  strokeWidth="0.8"
                                  strokeDasharray="1.2 2.2"
                                  fill="none"
                                />
                                {/* 3. 彩色激活进度弧 */}
                                <path
                                  stroke={res.color}
                                  strokeDasharray={`${res.percent}, 100`}
                                  strokeWidth="3.6"
                                  strokeLinecap="round"
                                  fill="none"
                                  style={{ filter: `drop-shadow(0 0 6px ${res.color}99)` }}
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[12px] font-black font-mono text-slate-100 tracking-tight group-hover:scale-105 transition-transform">
                                  {res.percent}%
                                </span>
                                <span className="text-[8.5px] font-bold text-slate-300 tracking-wider">
                                  {res.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 圆环下方内容模块（统一 2 行布局，块存储支持切页点） */}
                          <div className="w-full text-[9.5px] pt-1.5 mt-auto">
                            {!isStorageCard || storagePage === 0 ? (
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">总量</span>
                                  <span className="font-mono font-bold text-slate-200">{res.total}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">分配量</span>
                                  <span className="font-mono font-bold text-cyan-300">{res.allocated}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">云硬盘</span>
                                  <span className="font-mono font-bold text-teal-300">{(res as any).cloudDisk}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">其他</span>
                                  <span className="font-mono font-bold text-slate-300">{(res as any).other}</span>
                                </div>
                              </div>
                            )}

                            {/* 块存储卡片专属分页切页点 */}
                            {isStorageCard ? (
                              <div className="flex justify-center items-center gap-1.5 pt-1.5 mt-0.5">
                                <button
                                  onClick={() => setStoragePage(0)}
                                  className={cn(
                                    "h-1 rounded-full transition-all cursor-pointer",
                                    storagePage === 0 ? "bg-cyan-400 w-3.5" : "bg-slate-600 hover:bg-slate-400 w-1"
                                  )}
                                  title="P1: 总量 / 分配量"
                                />
                                <button
                                  onClick={() => setStoragePage(1)}
                                  className={cn(
                                    "h-1 rounded-full transition-all cursor-pointer",
                                    storagePage === 1 ? "bg-cyan-400 w-3.5" : "bg-slate-600 hover:bg-slate-400 w-1"
                                  )}
                                  title="P2: 云硬盘 / 其他"
                                />
                              </div>
                            ) : (
                              /* 保持 CPU/内存 下方间距统一的隐形垫片 */
                              <div className="h-1.5 mt-0.5" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </motion.div>

              {/* 模块 3: 负载趋势 */}
              <motion.div variants={fadeUp} className="flex-[1.6] flex">
                <Panel 
                  title="负载趋势" 
                  className="w-full"
                  action={
                    <div className="flex bg-[#040e21] p-0.5 rounded border border-[#1e3a5f] text-[9px]">
                      <button onClick={() => setLoadTab('host')} className={cn("px-1.5 py-0.2 rounded transition-colors cursor-pointer", loadTab === 'host' ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200")}>宿主机</button>
                      <button onClick={() => setLoadTab('vm')} className={cn("px-1.5 py-0.2 rounded transition-colors cursor-pointer", loadTab === 'vm' ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200")}>虚拟机</button>
                    </div>
                  }
                >
                  <div className="grid grid-cols-2 gap-2 h-full py-0.5">
                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded p-2 flex flex-col justify-between">
                      <div className="text-[10.5px] font-bold text-slate-300 truncate">{loadTab === 'host' ? '宿主机' : '虚拟机'} CPU 使用率 (%)</div>
                      <div className="flex-1 min-h-[70px] mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loadTrendSeries} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                            <defs><linearGradient id="loadCpuGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient></defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '10px' }} />
                            <Area type="monotone" dataKey="cpu" stroke="#38bdf8" strokeWidth={1.5} fill="url(#loadCpuGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded p-2 flex flex-col justify-between">
                      <div className="text-[10.5px] font-bold text-slate-300 truncate">{loadTab === 'host' ? '宿主机' : '虚拟机'} 内存使用率 (%)</div>
                      <div className="flex-1 min-h-[70px] mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loadTrendSeries} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                            <defs><linearGradient id="loadMemGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0099ff" stopOpacity={0.4}/><stop offset="95%" stopColor="#0099ff" stopOpacity={0}/></linearGradient></defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '10px' }} />
                            <Area type="monotone" dataKey="memory" stroke="#0099ff" strokeWidth={1.5} fill="url(#loadMemGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded p-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="font-bold text-slate-300 truncate">磁盘 IO 监控</span>
                        <div className="flex gap-1.5 text-[8.5px] text-slate-400">
                          <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>读</span>
                          <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>写</span>
                        </div>
                      </div>
                      <div className="flex-1 min-h-[70px] mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={loadTrendSeries} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '10px' }} />
                            <Line type="monotone" dataKey="diskIoRead" stroke="#22d3ee" strokeWidth={1.5} dot={false} name="读" />
                            <Line type="monotone" dataKey="diskIoWrite" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="写" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded p-1.5 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-300 truncate">网络流量监控</span>
                        <div className="flex gap-1.5 text-[8px] text-slate-400">
                          <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>流入</span>
                          <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>流出</span>
                        </div>
                      </div>
                      <div className="h-20 min-h-[55px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={loadTrendSeries} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '10px' }} />
                            <Line type="monotone" dataKey="netIn" stroke="#34d399" strokeWidth={1.5} dot={false} name="流入" />
                            <Line type="monotone" dataKey="netOut" stroke="#60a5fa" strokeWidth={1.5} dot={false} name="流出" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            </div>

            {/* CENTER COLUMN (50% Width - Main 3D Topology Canvas) */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <motion.div variants={fadeUp} className="flex-1 flex flex-col bg-[#040e21]/90 backdrop-blur-xl border border-[#1e3a5f]/80 rounded-xs relative overflow-hidden">
                <div className="flex-1 relative min-h-0">
                  <TopologyMap />
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN (27.5% Width - Alarm Stats / Host TOP5 / VM TOP5) */}
            <div className="w-[27.5%] flex flex-col gap-2 shrink-0">
              {/* Card 1: 告警统计 */}
              <motion.div variants={fadeUp} className="flex-[1] flex">
                <Panel title="告警统计" className="w-full">
                  <div className="flex items-center justify-between h-full px-2">
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={alarmStatsData.slices} cx="50%" cy="50%" innerRadius={30} outerRadius={42} paddingAngle={4} dataKey="value" stroke="none">
                            {alarmStatsData.slices.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-black font-mono text-slate-100">{alarmStatsData.totalPending}</span>
                        <span className="text-[9px] text-slate-400">待处理告警</span>
                      </div>
                    </div>
                    <div className="flex-1 pl-3 space-y-1 text-xs">
                      <div className="flex justify-between items-center bg-[#071936]/60 p-1 rounded border border-[#1e3a5f]/60"><span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-xs bg-red-500 shadow-[0_0_6px_#ef4444]"></span>灾难</span><span className="font-mono font-bold text-red-400">{alarmStatsData.disaster}</span></div>
                      <div className="flex justify-between items-center bg-[#071936]/60 p-1 rounded border border-[#1e3a5f]/60"><span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-xs bg-amber-500 shadow-[0_0_6px_#f59e0b]"></span>严重</span><span className="font-mono font-bold text-amber-400">{alarmStatsData.critical}</span></div>
                      <div className="flex justify-between items-center bg-[#071936]/60 p-1 rounded border border-[#1e3a5f]/60"><span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-xs bg-blue-500 shadow-[0_0_6px_#3b82f6]"></span>一般</span><span className="font-mono font-bold text-blue-400">{alarmStatsData.minor}</span></div>
                      <div className="flex justify-between items-center bg-[#071936]/60 p-1 rounded border border-[#1e3a5f]/60"><span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-xs bg-slate-400"></span>提示</span><span className="font-mono font-bold text-slate-300">{alarmStatsData.info}</span></div>
                    </div>
                  </div>
                </Panel>
              </motion.div>

              {/* Card 2: 宿主机资源 TOP5 */}
              <motion.div variants={fadeUp} className="flex-[1.2] flex">
                <Panel title="宿主机资源 TOP5" className="w-full" action={<div className="flex bg-[#040e21] p-0.5 rounded border border-[#1e3a5f] text-[9px]"><button onClick={() => setHostTop5Tab('cpu')} className={cn("px-1.5 py-0.2 rounded transition-colors cursor-pointer", hostTop5Tab === 'cpu' ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200")}>CPU</button><button onClick={() => setHostTop5Tab('memory')} className={cn("px-1.5 py-0.2 rounded transition-colors cursor-pointer", hostTop5Tab === 'memory' ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200")}>内存</button></div>}>
                  <div className="flex flex-col justify-between h-full py-0.5 space-y-1 text-[10px]">
                    {(hostTop5Tab === 'cpu' ? hostTop5Data.cpu : hostTop5Data.memory).map((item) => (
                      <div key={item.rank} className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded p-1.5 flex flex-col gap-1 hover:border-cyan-400/50 transition-all">
                        <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 truncate text-slate-200 font-medium"><span className="px-1 py-0.2 rounded bg-blue-500/20 text-cyan-300 font-mono text-[9px] border border-cyan-500/30">{item.rank}</span><span className="truncate">{item.name}</span></span><span className="font-mono font-bold text-cyan-300 shrink-0 ml-1">{item.value}%</span></div>
                        <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative"><div className="h-full rounded-full bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] transition-all duration-500" style={{ width: `${item.value}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </motion.div>

              {/* Card 3: 虚拟机资源 TOP5 */}
              <motion.div variants={fadeUp} className="flex-[1.2] flex">
                <Panel title="虚拟机资源 TOP5" className="w-full" action={<div className="flex bg-[#040e21] p-0.5 rounded border border-[#1e3a5f] text-[9px]"><button onClick={() => setVmTop5Tab('cpu')} className={cn("px-1.5 py-0.2 rounded transition-colors cursor-pointer", vmTop5Tab === 'cpu' ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200")}>CPU</button><button onClick={() => setVmTop5Tab('memory')} className={cn("px-1.5 py-0.2 rounded transition-colors cursor-pointer", vmTop5Tab === 'memory' ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200")}>内存</button></div>}>
                  <div className="flex flex-col justify-between h-full py-0.5 space-y-1 text-[10px]">
                    {(vmTop5Tab === 'cpu' ? vmTop5Data.cpu : vmTop5Data.memory).map((item) => (
                      <div key={item.rank} className="bg-[#061836]/60 border border-[#1e3a5f]/60 rounded p-1.5 flex flex-col gap-1 hover:border-cyan-400/50 transition-all">
                        <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 truncate text-slate-200 font-medium" title={item.name}><span className="px-1 py-0.2 rounded bg-blue-500/20 text-cyan-300 font-mono text-[9px] border border-cyan-500/30">{item.rank}</span><span className="truncate">{item.name}</span></span><span className="font-mono font-bold text-cyan-300 shrink-0 ml-1">{item.value}%</span></div>
                        <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative"><div className="h-full rounded-full bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00d2ff] transition-all duration-500" style={{ width: `${item.value}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}


