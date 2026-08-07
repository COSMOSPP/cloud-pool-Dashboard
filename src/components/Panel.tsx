import { ReactNode } from 'react';
import { cn } from '../utils';

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Panel({ title, children, className, action }: PanelProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col bg-[#050f24]/90 backdrop-blur-xl border border-[#1e3a5f]/80 rounded-xs shadow-[inset_0_0_25px_rgba(6,182,212,0.08)] overflow-hidden',
        className
      )}
    >
      {/* 顶部亮青色科技发光线条 */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 z-20"></div>

      {/* 四角 3D 科技直角包边 */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 z-20"></div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 z-20"></div>
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 z-20"></div>
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 z-20"></div>

      {title && (
        <div className="relative px-4 py-2 flex items-center justify-between bg-gradient-to-r from-[#0b213e] via-[#091a33] to-[#040c1b] border-b border-[#1e3a5f]/80 z-10">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
            <h3 className="text-[14px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 tracking-wider">
              {title}
            </h3>
          </div>
          {action && <div className="flex items-center">{action}</div>}
        </div>
      )}
      <div className="flex-1 p-3 overflow-hidden relative z-10">{children}</div>
    </div>
  );
}

