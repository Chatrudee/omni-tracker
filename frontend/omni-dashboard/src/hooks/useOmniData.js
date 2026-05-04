// src/hooks/useOmniData.js
// Custom hook — ดึงข้อมูลจาก Django API
// แยก logic ออกจาก UI (หลักการ Separation of Concerns)

import { useState, useEffect, useCallback } from 'react'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000'

export function useOmniData(refreshInterval = 60) {
  const [weather, setWeather]       = useState([])
  const [currency, setCurrency]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [countdown, setCountdown]   = useState(refreshInterval)

  // ฟังก์ชัน fetch หลัก — useCallback ป้องกัน re-create ทุก render
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // fetch ทั้งสองพร้อมกัน (parallel) เร็วกว่า fetch ทีละอัน
      const [weatherRes, currencyRes] = await Promise.all([
        fetch(`${API_BASE}/api/weather/?page_size=30`),
        fetch(`${API_BASE}/api/currency/?page_size=30`)
      ])

      if (!weatherRes.ok)  throw new Error(`Weather API error: ${weatherRes.status}`)
      if (!currencyRes.ok) throw new Error(`Currency API error: ${currencyRes.status}`)

      const weatherData  = await weatherRes.json()
      const currencyData = await currencyRes.json()

      // Django pagination → ข้อมูลอยู่ใน .results
      const weatherList  = weatherData.results  || []
      const currencyList = currencyData.results || []

      // เรียงจากเก่าไปใหม่ เพื่อให้ chart แสดงซ้ายไปขวาถูกต้อง
      setWeather([...weatherList].reverse())
      setCurrency([...currencyList].reverse())
      setLastUpdated(new Date())
      setCountdown(refreshInterval)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [refreshInterval])

  // Auto refresh — ดึงข้อมูลใหม่ทุก refreshInterval วินาที
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, refreshInterval * 1000)
    return () => clearInterval(interval)
  }, [fetchData, refreshInterval])

  // Countdown timer — นับถอยหลังแสดงให้ user รู้ว่าจะ refresh เมื่อไหร่
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? refreshInterval : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [refreshInterval])

  // ค่าล่าสุด (index สุดท้าย = ใหม่สุด หลังจาก reverse แล้ว)
  const latestWeather  = weather[weather.length - 1]  || null
  const latestCurrency = currency[currency.length - 1] || null

  return {
    weather,
    currency,
    latestWeather,
    latestCurrency,
    loading,
    error,
    lastUpdated,
    countdown,
    refetch: fetchData
  }
}
