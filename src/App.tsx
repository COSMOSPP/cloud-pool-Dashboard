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
  alarmStatsData, hostTop5Data, vmTop5Data, departmentAppsData,
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
                  <button
                    onClick={() => {
                      const rootNode = organizationTree[0];
                      onSelectDept(rootNode);
                      setIsOpen(false);
                    }}
                    className="text-[10px] text-cyan-400 hover:text-cyan-200 underline cursor-pointer"
                  >
                    重置为一级全域
                  </button>
                </div>

                {/* 搜索框 */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索 1/2/3 级部门名称或代码..."
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
                <span className="text-slate-500">代码: {selectedDept.code}</span>
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

  useEffect(() => {
    setMounted(true);
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
        {selectedDept.level > 1 ? (
          /* ============================================================ */
          /* 二级或三级部门专属驾驶舱视图 (无基础概览、无拓扑图) */
          /* ============================================================ */
          <motion.div 
            className="flex-1 flex gap-2.5 min-h-0"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
            }}
          >
            {/* 左侧栏 (24% 宽度): 部门资源使用率 + 部门告警统计 */}
            <div className="w-[24%] flex flex-col gap-2.5 shrink-0">
              {/* 部门资源使用率 */}
              <motion.div variants={fadeUp} className="flex-[1.4] flex">
                <Panel 
                  title={`${selectedDept.name} · 资源使用率`} 
                  className="w-full"
                  action={
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      资源运行正常
                    </span>
                  }
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
                      <div className="flex flex-col justify-between h-full py-0.5 space-y-1.5">
                        {/* Card 1: CPU分配率 */}
                        <div className="bg-[#061836]/90 border border-[#1e3a5f]/80 rounded-md p-2 flex flex-col justify-between hover:border-cyan-400/60 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
                                <Cpu className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-[11px] font-extrabold text-slate-200">CPU分配率</div>
                                <div className="text-[9.5px] text-slate-400 font-mono">总量 {cpuTotal.toLocaleString()} 核</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] text-slate-400">配额分配率</div>
                              <div className="text-sm font-black font-mono text-cyan-300">44.85 %</div>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 my-1 relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: '44.85%' }} />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">已分配</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{cpuAllocated.toLocaleString()} 核</div>
                            </div>
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">未分配</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{cpuUnallocated.toLocaleString()} 核</div>
                            </div>
                          </div>
                        </div>

                        {/* Card 2: 内存分配率 */}
                        <div className="bg-[#061836]/90 border border-[#1e3a5f]/80 rounded-md p-2 flex flex-col justify-between hover:border-purple-400/60 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
                                <Server className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-[11px] font-extrabold text-slate-200">内存分配率</div>
                                <div className="text-[9.5px] text-slate-400 font-mono">总量 {memTotal} TB</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] text-slate-400">配额分配率</div>
                              <div className="text-sm font-black font-mono text-purple-300">45.89 %</div>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 my-1 relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-400 transition-all duration-500" style={{ width: '45.89%' }} />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">已分配</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{memAllocated} TB</div>
                            </div>
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">未分配</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{memUnallocated} TB</div>
                            </div>
                          </div>
                        </div>

                        {/* Card 3: 存储分配率 (删除了云硬盘和其他) */}
                        <div className="bg-[#061836]/90 border border-[#1e3a5f]/80 rounded-md p-2 flex flex-col justify-between hover:border-teal-400/60 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center shrink-0">
                                <HardDrive className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-[11px] font-extrabold text-slate-200">存储分配率</div>
                                <div className="text-[9.5px] text-slate-400 font-mono">总量 {diskTotal} TB</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] text-slate-400">配额分配率</div>
                              <div className="text-sm font-black font-mono text-teal-300">46.1 %</div>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 my-1 relative">
                            <div className="h-full rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-400 transition-all duration-500" style={{ width: '46.1%' }} />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">已分配</div>
                              <div className="text-[10.5px] font-mono font-bold text-slate-100">{diskAllocated} TB</div>
                            </div>
                            <div className="bg-[#040f24]/80 border border-[#1e3a5f]/60 rounded p-1 text-center">
                              <div className="text-[8.5px] text-slate-400">未分配</div>
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
                <Panel title={`${selectedDept.name} · 告警统计`} className="w-full">
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
                  title={`${selectedDept.name} · 虚拟机负载趋势`} 
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
                        <span className="text-[10px] text-purple-400 font-mono">均值: 68%</span>
                      </div>
                      <div className="flex-1 min-h-[110px] mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="subMemGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={2} fill="url(#subMemGrad)" />
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
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span>流出</span>
                        </div>
                      </div>
                      <div className="flex-1 min-h-[110px] mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={loadTrendSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '11px' }} />
                            <Line type="monotone" dataKey="netIn" stroke="#34d399" strokeWidth={2} dot={false} name="流入" />
                            <Line type="monotone" dataKey="netOut" stroke="#c084fc" strokeWidth={2} dot={false} name="流出" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            </div>

            {/* 右侧栏 (30% 宽度): 部门虚拟机资源 TOP5 + 部门应用资源情况 (完美匹配参考图) */}
            <div className="w-[30%] flex flex-col gap-2.5 shrink-0">
              {/* 部门虚拟机资源 TOP5 */}
              <motion.div variants={fadeUp} className="flex-[0.9] flex">
                <Panel 
                  title={`${selectedDept.name} · 虚拟机资源 TOP5`} 
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
                            <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] border border-purple-500/30">{item.rank}</span>
                            <span className="truncate">{item.name}</span>
                          </span>
                          <span className="font-mono font-bold text-cyan-300 shrink-0 ml-1">{item.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative">
                          <div className={cn("h-full rounded-full transition-all duration-500", vmTop5Tab === 'cpu' ? "bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" : "bg-gradient-to-r from-fuchsia-600 via-purple-500 to-emerald-400")} style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </motion.div>

              {/* 部门应用资源情况 (完美匹配参考图 5列树状架构) */}
              <motion.div variants={fadeUp} className="flex-[1.3] flex">
                <Panel 
                  title={`${selectedDept.name} · 应用资源情况`} 
                  className="w-full"
                  action={
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-400/30 font-mono font-bold">
                      2应用 / 23台虚拟机
                    </span>
                  }
                >
                  <div className="flex flex-col h-full overflow-hidden text-[9.5px]">
                    {/* 表头 Header */}
                    <div className="grid grid-cols-12 gap-1 font-bold text-slate-400 border-b border-[#1e3a5f]/80 pb-1.5 px-1 bg-[#040f24]/80 text-[9px] items-center shrink-0">
                      <div className="col-span-3 flex items-center gap-0.5">
                        <span>组织/应用名称</span>
                        <span className="text-[8px] text-slate-500">⇅</span>
                      </div>
                      <div className="col-span-2 text-center flex items-center justify-center gap-0.5">
                        <span>虚拟机数量</span>
                        <span className="text-[8px] text-slate-500">⇅</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-0.5">
                        <span>CPU / 利用率</span>
                        <span className="text-[8px] text-slate-500">⇅</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-0.5">
                        <span>内存 / 利用率</span>
                        <span className="text-[8px] text-slate-500">⇅</span>
                      </div>
                      <div className="col-span-3 flex items-center gap-0.5">
                        <span>磁盘 / 利用率</span>
                        <span className="text-[8px] text-slate-500">⇅</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 pt-1 pr-0.5">
                      {/* 父层 Summary Row: 研发中心 */}
                      <div className="bg-[#061836]/90 border border-[#1e3a5f] rounded-md p-1.5 grid grid-cols-12 gap-1 items-center font-bold hover:border-cyan-400/50 transition-all">
                        <div className="col-span-3 flex items-center gap-1 overflow-hidden">
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-slate-100 truncate">{selectedDept.name}</span>
                          <span className="px-1 py-0.2 rounded bg-slate-700/60 text-slate-300 text-[8px] shrink-0 font-normal">2应用</span>
                        </div>
                        <div className="col-span-2 text-center font-mono text-slate-100 font-black">23 台</div>
                        {/* CPU: 152核 / 77% */}
                        <div className="col-span-2 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-100 font-black">152 核</span>
                            <span className="text-slate-400 font-normal">77%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '77%' }} />
                          </div>
                        </div>
                        {/* 内存: 320GB / 68% */}
                        <div className="col-span-2 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-100 font-black">320 GB</span>
                            <span className="text-slate-400 font-normal">68%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '68%' }} />
                          </div>
                        </div>
                        {/* 磁盘: 2500GB / 48% */}
                        <div className="col-span-3 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-100 font-black">2500 GB</span>
                            <span className="text-slate-400 font-normal">48%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '48%' }} />
                          </div>
                        </div>
                      </div>

                      {/* 子行 1: 代码托管平台 */}
                      <div className="pl-3 pr-1 py-1.5 grid grid-cols-12 gap-1 items-center border-b border-[#1e3a5f]/30 hover:bg-[#061836]/60 rounded text-slate-300 transition-colors">
                        <div className="col-span-3 pl-2 text-slate-200 font-medium truncate">代码托管平台</div>
                        <div className="col-span-2 text-center font-mono text-slate-300">8 台</div>
                        {/* CPU: 32核 / 45% */}
                        <div className="col-span-2 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-200 font-bold">32 核</span>
                            <span className="text-slate-400">45%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '45%' }} />
                          </div>
                        </div>
                        {/* 内存: 64GB / 60% */}
                        <div className="col-span-2 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-200 font-bold">64 GB</span>
                            <span className="text-slate-400">60%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '60%' }} />
                          </div>
                        </div>
                        {/* 磁盘: 500GB / 80% */}
                        <div className="col-span-3 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-200 font-bold">500 GB</span>
                            <span className="text-slate-400">80%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '80%' }} />
                          </div>
                        </div>
                      </div>

                      {/* 子行 2: 持续集成流水线 */}
                      <div className="pl-3 pr-1 py-1.5 grid grid-cols-12 gap-1 items-center border-b border-[#1e3a5f]/30 hover:bg-[#061836]/60 rounded text-slate-300 transition-colors">
                        <div className="col-span-3 pl-2 text-slate-200 font-medium truncate">持续集成流水线</div>
                        <div className="col-span-2 text-center font-mono text-slate-300">15 台</div>
                        {/* CPU: 120核 / 85% (高利用率红色进度条) */}
                        <div className="col-span-2 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-200 font-bold">120 核</span>
                            <span className="text-red-400 font-bold">85%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>
                        {/* 内存: 256GB / 70% */}
                        <div className="col-span-2 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-200 font-bold">256 GB</span>
                            <span className="text-slate-400">70%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '70%' }} />
                          </div>
                        </div>
                        {/* 磁盘: 2000GB / 40% */}
                        <div className="col-span-3 space-y-0.5">
                          <div className="flex justify-between items-center text-[8.5px] font-mono">
                            <span className="text-slate-200 font-bold">2000 GB</span>
                            <span className="text-slate-400">40%</span>
                          </div>
                          <div className="h-1.2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '40%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
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

              {/* 模块 2: 资源分配率 (一级全域 3环图样式) */}
              <motion.div variants={fadeUp} className="flex-[0.95] flex">
                <Panel title="资源分配率" className="w-full">
                  <div className="grid grid-cols-3 gap-2 h-full py-0.5">
                    {resourceAllocationData.map((res, i) => (
                      <div key={i} className="bg-[#061836]/80 border border-[#1e3a5f]/80 rounded-md p-1.5 flex flex-col justify-start items-center gap-0.5 hover:border-cyan-400/60 transition-all text-center">
                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0 my-0.5">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-[#040f24]" strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path stroke={res.color} strokeDasharray={`${res.percent}, 100`} strokeWidth="3.8" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-[10px] font-black font-mono text-slate-100">{res.percent}%</span>
                            <span className="text-[8.5px] font-bold text-cyan-300">{res.name}</span>
                          </div>
                        </div>
                        <div className="w-full space-y-0.5 text-[9px] border-t border-[#1e3a5f]/50 pt-1">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">总量</span>
                            <span className="font-mono font-bold text-slate-200">{res.total}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">分配量</span>
                            <span className="font-mono font-bold text-cyan-300">{res.allocated}</span>
                          </div>
                          {(res as any).cloudDisk && (
                            <div className="pt-0.5 mt-0.5 border-t border-[#1e3a5f]/40 space-y-0.5">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">云硬盘</span>
                                <span className="font-mono font-bold text-slate-200">{(res as any).cloudDisk}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">其他</span>
                                <span className="font-mono font-bold text-slate-200">{(res as any).other}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
                            <defs><linearGradient id="loadMemGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/></linearGradient></defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '10px' }} />
                            <Area type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={1.5} fill="url(#loadMemGrad)" />
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
                          <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>流出</span>
                        </div>
                      </div>
                      <div className="h-20 min-h-[55px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={loadTrendSeries} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 8 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#061022', borderColor: '#1e3a5f', fontSize: '10px' }} />
                            <Line type="monotone" dataKey="netIn" stroke="#34d399" strokeWidth={1.5} dot={false} name="流入" />
                            <Line type="monotone" dataKey="netOut" stroke="#c084fc" strokeWidth={1.5} dot={false} name="流出" />
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
                        <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 truncate text-slate-200 font-medium"><span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] border border-cyan-500/30">{item.rank}</span><span className="truncate">{item.name}</span></span><span className="font-mono font-bold text-cyan-300 shrink-0 ml-1">{item.value}%</span></div>
                        <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative"><div className={cn("h-full rounded-full transition-all duration-500", hostTop5Tab === 'cpu' ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400" : "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-400")} style={{ width: `${item.value}%` }} /></div>
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
                        <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 truncate text-slate-200 font-medium" title={item.name}><span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] border border-purple-500/30">{item.rank}</span><span className="truncate">{item.name}</span></span><span className="font-mono font-bold text-cyan-300 shrink-0 ml-1">{item.value}%</span></div>
                        <div className="h-1.5 w-full bg-[#020917] rounded-full overflow-hidden border border-[#1e3a5f]/40 relative"><div className={cn("h-full rounded-full transition-all duration-500", vmTop5Tab === 'cpu' ? "bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" : "bg-gradient-to-r from-fuchsia-600 via-purple-500 to-emerald-400")} style={{ width: `${item.value}%` }} /></div>
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


