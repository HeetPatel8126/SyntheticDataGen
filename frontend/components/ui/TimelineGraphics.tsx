'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface Branch {
  color: string;
  icon: React.ReactNode;
  label?: string;
}

interface GraphicProps {
  theme?: 'light' | 'dark';
}

export function BranchingGraphic({ branches, theme = 'light' }: { branches: Branch[] } & GraphicProps) {
  const nodeSpacing = 44;
  const height = Math.max(200, branches.length * nodeSpacing + 60);
  const centerY = height / 2;
  const startX = 80;
  const endX = 220;

  const isDark = theme === 'dark';
  const trackColor = isDark ? '#333' : '#d4d4d4';
  const centerFill = isDark ? 'black' : 'white'; // Actually, Vercel uses black center node with white triangle even on dark
  const centerStroke = isDark ? '#333' : '#000';
  const nodeFill = isDark ? 'black' : 'white';
  const nodeStroke = isDark ? '#333' : '#e5e5e5';
  const labelColor = isDark ? '#888' : '#666';

  return (
    <div className="relative w-full h-full min-h-[250px] flex items-center justify-center">
      <svg width={320} height={height} className="overflow-visible">
        {branches.map((branch, i) => {
          const totalSpan = (branches.length - 1) * nodeSpacing;
          const endY = centerY - totalSpan / 2 + i * nodeSpacing;

          // Bezier curve
          const pathD = `M ${startX} ${centerY} C ${startX + 60} ${centerY}, ${endX - 60} ${endY}, ${endX} ${endY}`;
          
          return (
            <g key={i}>
              <path
                d={pathD}
                fill="none"
                stroke={trackColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <motion.path
                d={pathD}
                fill="none"
                stroke={branch.color}
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.15 + 0.2 }}
              />
            </g>
          );
        })}

        {/* Center Node */}
        <circle cx={startX} cy={centerY} r="24" fill={isDark ? 'black' : 'black'} stroke={centerStroke} strokeWidth="2" />
        {/* Triangle inside center node */}
        <path d={`M ${startX - 5} ${centerY + 6} L ${startX + 5} ${centerY + 6} L ${startX} ${centerY - 6} Z`} fill="white" />
        
        {/* Right Nodes & Labels */}
        {branches.map((branch, i) => {
          const totalSpan = (branches.length - 1) * nodeSpacing;
          const endY = centerY - totalSpan / 2 + i * nodeSpacing;

          return (
            <g key={`node-${i}`}>
              {/* Outer stroke for icon */}
              <rect x={endX} y={endY - 14} width="28" height="28" rx="6" fill={nodeFill} stroke={nodeStroke} strokeWidth="1" />
              <foreignObject x={endX + 6} y={endY - 8} width="16" height="16">
                <div className="w-full h-full flex items-center justify-center" style={{ color: branch.color }}>
                  {branch.icon}
                </div>
              </foreignObject>
              {/* Label */}
              {branch.label && (
                <text x={endX + 40} y={endY + 4} fill={labelColor} fontSize="12" fontFamily="monospace">
                  {branch.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function LinearTimelineGraphic({ theme = 'light' }: GraphicProps) {
  const isDark = theme === 'dark';
  const trackColor = isDark ? '#333' : '#d4d4d4';
  const nodeFill = isDark ? 'black' : 'white';
  const nodeStroke = isDark ? '#333' : '#e5e5e5';
  const textColor = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="relative w-full h-full min-h-[250px] flex items-center justify-center overflow-hidden">
      <svg width="100%" height="100" className="overflow-visible min-w-[600px]">
        {/* Base Track */}
        <path d="M 0 50 L 1000 50" fill="none" stroke={trackColor} strokeWidth="2" />
        
        {/* Animated Lines overlapping like in the Vercel screenshot */}
        <motion.path 
          d="M 20 50 L 120 50 L 120 40 L 220 40 L 220 50 L 800 50"
          fill="none" stroke="#3b82f6" strokeWidth="2"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
        />
        <motion.path 
          d="M 60 50 L 150 50 L 150 60 L 280 60 L 280 50 L 700 50"
          fill="none" stroke="#eab308" strokeWidth="2"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, delay: 0.2 }}
        />
        <motion.path 
          d="M 100 50 L 180 50 L 180 45 L 320 45 L 320 50 L 900 50"
          fill="none" stroke="#ef4444" strokeWidth="2"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.4 }}
        />
        
        {/* Node on the line */}
        <rect x="50" y="38" width="80" height="24" rx="4" fill={nodeFill} stroke={nodeStroke} strokeWidth="1" />
        <foreignObject x="54" y="42" width="72" height="16">
           <div className={`w-full h-full flex items-center justify-center text-[10px] ${textColor} font-mono gap-1`}>
             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8"/><path d="M12 8v4M12 16h.01"/></svg>
             processing
           </div>
        </foreignObject>

        {/* End Node on the line */}
        <rect x="400" y="38" width="80" height="24" rx="4" fill={nodeFill} stroke={nodeStroke} strokeWidth="1" />
        <foreignObject x="404" y="42" width="72" height="16">
           <div className={`w-full h-full flex items-center justify-center text-[10px] ${textColor} font-mono gap-1`}>
             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
             complete
           </div>
        </foreignObject>
      </svg>
    </div>
  );
}

export function StackedBoxesGraphic({ theme = 'light' }: GraphicProps) {
  const isDark = theme === 'dark';
  const boxBorder = isDark ? 'border-[#333]' : 'border-[#e5e5e5]';
  const boxBg = isDark ? 'bg-black/50' : 'bg-white';
  const itemBg = isDark ? 'bg-[#111]' : 'bg-[#f9f9f9]';
  const itemBorder = isDark ? 'border-[#333]' : 'border-[#eaeaea]';
  const lineBg = isDark ? 'bg-gray-600' : 'bg-gray-200';
  const shadow = isDark ? 'shadow-2xl' : 'shadow-xl';

  return (
    <div className="relative w-full h-full min-h-[250px] flex items-center justify-center p-8">
       <div className={`relative w-[280px] h-[160px] border ${boxBorder} rounded-xl p-4 ${boxBg} ${shadow} flex flex-col gap-3`}>
          <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`w-full h-10 ${itemBg} border ${itemBorder} rounded flex items-center px-3 gap-3 justify-between shadow-sm`}>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">User Payload</span>
             </div>
             <span className="text-[8px] text-gray-400 font-mono">1.2ms</span>
          </motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className={`w-full h-10 ${itemBg} border ${itemBorder} rounded flex items-center px-3 gap-3 justify-between shadow-sm`}>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">Event Stream</span>
             </div>
             <span className="text-[8px] text-gray-400 font-mono">0.8ms</span>
          </motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className={`w-full h-10 ${itemBg} border ${itemBorder} rounded flex items-center px-3 gap-3 justify-between shadow-sm`}>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">Schema Sync</span>
             </div>
             <span className="text-[8px] text-gray-400 font-mono">3.4ms</span>
          </motion.div>
          
          {/* Overlay connection */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border border-black flex items-center justify-center">
            <div className="w-3 h-3 bg-white rotate-45"></div>
          </div>
       </div>
    </div>
  );
}
