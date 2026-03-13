'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '@/lib/api'
import type { Broker } from '@/lib/types'

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.brokers.list().then(setBrokers).finally(() => setLoading(false))
  }, [])

  const chartData = brokers.slice(0, 10).map(b => ({
    name: b.broker_name.split(' ').slice(0, 2).join(' '),
    score: b.risk_score,
    submissions: b.submission_count,
    flagged: b.fraud_flag_count,
  }))

  return (
    <div className="min-h-screen bg-[#0a1210] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-white/40 hover:text-white/70 text-sm">Dashboard</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/70 text-sm">Broker Risk Profiles</span>
        </div>

        <h1 className="text-xl font-bold mb-6">Broker Risk Profiles</h1>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="rounded-xl border border-white/10 p-6 mb-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-4">Risk Score by Broker</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Bar dataKey="score" fill="#0d9488" radius={[4, 4, 0, 0]} name="Risk Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Broker table */}
        <div className="rounded-xl border border-white/10 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          {loading ? (
            <div className="p-8 text-center text-white/30">Loading brokers…</div>
          ) : brokers.length === 0 ? (
            <div className="p-8 text-center text-white/30">No brokers tracked yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Broker', 'ABN', 'Submissions', 'Flagged', 'Fraud Rate', 'Risk Score', 'Last Seen'].map(h => (
                    <th key={h} className="text-left text-white/40 font-normal px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brokers.map(b => {
                  const fraudRate = b.submission_count > 0
                    ? ((b.fraud_flag_count / b.submission_count) * 100).toFixed(0)
                    : '0'
                  const riskColor =
                    b.risk_score >= 70 ? 'text-red-400' :
                    b.risk_score >= 45 ? 'text-orange-400' :
                    b.risk_score >= 20 ? 'text-amber-400' :
                    'text-emerald-400'

                  return (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                      <td className="px-5 py-3">
                        <Link href={`/brokers/${b.id}`} className="text-teal-400 hover:text-teal-300">
                          {b.broker_name}
                        </Link>
                        {b.broker_license && (
                          <div className="text-white/25 text-xs">ACL: {b.broker_license}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-white/40 font-mono text-xs">{b.broker_abn || '—'}</td>
                      <td className="px-5 py-3 text-white/70">{b.submission_count}</td>
                      <td className="px-5 py-3 text-white/70">{b.fraud_flag_count}</td>
                      <td className="px-5 py-3">
                        <span className={Number(fraudRate) >= 20 ? 'text-red-400 font-semibold' : 'text-white/50'}>
                          {fraudRate}%
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-bold ${riskColor}`}>{b.risk_score}</span>
                      </td>
                      <td className="px-5 py-3 text-white/30 text-xs">
                        {new Date(b.last_seen_at).toLocaleDateString('en-AU')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
