export const kpiData = [
  { title: '服务器总数', value: '528', unit: '台', trend: '+12.5%', iconName: 'Server' },
  { title: '计算节点', value: '320', unit: '台', trend: '+8.2%', iconName: 'Cpu' },
  { title: '存储节点', value: '128', unit: '台', trend: '+10.4%', iconName: 'HardDrive' },
  { title: '网络节点', value: '80', unit: '个', trend: '+11.1%', iconName: 'Network' },
  { title: '虚拟机', value: '2,450', unit: '台', trend: '+6.8%', iconName: 'Box' },
  { title: '使用单位', value: '38', unit: '家', trend: '+9.6%', iconName: 'Building2' },
];

export const infraData = [
  { name: '服务器健康度', value: 92, color: '#06b6d4' },
  { name: '网络连通率', value: 99, color: '#3b82f6' },
  { name: '存储健康度', value: 85, color: '#8b5cf6' },
];

export const resourcePoolData = [
  { name: '已分配', value: 75, fill: '#0ea5e9' },
  { name: '剩余', value: 25, fill: '#1e293b' },
];

export const topTenantsData = [
  { name: '研发一部', resource: 850 },
  { name: '大数据组', resource: 620 },
  { name: 'AI实验室', resource: 540 },
  { name: '测试中心', resource: 410 },
  { name: '运维保障', resource: 320 },
];

export const trendData = [
  { time: '05-14', ue: 1.35, val: 30 },
  { time: '05-15', ue: 1.33, val: 28 },
  { time: '05-16', ue: 1.30, val: 35 },
  { time: '05-17', ue: 1.36, val: 40 },
  { time: '05-18', ue: 1.28, val: 32 },
  { time: '05-19', ue: 1.31, val: 36 },
  { time: '05-20', ue: 1.35, val: 38 },
];

export const nodeStatusCards = [
  { name: '北京亦庄节点', location: '北京 · 亦庄', pue: '1.32', status: '正常' },
  { name: '上海临港节点', location: '上海 · 临港', pue: '1.38', status: '正常' },
  { name: '广州南沙节点', location: '广州 · 南沙', pue: '1.28', status: '正常' },
  { name: '贵州贵安节点', location: '贵州 · 贵安', pue: '1.22', status: '正常' },
  { name: '内蒙古和林格尔', location: '呼和浩特 · 和林', pue: '1.15', status: '正常' },
  { name: '河北张北节点', location: '张家口 · 张北', pue: '1.18', status: '正常' },
];

export const alarmSummary = {
  critical: 8,
  warning: 32,
  minor: 156,
  info: 320,
};

export const alarmTrendData = [
  { time: '05-14', critical: 12, warning: 30, minor: 70, info: 110 },
  { time: '05-15', critical: 8, warning: 35, minor: 65, info: 95 },
  { time: '05-16', critical: 15, warning: 28, minor: 80, info: 105 },
  { time: '05-17', critical: 6, warning: 40, minor: 75, info: 115 },
  { time: '05-18', critical: 10, warning: 32, minor: 60, info: 90 },
  { time: '05-19', critical: 14, warning: 45, minor: 85, info: 120 },
  { time: '05-20', critical: 8, warning: 32, minor: 72, info: 100 },
];

