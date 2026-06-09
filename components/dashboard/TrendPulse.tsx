"use client";

import { motion } from "framer-motion";
import { trendData } from "@/lib/data/trendData";
import { TrendingUp, TrendingDown } from "lucide-react";

export function TrendPulse() {
  return (
    <div
      className="intel-panel rounded-xl px-5 py-2.5 w-full overflow-hidden shrink-0"
      style={{ borderColor: 'rgba(201,168,76,0.18)' }}
    >
      <div className="flex items-center gap-6">
        {/* Label */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1 h-4 rounded-full" style={{ background: 'var(--color-gold)', opacity: 0.7 }} />
          <span className="section-label">Tendencias en vivo</span>
        </div>

        {/* Scrolling ticker */}
        <div
          className="flex-1 overflow-hidden relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
          }}
        >
          <motion.div
            className="flex gap-10 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            {[...trendData, ...trendData].map((trend, index) => (
              <div key={index} className="flex items-center gap-2.5">
                {/* Separator */}
                <span className="mono-data text-[10px]" style={{ color: 'rgba(201,168,76,0.3)' }}>
                  //
                </span>
                <span className="mono-data text-xs text-[#F1F0ED] tracking-tight font-medium">
                  {trend.tag}
                </span>
                <span
                  className={`flex items-center gap-0.5 mono-data text-[10px] font-semibold`}
                  style={{ color: trend.direction === 'up' ? 'var(--color-cepeda)' : 'var(--color-alert)' }}
                >
                  {trend.direction === 'up'
                    ? <TrendingUp size={9} />
                    : <TrendingDown size={9} />}
                  {Math.abs(trend.velocity)}%
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Timestamp */}
        <div className="hidden xl:block shrink-0 mono-data text-[9px] uppercase tracking-widest"
          style={{ color: 'rgba(201,168,76,0.4)' }}>
          {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} COT
        </div>
      </div>
    </div>
  );
}
