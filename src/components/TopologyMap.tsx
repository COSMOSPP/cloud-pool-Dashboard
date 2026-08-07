import { motion } from 'motion/react';

export function TopologyMap() {
  // 节点配置与位置（基于 3D Isometric 菱形网格坐标）
  const nodes = [
    { id: 'core', label: '内网核心', layer: '核心层 (1)', type: 'tower', x: 50, y: 20 },
    { id: 'sw-storage', label: '存储交换机', layer: '汇聚层', type: 'glass-cube', x: 26, y: 44 },
    { id: 'sw-compute', label: '计算交换机', layer: '汇聚层', type: 'matrix-cube', x: 74, y: 44 },
    { id: 'gw-storage', label: '存储网关', layer: '接入层', type: 'cylinder-stack', x: 14, y: 70 },
    { id: 'node-compute', label: '计算节点', layer: '接入层', type: 'arch-block', x: 38, y: 74 },
    { id: 'node-network', label: '网络节点', layer: '接入层', type: 'molecular-mesh', x: 62, y: 74 },
    { id: 'node-mgmt', label: '管理节点', layer: '接入层', type: 'hourglass-crystal', x: 86, y: 70 },
  ];

  // 连线配置
  const connections = [
    { source: 'core', target: 'sw-storage' },
    { source: 'core', target: 'sw-compute' },
    { source: 'sw-storage', target: 'gw-storage' },
    { source: 'sw-compute', target: 'node-compute' },
    { source: 'sw-compute', target: 'node-network' },
    { source: 'sw-compute', target: 'node-mgmt' },
    { source: 'sw-storage', target: 'node-compute', dashed: true },
  ];

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-2 overflow-hidden select-none">
      
      {/* 极简深色微发光背景 */}
      <div className="absolute inset-0 bg-[#030a17] bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.08)_0%,_transparent_75%)] pointer-events-none" />

      {/* 背景 边角科技装饰标识 */}
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none z-10">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider bg-[#041229]/80 px-2 py-0.5 rounded border border-cyan-500/30">
          网络拓扑架构 // 运行中
        </span>
      </div>

      <div className="absolute top-3 right-4 flex items-center gap-3 text-[10px] text-slate-400 pointer-events-none z-10 bg-[#041229]/80 px-2.5 py-0.5 rounded border border-[#1e3a5f]">
        <span>出口带宽: <strong className="text-cyan-300">100 Gbps</strong></span>
        <span>平均延迟: <strong className="text-emerald-400">0.8 ms</strong></span>
      </div>

      <div className="absolute bottom-3 left-4 text-[9px] text-slate-500 pointer-events-none z-10 space-y-0.5">
        <div>节点坐标: <span className="text-cyan-400/80">东经 121.4737°, 北纬 31.2304°</span></div>
        <div>集群节点: <span className="text-cyan-400/80">7 正常 / 0 异常</span></div>
      </div>

      {/* SVG 画布：渲染大菱形平台、连接轨线、能量粒线条 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="iso-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="iso-line-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
          </linearGradient>

          <filter id="cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 强化：多重 3D 主体大菱形底盘框线与交叉射线 */}
        <polygon 
          points="50%,6% 96%,52% 50%,96% 4%,52%" 
          fill="rgba(6, 182, 212, 0.04)" 
          stroke="rgba(56, 189, 248, 0.35)" 
          strokeWidth="1.5" 
          strokeDasharray="8 6"
        />
        <polygon 
          points="50%,12% 90%,52% 50%,90% 10%,52%" 
          fill="rgba(2, 132, 199, 0.03)" 
          stroke="rgba(14, 165, 233, 0.2)" 
          strokeWidth="1"
        />
        {/* 菱形对角科技交叉分割线 */}
        <line x1="50%" y1="6%" x2="50%" y2="96%" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="4%" y1="52%" x2="96%" y2="52%" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="4 4" />

        {/* 渲染等距连接线 */}
        {connections.map((conn, idx) => {
          const s = nodes.find(n => n.id === conn.source)!;
          const t = nodes.find(n => n.id === conn.target)!;
          const isGold = conn.source === 'core';

          return (
            <g key={`conn-${idx}`}>
              <motion.line
                x1={`${s.x}%`} y1={`${s.y + 2}%`}
                x2={`${t.x}%`} y2={`${t.y - 2}%`}
                stroke={isGold ? "url(#iso-line-gold)" : "url(#iso-line-grad)"}
                strokeWidth={conn.dashed ? "1.5" : "2.5"}
                strokeDasharray={conn.dashed ? "5 5" : "none"}
                strokeOpacity={conn.dashed ? 0.4 : 0.8}
                filter="url(#cyan-glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: idx * 0.15 }}
              />

              {/* 能量流珠 */}
              {!conn.dashed && (
                <motion.circle
                  r="3.5"
                  fill={isGold ? "#fef08a" : "#7dd3fc"}
                  filter="drop-shadow(0 0 6px #38bdf8)"
                  initial={{ cx: `${s.x}%`, cy: `${s.y + 2}%`, opacity: 0 }}
                  animate={{ 
                    cx: [`${s.x}%`, `${t.x}%`], 
                    cy: [`${s.y + 2}%`, `${t.y - 2}%`],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.3, ease: 'linear' }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* ---------------- 节点 3D 立体组件与底座 ---------------- */}
      {nodes.map((node, idx) => (
        <div
          key={node.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 group cursor-pointer"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {/* Top Title Tag (胶囊/菱形文字框，完美匹配参考图) */}
          <motion.div 
            className="mb-2 z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="relative px-3 py-0.5 bg-[#051329]/90 border border-cyan-400/50 rounded-sm shadow-[0_0_12px_rgba(6,182,212,0.4)] backdrop-blur">
              <span className="text-[12px] font-extrabold text-cyan-200 tracking-wider whitespace-nowrap">
                {node.label}
              </span>
              {/* 装饰小角 */}
              <div className="absolute -top-[2px] -left-[2px] w-1.5 h-1.5 border-t border-l border-cyan-300" />
              <div className="absolute -bottom-[2px] -right-[2px] w-1.5 h-1.5 border-b border-r border-cyan-300" />
            </div>
          </motion.div>

          {/* 3D Base Pedestal + 3D Volumetric Icon */}
          <motion.div 
            className="relative flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: idx * 0.08 }}
            whileHover={{ y: -6 }}
          >
            {/* 3D Iso Rhombus Base Platform (菱形双层底座) */}
            <div className="relative w-28 h-20 flex items-center justify-center">
              
              {/* 底座底层阴影与暗蓝盘 */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 80">
                <defs>
                  <linearGradient id={`ped-top-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id={`ped-side-${node.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#082f49" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* 底部投影 */}
                <ellipse cx="56" cy="58" rx="46" ry="18" fill="#000" opacity="0.6" filter="blur(4px)" />

                {/* 下级底座厚度 */}
                <polygon points="56,72 102,48 102,54 56,78 10,54 10,48" fill="url(#iso-line-grad)" opacity="0.6" />
                <polygon points="56,70 100,47 56,24 12,47" fill="rgba(6, 182, 212, 0.2)" stroke="#38bdf8" strokeWidth="1" />

                {/* 上层 3D 菱形发光平台 */}
                <g transform="translate(0, -6)">
                  <polygon points="56,62 94,42 94,48 56,68 18,48 18,42" fill={`url(#ped-side-${node.id})`} />
                  <polygon points="56,60 94,41 56,22 18,41" fill={`url(#ped-top-${node.id})`} stroke="#00f0ff" strokeWidth="1.5" />
                  {/* 内边高光 */}
                  <polygon points="56,54 86,39 56,24 26,39" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
                </g>
              </svg>

              {/* ---------------- 3D 实体图形 (根据 type 精细绘制 3D 几何组件) ---------------- */}
              <div className="absolute top-[-12px] flex items-center justify-center pointer-events-none">
                
                {/* 1. 核心大楼建筑群 (Data Center Tower Complex - 完美契合参考图顶楼) */}
                {node.type === 'tower' && (
                  <div className="relative w-24 h-28 flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 120">
                      <defs>
                        <linearGradient id="bldg-front" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                        <linearGradient id="bldg-side" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#0c4a6e" />
                        </linearGradient>
                        <linearGradient id="bldg-top" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7dd3fc" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>

                      {/* 左次塔 */}
                      <g transform="translate(18, 42)">
                        <polygon points="12,18 24,12 24,55 12,61" fill="url(#bldg-front)" />
                        <polygon points="12,18 0,12 0,55 12,61" fill="url(#bldg-side)" />
                        <polygon points="12,18 24,12 12,6 0,12" fill="url(#bldg-top)" stroke="#e0f2fe" strokeWidth="0.5" />
                      </g>

                      {/* 右次塔 */}
                      <g transform="translate(58, 38)">
                        <polygon points="12,18 24,12 24,60 12,66" fill="url(#bldg-front)" />
                        <polygon points="12,18 0,12 0,60 12,66" fill="url(#bldg-side)" />
                        <polygon points="12,18 24,12 12,6 0,12" fill="url(#bldg-top)" stroke="#e0f2fe" strokeWidth="0.5" />
                      </g>

                      {/* 中央高耸主楼 */}
                      <g transform="translate(36, 12)">
                        <polygon points="14,20 28,13 28,85 14,92" fill="url(#bldg-front)" />
                        <polygon points="14,20 0,13 0,85 14,92" fill="url(#bldg-side)" />
                        <polygon points="14,20 28,13 14,6 0,13" fill="#bae6fd" stroke="#fff" strokeWidth="1" />
                        {/* 顶层高能聚光特效 */}
                        <ellipse cx="14" cy="6" rx="10" ry="5" fill="#38bdf8" filter="blur(3px)" />
                      </g>

                      {/* 前置低矮方楼 */}
                      <g transform="translate(38, 62)">
                        <polygon points="12,16 24,10 24,32 12,38" fill="#7dd3fc" />
                        <polygon points="12,16 0,10 0,32 12,38" fill="#0284c7" />
                        <polygon points="12,16 24,10 12,4 0,10" fill="#e0f2fe" stroke="#fff" strokeWidth="0.5" />
                      </g>
                    </svg>
                  </div>
                )}

                {/* 2. 3D 悬浮晶体玻璃方块 (Glass Cube) */}
                {node.type === 'glass-cube' && (
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 60 60">
                      {/* 外层半透明玻璃方块 */}
                      <polygon points="30,38 52,27 52,10 30,21" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="1" />
                      <polygon points="30,38 8,27 8,10 30,21" fill="rgba(2, 132, 199, 0.45)" stroke="#0284c7" strokeWidth="1" />
                      <polygon points="30,21 52,10 30,0 8,10" fill="rgba(125, 211, 252, 0.5)" stroke="#7dd3fc" strokeWidth="1" />

                      {/* 内芯高亮立方体 */}
                      <g transform="translate(18, 14) scale(0.4)">
                        <polygon points="30,38 52,27 52,10 30,21" fill="#38bdf8" />
                        <polygon points="30,38 8,27 8,10 30,21" fill="#0284c7" />
                        <polygon points="30,21 52,10 30,0 8,10" fill="#fff" />
                      </g>
                    </svg>
                  </div>
                )}

                {/* 3. 3D 矩阵方块组 (Matrix Cube Cluster) */}
                {node.type === 'matrix-cube' && (
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 60 60">
                      {/* 2x2x2 小方块组合 */}
                      {[
                        { x: 18, y: 16 }, { x: 30, y: 10 },
                        { x: 6, y: 23 }, { x: 18, y: 29 },
                        { x: 30, y: 23 }, { x: 42, y: 17 }
                      ].map((pos, i) => (
                        <g key={i} transform={`translate(${pos.x}, ${pos.y}) scale(0.38)`}>
                          <polygon points="20,26 36,18 36,6 20,14" fill="#38bdf8" />
                          <polygon points="20,26 4,18 4,6 20,14" fill="#0284c7" />
                          <polygon points="20,14 36,6 20,0 4,6" fill="#7dd3fc" stroke="#fff" strokeWidth="0.5" />
                        </g>
                      ))}
                    </svg>
                  </div>
                )}

                {/* 4. 3D 存储柱塔 (Cylinder Stack) */}
                {node.type === 'cylinder-stack' && (
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 60 60">
                      <g transform="translate(15, 6)">
                        <path d="M 0,26 L 0,36 A 15 7.5 0 0 0 30,36 L 30,26 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                        <ellipse cx="15" cy="26" rx="15" ry="7.5" fill="#38bdf8" stroke="#7dd3fc" strokeWidth="1" />
                        
                        <path d="M 0,14 L 0,22 A 15 7.5 0 0 0 30,22 L 30,14 Z" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                        <ellipse cx="15" cy="14" rx="15" ry="7.5" fill="#7dd3fc" stroke="#fff" strokeWidth="1" />

                        <path d="M 0,2 L 0,10 A 15 7.5 0 0 0 30,10 L 30,2 Z" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="1" />
                        <ellipse cx="15" cy="2" rx="15" ry="7.5" fill="#e0f2fe" stroke="#fff" strokeWidth="1" />
                      </g>
                    </svg>
                  </div>
                )}

                {/* 5. 3D 拱形计算块 (Arch Block) */}
                {node.type === 'arch-block' && (
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 60 60">
                      <g transform="translate(10, 8)">
                        <path d="M 5,35 L 5,15 A 15 15 0 0 1 35,15 L 35,35 L 26,35 L 26,18 A 6 6 0 0 0 14,18 L 14,35 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                        <path d="M 5,15 A 15 15 0 0 1 35,15 L 26,15 A 6 6 0 0 0 14,15 Z" fill="#7dd3fc" stroke="#fff" strokeWidth="1" />
                      </g>
                    </svg>
                  </div>
                )}

                {/* 6. 3D 分子网格球 (Molecular Mesh) */}
                {node.type === 'molecular-mesh' && (
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 60 60">
                      <line x1="30" y1="12" x2="16" y2="34" stroke="#38bdf8" strokeWidth="2" />
                      <line x1="30" y1="12" x2="44" y2="34" stroke="#38bdf8" strokeWidth="2" />
                      <line x1="16" y1="34" x2="44" y2="34" stroke="#38bdf8" strokeWidth="2" />
                      <line x1="30" y1="12" x2="30" y2="44" stroke="#38bdf8" strokeWidth="2" />

                      <circle cx="30" cy="12" r="7" fill="#7dd3fc" stroke="#fff" strokeWidth="1" filter="drop-shadow(0 0 4px #38bdf8)" />
                      <circle cx="16" cy="34" r="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                      <circle cx="44" cy="34" r="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                      <circle cx="30" cy="44" r="8" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" filter="drop-shadow(0 0 6px #38bdf8)" />
                    </svg>
                  </div>
                )}

                {/* 7. 3D 沙漏/防护晶体 (Hourglass Crystal) */}
                {node.type === 'hourglass-crystal' && (
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 60 60">
                      <g transform="translate(15, 6)">
                        <polygon points="15,22 28,4 2,4" fill="#38bdf8" opacity="0.9" stroke="#7dd3fc" strokeWidth="1" />
                        <polygon points="15,22 28,40 2,40" fill="#0284c7" opacity="0.9" stroke="#38bdf8" strokeWidth="1" />
                        <circle cx="15" cy="22" r="3" fill="#fff" filter="drop-shadow(0 0 5px #fff)" />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}