export const topAlarmEvents = [
  { id: 1, name: '精密空调A1制冷故障', level: '严重', levelClass: 'bg-red-500/20 text-red-400 border-red-500/40', time: '05-20 14:20', status: '未处理', statusClass: 'text-red-400 font-bold' },
  { id: 2, name: 'UPS电源输出异常', level: '严重', levelClass: 'bg-red-500/20 text-red-400 border-red-500/40', time: '05-20 13:46', status: '处理中', statusClass: 'text-amber-400 font-bold' },
  { id: 3, name: '机柜A-102温度过高', level: '重要', levelClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40', time: '05-20 13:15', status: '处理中', statusClass: 'text-amber-400 font-bold' },
  { id: 4, name: '市电输入电压异常', level: '重要', levelClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40', time: '05-20 11:37', status: '已处置', statusClass: 'text-emerald-400 font-bold' },
  { id: 5, name: '网络链路丢包率高', level: '一般', levelClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40', time: '05-20 10:22', status: '已处置', statusClass: 'text-emerald-400 font-bold' },
];

export const costTrendData = [
  { time: '05-14', power: 700, bandwidth: 250, ops: 120, other: 80 },
  { time: '05-15', power: 750, bandwidth: 280, ops: 130, other: 90 },
  { time: '05-16', power: 680, bandwidth: 240, ops: 110, other: 75 },
  { time: '05-17', power: 820, bandwidth: 300, ops: 140, other: 95 },
  { time: '05-18', power: 790, bandwidth: 290, ops: 135, other: 85 },
  { time: '05-19', power: 850, bandwidth: 310, ops: 150, other: 100 },
  { time: '05-20', power: 900, bandwidth: 330, ops: 160, other: 110 },
];

export const bottomRealtimeMetrics = [
  { label: 'IT 负载', value: '68,542', unit: 'kW', icon: 'Server' },
  { label: '总功率', value: '123,642', unit: 'kW', icon: 'Zap' },
  { label: '制冷负载', value: '38,965', unit: 'kW', icon: 'Snowflake' },
  { label: '带宽使用', value: '56.3', unit: 'Tbps', icon: 'Globe' },
  { label: '在线设备', value: '198,560', unit: '台', icon: 'Box' },
  { label: '今日工单', value: '328', unit: '单', icon: 'ClipboardList' },
  { label: '巡检完成率', value: '98.6', unit: '%', icon: 'ShieldCheck' },
];

export const hostResourceStats = [
  { id: 'host', title: '宿主机总数', total: '13', unit: '台', icon: 'Server', active: '13', activeLabel: '开机', inactive: '0', inactiveLabel: '关机', colorName: 'cyan' },
  { id: 'vm', title: '虚拟机总数', total: '41', unit: '台', icon: 'Box', active: '40', activeLabel: '开机', inactive: '1', inactiveLabel: '关机', colorName: 'purple' },
  { id: 'disk', title: '虚拟磁盘总数', total: '86', unit: '块', icon: 'HardDrive', active: '86', activeLabel: '已挂载', inactive: '0', inactiveLabel: '未挂载', colorName: 'blue' },
];

export const resourceAllocationData = [
  { name: 'CPU', percent: 44.85, total: '4,290 核', allocated: '1,924 核', color: '#38bdf8' },
  { name: '内存', percent: 45.89, total: '11.65 TB', allocated: '5.34 TB', color: '#a855f7' },
  { name: '块存储', percent: 46.10, total: '453.49 TB', allocated: '209.08 TB', cloudDisk: '160.50 TB', other: '48.58 TB', color: '#14b8a6' },
];

export const loadTrendSeries = [
  { time: '06:28', cpu: 38, memory: 98, diskIoRead: 45, diskIoWrite: 12, netIn: 65, netOut: 30 },
  { time: '07:12', cpu: 12, memory: 15, diskIoRead: 42, diskIoWrite: 10, netIn: 40, netOut: 20 },
  { time: '07:58', cpu: 40, memory: 96, diskIoRead: 50, diskIoWrite: 14, netIn: 75, netOut: 45 },
  { time: '08:44', cpu: 42, memory: 98, diskIoRead: 60, diskIoWrite: 18, netIn: 55, netOut: 35 },
  { time: '09:32', cpu: 75, memory: 99, diskIoRead: 52, diskIoWrite: 15, netIn: 92, netOut: 60 },
  { time: '10:15', cpu: 45, memory: 98, diskIoRead: 55, diskIoWrite: 16, netIn: 68, netOut: 40 },
];

export const alarmStatsData = {
  totalPending: 520,
  disaster: 12,
  critical: 32,
  minor: 156,
  info: 320,
  slices: [
    { name: '灾难', value: 12, color: '#ef4444' },
    { name: '严重', value: 32, color: '#f59e0b' },
    { name: '一般', value: 156, color: '#3b82f6' },
    { name: '提示', value: 320, color: '#64748b' },
  ]
};

export const hostTop5Data = {
  cpu: [
    { rank: '01', name: '计算虚拟化节点2-172.18.0.12', value: 24 },
    { rank: '02', name: '计算虚拟化节点7-172.18.0.17', value: 18 },
    { rank: '03', name: '计算虚拟化节点6-172.18.0.16', value: 18 },
    { rank: '04', name: '计算虚拟化节点4-172.18.0.14', value: 17 },
    { rank: '05', name: '计算虚拟化节点12-172.18.0.33', value: 17 },
  ],
  memory: [
    { rank: '01', name: '计算虚拟化节点13-172.18.0.34', value: 84 },
    { rank: '02', name: '计算虚拟化节点7-172.18.0.17', value: 78 },
    { rank: '03', name: '计算虚拟化节点6-172.18.0.16', value: 76 },
    { rank: '04', name: '计算虚拟化节点3-172.18.0.13', value: 69 },
    { rank: '05', name: '计算虚拟化节点4-172.18.0.14', value: 62 },
  ]
};

export const vmTop5Data = {
  cpu: [
    { rank: '01', name: '卫士通涉密计算机网络保密自监管分析处置平台04', value: 49 },
    { rank: '02', name: '虚拟机微隔离管理系统', value: 19 },
    { rank: '03', name: '江苏省电子政务内网-OA协同办公平台-redis-测试', value: 18 },
    { rank: '04', name: '金山协同平台01', value: 18 },
    { rank: '05', name: '内网一体化履职服务平台01', value: 14 },
  ],
  memory: [
    { rank: '01', name: '江苏省机要密码综合业务管理平台-神通数据库-备', value: 63 },
    { rank: '02', name: '金山协同平台02', value: 60 },
    { rank: '03', name: '金山协同平台01', value: 59 },
    { rank: '04', name: '卫士通涉密计算机网络保密自监管分析处置平台04', value: 51 },
    { rank: '05', name: '奇安信天擎终端安全管理系统', value: 43 },
  ]
};

export interface DepartmentNode {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  code: string;
  parentId?: string | null;
  children?: DepartmentNode[];
  servers?: number;
  vms?: number;
  scaleFactor?: number; // 模拟部门资源占比
}

export const organizationTree: DepartmentNode[] = [
  {
    id: 'org-root',
    name: '江苏省',
    level: 1,
    code: 'HQ-001',
    scaleFactor: 1.0,
    children: [
      {
        id: 'org-rd',
        name: '研发中心',
        level: 2,
        code: 'RD-100',
        parentId: 'org-root',
        scaleFactor: 0.42,
        children: [
          {
            id: 'org-rd-fe',
            name: '前端平台组',
            level: 3,
            code: 'RD-101',
            parentId: 'org-rd',
            scaleFactor: 0.18,
          },
          {
            id: 'org-rd-be',
            name: '云原生后端组',
            level: 3,
            code: 'RD-102',
            parentId: 'org-rd',
            scaleFactor: 0.24,
          },
        ],
      },
      {
        id: 'org-ops',
        name: '运维保障中心',
        level: 2,
        code: 'OPS-200',
        parentId: 'org-root',
        scaleFactor: 0.28,
        children: [
          {
            id: 'org-ops-infra',
            name: '基础架构运维组',
            level: 3,
            code: 'OPS-201',
            parentId: 'org-ops',
            scaleFactor: 0.15,
          },
          {
            id: 'org-ops-auto',
            name: '自动化运维组',
            level: 3,
            code: 'OPS-202',
            parentId: 'org-ops',
            scaleFactor: 0.13,
          },
        ],
      },
      {
        id: 'org-data',
        name: '数据平台中心',
        level: 2,
        code: 'DAT-300',
        parentId: 'org-root',
        scaleFactor: 0.18,
        children: [
          {
            id: 'org-data-analytics',
            name: '大数据分析组',
            level: 3,
            code: 'DAT-301',
            parentId: 'org-data',
            scaleFactor: 0.18,
          },
        ],
      },
      {
        id: 'org-sec',
        name: '安全合规中心',
        level: 2,
        code: 'SEC-400',
        parentId: 'org-root',
        scaleFactor: 0.12,
        children: [
          {
            id: 'org-sec-net',
            name: '网络安全防护组',
            level: 3,
            code: 'SEC-401',
            parentId: 'org-sec',
            scaleFactor: 0.12,
          },
        ],
      },
    ],
  },
];

// 扁平化列表辅助获取
export function getAllDepartments(nodes: DepartmentNode[] = organizationTree): DepartmentNode[] {
  let list: DepartmentNode[] = [];
  nodes.forEach((node) => {
    list.push(node);
    if (node.children && node.children.length > 0) {
      list = list.concat(getAllDepartments(node.children));
    }
  });
  return list;
}

// 获取部门完整路径（如 ["江苏省", "研发中心", "前端平台组"]）
export function getDepartmentPath(deptId: string, nodes: DepartmentNode[] = organizationTree): string[] {
  const all = getAllDepartments(nodes);
  const target = all.find((d) => d.id === deptId);
  if (!target) return ['江苏省'];

  const path: string[] = [target.name];
  let current = target;
  while (current.parentId) {
    const parent = all.find((d) => d.id === current.parentId);
    if (parent) {
      path.unshift(parent.name);
      current = parent;
    } else {
      break;
    }
  }
  return path;
}

export const departmentAppsData = [
  { id: 1, name: '前端微服务组件库平台', type: 'Node.js / React', vms: '4台', status: '正常', health: 99 },
  { id: 2, name: '云原生后端 API 网关', type: 'Go / Kubernetes', vms: '6台', status: '正常', health: 98 },
  { id: 3, name: '大数据实时计算引擎', type: 'Spark / Flink', vms: '8台', status: '正常', health: 95 },
  { id: 4, name: '网络安全防护防火墙', type: 'Linux / DPDK', vms: '2台', status: '正常', health: 100 },
  { id: 5, name: '自动化运维调度平台', type: 'Python / Ansible', vms: '3台', status: '正常', health: 97 },
];

export interface ApplicationResourceItem {
  id: number;
  name: string;
  vms: number;
  cpu: string;
  cpuPercent: number;
  mem: string;
  memPercent: number;
  disk: string;
  diskPercent: number;
}

export function getDepartmentAppsData(deptName: string): ApplicationResourceItem[] {
  if (deptName.includes('运维') || deptName.includes('Ops')) {
    return [
      { id: 1, name: '云平台警报监控中心', vms: 12, cpu: '48 核', cpuPercent: 58, mem: '96 GB', memPercent: 62, disk: '1200 GB', diskPercent: 68 },
      { id: 2, name: 'CMDB 资源资产管理平台', vms: 6, cpu: '24 核', cpuPercent: 35, mem: '48 GB', memPercent: 40, disk: '400 GB', diskPercent: 30 },
      { id: 3, name: '自动化运维编排集群', vms: 8, cpu: '32 核', cpuPercent: 42, mem: '64 GB', memPercent: 50, disk: '600 GB', diskPercent: 45 },
      { id: 4, name: '堡垒机与安全审计系统', vms: 4, cpu: '16 核', cpuPercent: 28, mem: '32 GB', memPercent: 38, disk: '800 GB', diskPercent: 52 },
      { id: 5, name: '镜像仓库与软件包管理', vms: 6, cpu: '24 核', cpuPercent: 60, mem: '48 GB', memPercent: 58, disk: '3000 GB', diskPercent: 82 },
      { id: 6, name: '基础架构配置中心 Consul', vms: 4, cpu: '16 核', cpuPercent: 32, mem: '32 GB', memPercent: 44, disk: '300 GB', diskPercent: 35 },
    ];
  }
  if (deptName.includes('数据') || deptName.includes('Data')) {
    return [
      { id: 1, name: '实时数据流计算 Spark/Flink', vms: 16, cpu: '128 核', cpuPercent: 88, mem: '384 GB', memPercent: 82, disk: '4000 GB', diskPercent: 75 },
      { id: 2, name: '分布式数据库集群 Cockroach', vms: 12, cpu: '96 核', cpuPercent: 72, mem: '256 GB', memPercent: 78, disk: '6000 GB', diskPercent: 68 },
      { id: 3, name: '数据仓库与离线 ETL 调度', vms: 10, cpu: '40 核', cpuPercent: 50, mem: '160 GB', memPercent: 60, disk: '5000 GB', diskPercent: 70 },
      { id: 4, name: '商业智能分析报表 BI 平台', vms: 6, cpu: '24 核', cpuPercent: 38, mem: '48 GB', memPercent: 45, disk: '800 GB', diskPercent: 40 },
      { id: 5, name: '特征挖掘与 AI 向量检索引擎', vms: 8, cpu: '64 核', cpuPercent: 78, mem: '128 GB', memPercent: 70, disk: '1500 GB', diskPercent: 58 },
      { id: 6, name: '图计算与关系关联挖掘', vms: 6, cpu: '32 核', cpuPercent: 45, mem: '64 GB', memPercent: 52, disk: '1000 GB', diskPercent: 48 },
    ];
  }
  if (deptName.includes('安全') || deptName.includes('Sec')) {
    return [
      { id: 1, name: '网络流量入侵检测系统 IDS', vms: 8, cpu: '48 核', cpuPercent: 65, mem: '96 GB', memPercent: 70, disk: '1500 GB', diskPercent: 60 },
      { id: 2, name: '主机安全与微隔离客户端', vms: 6, cpu: '24 核', cpuPercent: 30, mem: '48 GB', memPercent: 35, disk: '500 GB', diskPercent: 25 },
      { id: 3, name: 'SIEM 态势感知日志分析', vms: 10, cpu: '64 核', cpuPercent: 82, mem: '160 GB', memPercent: 76, disk: '4000 GB', diskPercent: 84 },
      { id: 4, name: '漏洞扫描与合规治理平台', vms: 4, cpu: '16 核', cpuPercent: 40, mem: '32 GB', memPercent: 42, disk: '600 GB', diskPercent: 38 },
      { id: 5, name: '密钥与敏感数据加密保险箱', vms: 4, cpu: '16 核', cpuPercent: 25, mem: '32 GB', memPercent: 30, disk: '300 GB', diskPercent: 20 },
      { id: 6, name: '零信任身份访问控制 ZTNA', vms: 6, cpu: '24 核', cpuPercent: 44, mem: '48 GB', memPercent: 50, disk: '500 GB', diskPercent: 32 },
    ];
  }
  // 默认（研发中心及其下属团队）
  return [
    { id: 1, name: '代码托管平台 GitLab', vms: 8, cpu: '32 核', cpuPercent: 45, mem: '64 GB', memPercent: 60, disk: '500 GB', diskPercent: 80 },
    { id: 2, name: '持续集成流水线 CI/CD', vms: 15, cpu: '120 核', cpuPercent: 89, mem: '256 GB', memPercent: 70, disk: '2000 GB', diskPercent: 40 },
    { id: 3, name: '统一身份认证中心 SSO', vms: 6, cpu: '24 核', cpuPercent: 35, mem: '48 GB', memPercent: 42, disk: '300 GB', diskPercent: 28 },
    { id: 4, name: '微服务 API 网关服务', vms: 10, cpu: '40 核', cpuPercent: 62, mem: '80 GB', memPercent: 65, disk: '400 GB', diskPercent: 45 },
    { id: 5, name: '分布式缓存服务 Redis', vms: 12, cpu: '48 核', cpuPercent: 58, mem: '192 GB', memPercent: 88, disk: '600 GB', diskPercent: 52 },
    { id: 6, name: '实时日志检索分析 ELK', vms: 7, cpu: '28 核', cpuPercent: 48, mem: '112 GB', memPercent: 68, disk: '1500 GB', diskPercent: 72 },
  ];
}





