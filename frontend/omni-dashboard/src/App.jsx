// src/App.jsx
// Main Dashboard — Omni Tracker
// Features: Dark/Light theme, StatCards, Charts, Auto-refresh countdown

import { useState } from 'react'
import { useOmniData } from './hooks/useOmniData'
import StatCard  from './components/StatCard'
import ChartCard from './components/ChartCard'

// ── Theme definitions ─────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:        '#0d0d14',
    surface:   '#13131f',
    text:      '#f0f0f5',
    textMuted: 'rgba(240,240,245,0.4)',
    border:    'rgba(255,255,255,0.07)',
  },
  light: {
    bg:        '#f5f5f0',
    surface:   '#ffffff',
    text:      '#1a1a2e',
    textMuted: 'rgba(26,26,46,0.4)',
    border:    'rgba(0,0,0,0.08)',
  }
}

const WEATHER_ACCENT  = '#38bdf8'   // sky blue
const CURRENCY_ACCENT = '#34d399'   // emerald green

// ── format helpers ────────────────────────────────────────────────────────────
const formatTime = (isoStr) => {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleString('th-TH', {
    day:    '2-digit',
    month:  '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey]         = useState('dark')
  const [refreshMins, setRefreshMins]   = useState(1)   // auto-refresh ทุก 1 นาที
  const theme = THEMES[themeKey]

  const {
    weather, currency,
    latestWeather, latestCurrency,
    loading, error,
    lastUpdated, countdown,
    refetch
  } = useOmniData(refreshMins * 60)

  // ── styles ─────────────────────────────────────────────────────────────────
  const appStyle = {
    minHeight:       '100vh',
    background:      theme.bg,
    color:           theme.text,
    fontFamily:      'Syne, sans-serif',
    transition:      'background 0.3s ease, color 0.3s ease',
    padding:         '0 0 60px',
  }

  const headerStyle = {
    padding:         '28px 40px 24px',
    borderBottom:    `1px solid ${theme.border}`,
    display:         'flex',
    alignItems:      'center',
    gap:             '16px',
    flexWrap:        'wrap',
  }

  const contentStyle = {
    maxWidth:  '1200px',
    margin:    '0 auto',
    padding:   '40px 40px 0',
  }

  const gridStyle = {
    display:             'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap:                 '20px',
    marginBottom:        '32px',
  }

  const btnStyle = (active) => ({
    background:   active
      ? (themeKey === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)')
      : 'transparent',
    border:       `1px solid ${theme.border}`,
    borderRadius: '8px',
    color:        theme.text,
    fontFamily:   'JetBrains Mono, monospace',
    fontSize:     '12px',
    padding:      '6px 14px',
    cursor:       'pointer',
    transition:   'all 0.2s',
  })

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={appStyle}>

      {/* ── Header ── */}
      <header style={headerStyle}>

        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <span style={{ fontSize: '28px' }}>🌐</span>
          <div>
            <h1 style={{
              margin: 0, fontSize: '22px', fontWeight: '800',
              letterSpacing: '-0.02em', lineHeight: 1.1
            }}>
              Omni Tracker
            </h1>
            <p style={{
              margin: 0, fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
              color: theme.textMuted, marginTop: '2px'
            }}>
              Bangkok Weather · USD/THB Rate
            </p>
          </div>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>

          {/* Auto-refresh selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: theme.textMuted }}>
              Refresh every
            </span>
            {[1, 5, 15].map(m => (
              <button
                key={m}
                style={btnStyle(refreshMins === m)}
                onClick={() => setRefreshMins(m)}
              >
                {m}m
              </button>
            ))}
          </div>

          {/* Countdown + manual refresh */}
          <button
            onClick={refetch}
            style={{
              ...btnStyle(false),
              display: 'flex', alignItems: 'center', gap: '6px',
              color: WEATHER_ACCENT,
              borderColor: `${WEATHER_ACCENT}40`,
            }}
          >
            <span style={{
              display: 'inline-block',
              animation: loading ? 'spin 1s linear infinite' : 'none'
            }}>↻</span>
            {loading ? 'loading…' : `${countdown}s`}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setThemeKey(k => k === 'dark' ? 'light' : 'dark')}
            style={{ ...btnStyle(false), fontSize: '16px', padding: '6px 10px' }}
            title="Toggle theme"
          >
            {themeKey === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Last updated */}
        {lastUpdated && (
          <div style={{
            width: '100%',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: theme.textMuted,
            marginTop: '-8px'
          }}>
            Last updated: {lastUpdated.toLocaleTimeString('th-TH')}
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <main style={contentStyle}>

        {/* Error banner */}
        {error && (
          <div style={{
            background:   '#ff4d4d18',
            border:       '1px solid #ff4d4d40',
            borderRadius: '10px',
            padding:      '14px 20px',
            marginBottom: '24px',
            fontFamily:   'JetBrains Mono, monospace',
            fontSize:     '12px',
            color:        '#ff6b6b',
          }}>
            ⚠️ API Error: {error}
            <span style={{ marginLeft: '16px', opacity: 0.6 }}>
              — Make sure Django server is running on localhost:8000
            </span>
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div style={gridStyle}>
          <StatCard
            theme={themeKey}
            icon="🌡️"
            title="Bangkok Temperature"
            value={latestWeather ? latestWeather.temperature?.toFixed(1) : '—'}
            unit="°C"
            accent={WEATHER_ACCENT}
            subtitle={latestWeather ? `Updated: ${formatTime(latestWeather.timestamp)}` : 'Waiting for data…'}
          />
          <StatCard
            theme={themeKey}
            icon="💱"
            title="USD / THB Rate"
            value={latestCurrency ? latestCurrency.rate?.toFixed(2) : '—'}
            unit="฿"
            accent={CURRENCY_ACCENT}
            subtitle={latestCurrency ? `Updated: ${formatTime(latestCurrency.timestamp)}` : 'Waiting for data…'}
          />
        </div>

        {/* ── Charts ── */}
        <div style={{ display: 'grid', gap: '20px' }}>
          <ChartCard
            theme={themeKey}
            icon="🌡️"
            title="Temperature History — Bangkok"
            data={weather}
            dataKey="temperature"
            unit="°C"
            accent={WEATHER_ACCENT}
          />
          <ChartCard
            theme={themeKey}
            icon="💱"
            title="USD/THB Rate History"
            data={currency}
            dataKey="rate"
            unit="฿"
            accent={CURRENCY_ACCENT}
          />
        </div>

        {/* ── Footer ── */}
        <div style={{
          marginTop:   '48px',
          paddingTop:  '24px',
          borderTop:   `1px solid ${theme.border}`,
          display:     'flex',
          gap:         '24px',
          flexWrap:    'wrap',
        }}>
          {[
            { label: 'Weather Records', value: weather.length,  color: WEATHER_ACCENT },
            { label: 'Currency Records', value: currency.length, color: CURRENCY_ACCENT },
            { label: 'Data Source', value: 'Open-Meteo · Frankfurter', color: theme.textMuted },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize:   '10px',
                color:      theme.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '2px'
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize:   '15px',
                fontWeight: '600',
                color,
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* spin keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        * { box-sizing: border-box; margin: 0; padding: 0 }
        body { margin: 0 }
      `}</style>
    </div>
  )
}
