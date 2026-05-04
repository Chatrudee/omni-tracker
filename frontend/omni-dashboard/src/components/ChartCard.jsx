// src/components/ChartCard.jsx
// Wrapper สำหรับ chart แต่ละอัน — ใช้ recharts library

import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'

// Custom Tooltip ที่สวยกว่า default
function CustomTooltip({ active, payload, label, unit, accent, dark }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:   dark ? '#1a1a2e' : '#ffffff',
      border:       `1px solid ${accent}60`,
      borderRadius: '10px',
      padding:      '10px 16px',
      fontFamily:   'JetBrains Mono, monospace',
      fontSize:     '12px',
      boxShadow:    `0 8px 24px ${accent}20`
    }}>
      <p style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', margin: '0 0 4px' }}>
        {label}
      </p>
      <p style={{ color: accent, margin: 0, fontWeight: 600, fontSize: '16px' }}>
        {payload[0].value} {unit}
      </p>
    </div>
  )
}

export default function ChartCard({ title, data, dataKey, unit, accent, theme, icon }) {
  const dark = theme === 'dark'

  // format timestamp ให้อ่านง่ายบน X axis
  const formatted = data.map(d => ({
    ...d,
    label: d.timestamp
      ? new Date(d.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      : ''
  }))

  return (
    <div style={{
      background:   dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      border:       `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: '16px',
      padding:      '28px 32px',
      position:     'relative',
      overflow:     'hidden',
    }}>
      {/* accent bar */}
      <div style={{
        position:     'absolute',
        top: 0, left: 0, right: 0,
        height:       '3px',
        background:   accent,
        borderRadius: '16px 16px 0 0'
      }} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{
          fontFamily:    'Syne, sans-serif',
          fontSize:      '13px',
          fontWeight:    '600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:         dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
        }}>
          {title}
        </span>
        <span style={{
          marginLeft:  'auto',
          fontFamily:  'JetBrains Mono, monospace',
          fontSize:    '11px',
          color:       dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'
        }}>
          {data.length} records
        </span>
      </div>

      {/* chart */}
      {data.length === 0 ? (
        <div style={{
          height:      '200px',
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'center',
          fontFamily:  'JetBrains Mono, monospace',
          fontSize:    '13px',
          color:       dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
        }}>
          No data yet — bot needs to run first
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={accent} stopOpacity={0.25} />
                <stop offset="95%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 10,
                      fill: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 10,
                      fill: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={v => `${v}`}
            />
            <Tooltip
              content={<CustomTooltip unit={unit} accent={accent} dark={dark} />}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={accent}
              strokeWidth={2}
              fill={`url(#grad-${dataKey})`}
              dot={false}
              activeDot={{ r: 5, fill: accent, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
