export function CriticalAlerts() {
  return (
    <div
      className="absolute top-5 left-5 z-10 w-80"
      style={{
        background: 'rgba(4,6,13,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderLeft: '3px solid #EF4444',
        borderRadius: '10px',
        boxShadow: '0 0 30px rgba(239,68,68,0.12), 0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: '1px solid rgba(239,68,68,0.15)' }}
      >
        {/* Blinking alert dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: '#EF4444' }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: '#EF4444' }}
          />
        </span>
        <span
          className="mono-data text-[9px] font-semibold uppercase tracking-widest"
          style={{ color: '#EF4444' }}
        >
          Flash — Alerta crítica
        </span>
        <div className="ml-auto mono-data text-[8px]" style={{ color: 'rgba(239,68,68,0.5)' }}>
          PRIORIDAD 1
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(241,240,237,0.88)' }}>
          Nuevo riesgo reputacional detectado para{" "}
          <span className="font-semibold" style={{ color: 'var(--color-espriella)' }}>
            Abelardo de la Espriella
          </span>{" "}
          en el caso Saab. Monitoreo activo en 12 medios.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="mono-data text-[8px] uppercase tracking-widest"
            style={{ color: 'rgba(241,240,237,0.3)' }}>
            Fuentes: 12 · Alcance: 340K
          </div>
        </div>
      </div>
    </div>
  );
}
