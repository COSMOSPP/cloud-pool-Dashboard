import { motion } from 'motion/react';

export function TopologyMap() {
  // 节点配置与位置（自然舒展比例）
  const nodes = [
    // 前四层 (L1 - L4)
    { id: 'core', label: '内网核心', layer: 'L1 核心层', type: 'tower', x: 50, y: 8 },
    { id: 'sw-storage', label: '存储交换机', layer: 'L2 汇聚层', type: 'glass-cube', x: 31, y: 21 },
    { id: 'sw-compute', label: '计算交换机', layer: 'L2 汇聚层', type: 'matrix-cube', x: 69, y: 21 },
    { id: 'acc-storage', label: '存储接入', layer: 'L3 接入层', type: 'cylinder-stack', x: 29, y: 34 },
    { id: 'acc-compute', label: '计算接入', layer: 'L3 接入层', type: 'arch-block', x: 71, y: 34 },
    { id: 'gw-storage', label: '存储网关', layer: 'L4 支撑层', type: 'cylinder-stack', x: 16, y: 48 },
    { id: 'node-compute', label: '计算节点', layer: 'L4 支撑层', type: 'arch-block', x: 38, y: 48 },
    { id: 'node-network', label: '网络节点', layer: 'L4 支撑层', type: 'molecular-mesh', x: 62, y: 48 },
    { id: 'node-mgmt', label: '管理节点', layer: 'L4 支撑层', type: 'hourglass-crystal', x: 84, y: 48 },

    // 后三层 (L5 - L7)
    { id: 'sw-biz-mgmt', label: '业务管理交换机', layer: 'L5 业务管理', type: 'glass-cube', x: 50, y: 63 },
    { id: 'sw-mgmt-agg', label: '管理汇聚交换机', layer: 'L6 管理汇聚', type: 'matrix-cube', x: 50, y: 76 },
    { id: 'net-ops-mgmt', label: '运营管理网', layer: 'L7 运营管理', type: 'cloud-network', x: 50, y: 89 },
  ];

  // 连线配置
  const connections = [
    // L1 -> L2
    { source: 'core', target: 'sw-storage' },
    { source: 'core', target: 'sw-compute' },

    // L2 -> L3
    { source: 'sw-storage', target: 'acc-storage' },
    { source: 'sw-compute', target: 'acc-compute' },

    // L3 -> L4
    { source: 'acc-storage', target: 'gw-storage' },
    { source: 'acc-compute', target: 'node-compute' },
    { source: 'acc-compute', target: 'node-network' },
    { source: 'acc-compute', target: 'node-mgmt' },
    { source: 'acc-storage', target: 'node-compute', dashed: true },

    // L4 -> L5 (业务管理交换机)
    { source: 'gw-storage', target: 'sw-biz-mgmt' },
    { source: 'node-compute', target: 'sw-biz-mgmt' },
    { source: 'node-network', target: 'sw-biz-mgmt' },
    { source: 'node-mgmt', target: 'sw-biz-mgmt' },

    // L5 -> L6 (管理汇聚交换机)
    { source: 'sw-biz-mgmt', target: 'sw-mgmt-agg' },

    // L6 -> L7 (运营管理网)
    { source: 'sw-mgmt-agg', target: 'net-ops-mgmt' },
  ];

  // 7层半透明 3D 浮空光环圆盘 (自然舒展开阔，层次递进 1->0 柔和透明)
  const ringPlatforms = [
    { layerIndex: 1, name: 'L1 核心层', cx: 500, cy: 45, rx: 140, ry: 22, color: '#38bdf8' },
    { layerIndex: 2, name: 'L2 汇聚层', cx: 500, cy: 118, rx: 230, ry: 30, color: '#0ea5e9' },
    { layerIndex: 3, name: 'L3 接入层', cx: 500, cy: 190, rx: 300, ry: 36, color: '#0284c7' },
    { layerIndex: 4, name: 'L4 支撑层', cx: 500, cy: 269, rx: 390, ry: 44, color: '#0369a1' },
    { layerIndex: 5, name: 'L5 业务管理', cx: 500, cy: 353, rx: 300, ry: 36, color: '#6366f1' },
    { layerIndex: 6, name: 'L6 管理汇聚', cx: 500, cy: 425, rx: 230, ry: 30, color: '#8b5cf6' },
    { layerIndex: 7, name: 'L7 运营管理', cx: 500, cy: 498, rx: 140, ry: 22, color: '#a855f7' },
  ];

  return (
    <div className="relative w-full h-full min-h-[560px] flex items-center justify-center p-2 overflow-hidden select-none">
      
      {/* 极简深色微发光背景 + 科技风底纹 */}
      <div className="absolute inset-0 bg-[#030a17] bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.12)_0%,_transparent_75%)] pointer-events-none" />

      {/* SVG 画布：渲染科技背景网格、7层 3D 半透明发光圆盘盘面、连接轨线、能量粒子 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 560" preserveAspectRatio="none">
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

          {/* 圆环盘面 1 到 0 渐变透明 */}
          <radialGradient id="ring-surface-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#0284c7" stopOpacity="0.12" />
            <stop offset="85%" stopColor="#0369a1" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#030a17" stopOpacity="0" />
          </radialGradient>

          <filter id="cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* L5 长方体平台渐变 */}
          <linearGradient id="cuboid-top-l5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="cuboid-side-left-l5" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="cuboid-side-right-l5" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.75" />
          </linearGradient>

          {/* L6 长方体平台渐变 */}
          <linearGradient id="cuboid-top-l6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="cuboid-side-left-l6" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2e1065" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="cuboid-side-right-l6" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2e1065" stopOpacity="0.75" />
          </linearGradient>

          {/* L7 长方体平台渐变 */}
          <linearGradient id="cuboid-top-l7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="cuboid-side-left-l7" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="cuboid-side-right-l7" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0.75" />
          </linearGradient>

          {/* 科技背景点阵 Pattern */}
          <pattern id="dot-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="0.8" fill="#1e3a5f" opacity="0.6" />
          </pattern>
        </defs>

        {/* 背景 科技点阵底纹 */}
        <rect width="100%" height="100%" fill="url(#dot-grid)" opacity="0.7" />

        {/* 背景 中轴与四角科技装饰射线 */}
        <line x1="500" y1="20" x2="500" y2="540" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="100" y1="280" x2="900" y2="280" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" strokeDasharray="6 6" />

        {/* ==================== 7层 3D 浮空平台 (L1-L4 圆盘, L5-L7 3D长方体) ==================== */}
        {ringPlatforms.map((ring) => {
          // 渐变透明度过度系数 (从顶层 0.85 递减至底层 0.5)
          const fadeOpacity = Math.max(0.5, 0.88 - (ring.layerIndex - 1) * 0.06);
          const isCuboid = ring.layerIndex >= 5;

          return (
            <g key={`ring-platform-${ring.layerIndex}`} opacity={fadeOpacity}>
              {isCuboid ? (
                /* L5 - L7 3D 长方体平台 (Isometric Cuboid - 统一蓝色渐变风格) */
                <g key={`cuboid-${ring.layerIndex}`}>
                  {/* 顶面 (Top Surface - 采用统一 cyan/blue 渐变) */}
                  <polygon
                    points={`${ring.cx},${ring.cy - ring.ry} ${ring.cx + ring.rx},${ring.cy} ${ring.cx},${ring.cy + ring.ry} ${ring.cx - ring.rx},${ring.cy}`}
                    fill="url(#ring-surface-grad)"
                  />

                  {/* 左前侧面 (Left Front Face) */}
                  <polygon
                    points={`${ring.cx - ring.rx},${ring.cy} ${ring.cx},${ring.cy + ring.ry} ${ring.cx},${ring.cy + ring.ry + 6} ${ring.cx - ring.rx},${ring.cy + 6}`}
                    fill="rgba(2, 132, 199, 0.18)"
                  />

                  {/* 右前侧面 (Right Front Face) */}
                  <polygon
                    points={`${ring.cx},${ring.cy + ring.ry} ${ring.cx + ring.rx},${ring.cy} ${ring.cx + ring.rx},${ring.cy + 6} ${ring.cx},${ring.cy + ring.ry + 6}`}
                    fill="rgba(3, 105, 161, 0.15)"
                  />
                </g>
              ) : (
                /* L1 - L4 3D 圆盘平台 (Ellipse Surface) */
                <g key={`ellipse-${ring.layerIndex}`}>
                  {/* 3D 盘面底座发光 */}
                  <ellipse
                    cx={ring.cx}
                    cy={ring.cy}
                    rx={ring.rx}
                    ry={ring.ry}
                    fill="url(#ring-surface-grad)"
                  />

                  {/* 3D 盘面下沿厚度 (无外描边) */}
                  <path
                    d={`M ${ring.cx - ring.rx},${ring.cy} A ${ring.rx} ${ring.ry} 0 0 0 ${ring.cx + ring.rx},${ring.cy} L ${ring.cx + ring.rx},${ring.cy + 6} A ${ring.rx} ${ring.ry} 0 0 1 ${ring.cx - ring.rx},${ring.cy + 6} Z`}
                    fill="rgba(2, 132, 199, 0.18)"
                  />
                </g>
              )}

              {/* 侧边层级 Tag (L1 - L7) */}
              <g transform={`translate(${ring.cx - ring.rx - 46}, ${ring.cy - 9})`}>
                <rect x="0" y="0" width="40" height="18" rx="3" fill="#041229" stroke={ring.color} strokeWidth="1" opacity="0.85" />
                <text x="20" y="12" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {`L${ring.layerIndex} 层`}
                </text>
              </g>
            </g>
          );
        })}

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
                strokeWidth={conn.dashed ? "1.5" : "2"}
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
                  r="3"
                  fill={isGold ? "#fef08a" : "#7dd3fc"}
                  filter="drop-shadow(0 0 5px #38bdf8)"
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
          {/* Top Title Tag (清晰明快) */}
          <motion.div 
            className="mb-1.5 z-40"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <div className="relative px-2.5 py-0.3 bg-[#051329]/95 border border-cyan-400/50 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.4)] backdrop-blur">
              <span className="text-[11px] font-extrabold text-cyan-200 tracking-wider whitespace-nowrap">
                {node.label}
              </span>
              {/* 装饰小角 */}
              <div className="absolute -top-[1.5px] -left-[1.5px] w-1.2 h-1.2 border-t border-l border-cyan-300" />
              <div className="absolute -bottom-[1.5px] -right-[1.5px] w-1.2 h-1.2 border-b border-r border-cyan-300" />
            </div>
          </motion.div>

          {/* 3D Base Pedestal + 3D Volumetric Icon (自然大气比例 scale-84) */}
          <motion.div 
            className="relative flex items-center justify-center scale-[0.84]"
            initial={{ scale: 0 }}
            animate={{ scale: 0.84 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: idx * 0.06 }}
            whileHover={{ scale: 0.92, y: -4 }}
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

                {/* 8. 3D 运营云网 (Cloud Network) */}
                {node.type === 'cloud-network' && (
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 60 60">
                      <g transform="translate(10, 8)">
                        <ellipse cx="20" cy="28" rx="18" ry="8" fill="rgba(6,182,212,0.3)" stroke="#38bdf8" strokeWidth="1" />
                        <path
                          d="M 10,22 C 6,22 4,18 7,14 C 4,10 9,6 14,8 C 17,4 25,4 27,8 C 31,6 35,10 33,14 C 36,18 33,22 28,22 Z"
                          fill="url(#bldg-front)"
                          stroke="#7dd3fc"
                          strokeWidth="1.5"
                          filter="drop-shadow(0 0 6px #0ea5e9)"
                        />
                        <circle cx="20" cy="14" r="3" fill="#34d399" />
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


