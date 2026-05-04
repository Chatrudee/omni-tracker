// src/components/StatCard.jsx
// Card แสดงค่าล่าสุด — Weather หรือ Currency

export default function StatCard({ title, value, unit, subtitle, icon, accent, theme }) {
  const dark = theme === 'dark'

  return (
    <div style={{
      background:    dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      border:        `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius:  '16px',
      padding:       '28px 32px',
      position:      'relative',
      overflow:      'hidden',
      transition:    'transform 0.2s ease, box-shadow 0.2s ease',
      cursor:        'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform  = 'translateY(-4px)'
      e.currentTarget.style.boxShadow  = `0 12px 40px ${accent}30`
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform  = 'translateY(0)'
      e.currentTarget.style.boxShadow  = 'none'
    }}
    >
      {/* accent bar ด้านบน */}
      <div style={{
        position:     'absolute',
        top: 0, left: 0, right: 0,
        height:       '3px',
        background:   accent,
        borderRadius: '16px 16px 0 0'
      }} />

      {/* icon + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '22px' }}>{icon}</span>
        <span style={{
          fontFamily:  'Syne, sans-serif',
          fontSize:    '13px',
          fontWeight:  '600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:       dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
        }}>
          {title}
        </span>
      </div>

      {/* ค่าหลัก */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <span style={{
          fontFamily:  'Syne, sans-serif',
          fontSize:    '52px',
          fontWeight:  '800',
          lineHeight:  1,
          color:       accent,
        }}>
          {value ?? '—'}
        </span>
        <span style={{
          fontFamily:  'JetBrains Mono, monospace',
          fontSize:    '18px',
          fontWeight:  '600',
          color:       dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'
        }}>
          {unit}
        </span>
      </div>

      {/* subtitle (timestamp) */}
      <p style={{
        fontFamily:  'JetBrains Mono, monospace',
        fontSize:    '11px',
        color:       dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        margin:      0
      }}>
        {subtitle}
      </p>
    </div>
  )
}
