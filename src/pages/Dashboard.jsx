import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import {
  Sparkles,
  HeartHandshake,
  TrendingDown,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Heart,
} from 'lucide-react'
import { listCheckIns, seedDemoHistory } from '../lib/store'
import { computeWellbeing, generateInsights } from '../lib/riskEngine'
import { Chip, SectionLabel, ProgressBar } from '../components/ui'
import ReferralModal from '../components/ReferralModal'

function linreg(ys) {
  const n = ys.length

  if (n < 2) {
    return {
      slope: 0,
      intercept: ys[0] ?? 50,
    }
  }

  const xs = ys.map((_, i) => i)
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n

  let num = 0
  let den = 0

  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    den += (xs[i] - mx) ** 2
  }

  const slope = den === 0 ? 0 : num / den

  return {
    slope,
    intercept: my - slope * mx,
  }
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function getResultMessage(score) {
  if (score >= 70) {
    return {
      icon: CheckCircle2,
      title: 'You are doing well',
      body: 'Your check-in shows mostly stable wellbeing signals. Keep your healthy routine going and continue checking in regularly.',
      action: 'Keep your routine going',
      color: '#059669',
      bg: '#05966915',
    }
  }

  if (score >= 45) {
    return {
      icon: AlertTriangle,
      title: 'Some signals need attention',
      body: 'Your result shows a few areas that may need care. Try a short breathing reset, reduce pressure where possible, and connect with someone you trust.',
      action: 'Take small supportive steps today',
      color: '#d97706',
      bg: '#f59e0b1a',
    }
  }

  return {
    icon: HeartHandshake,
    title: 'Reach out for support',
    body: 'Your result shows elevated concern. You do not have to handle this alone. Consider speaking with a trusted person, counsellor, or support service.',
    action: 'Consider reaching out today',
    color: '#ba1a1a',
    bg: '#ffdad633',
  }
}

export default function Dashboard() {
  const location = useLocation()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReferral, setShowReferral] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      const existing = await listCheckIns(14)

      // Only seed demo data when there are no real check-ins.
      // This prevents demo data from replacing the latest check-in.
      if (existing.length === 0) {
        seedDemoHistory(8)
      }

      const updatedHistory = await listCheckIns(14)
      setHistory(updatedHistory)
      setLoading(false)
    })()
  }, [location.key])

  const latest = history[0]
  const indicators = latest?.indicators || {}

  const result = useMemo(() => {
    return latest ? computeWellbeing(indicators) : null
  }, [latest, indicators])

  const insights = result ? generateInsights(result, indicators) : []

  const delta = history.length > 1 ? history[0].score - history[1].score : 0

  const resultMessage = result ? getResultMessage(result.score) : null
  const ResultIcon = resultMessage?.icon || Heart

  const forecast = useMemo(() => {
    const chrono = [...history].reverse()
    const scores = chrono.map((h) => h.score)

    if (scores.length < 2) return null

    const { slope, intercept } = linreg(scores)
    const n = scores.length

    const data = chrono.map((h) => ({
      label: new Date(h.created_at).toLocaleDateString('en', {
        weekday: 'short',
      }),
      actual: h.score,
    }))

    data[n - 1].forecast = scores[n - 1]

    const horizon = 5

    for (let i = 1; i <= horizon; i++) {
      const y = clamp(Math.round(intercept + slope * (n - 1 + i)), 0, 100)

      data.push({
        label: `+${i}d`,
        forecast: y,
      })
    }

    let daysToRisk = null

    if (slope < -0.2) {
      const xCross = (45 - intercept) / slope
      const d = Math.ceil(xCross - (n - 1))

      if (d > 0 && d <= 30) {
        daysToRisk = d
      }
    }

    return {
      data,
      slope,
      daysToRisk,
      projected: data[data.length - 1].forecast,
    }
  }, [history])

  if (loading) {
    return (
      <div className="py-20 text-center text-on-surface-variant">
        Loading…
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold text-secondary">
          <Sparkles size={14} />
          AI wellbeing dashboard
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
          Your Wellbeing Result
        </h1>

        <p className="mt-1 text-sm text-on-surface-variant">
          A simple summary of your latest check-in and recommended next steps.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        {/* Main result */}
        <div className="card lg:col-span-2">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <SectionLabel>Today’s Wellbeing Score</SectionLabel>

              <div className="mt-3 flex items-end gap-3">
                <span className="text-6xl font-bold">
                  {result?.score ?? '—'}
                </span>

                <span className="mb-2 text-sm text-on-surface-variant">
                  /100
                </span>

                {delta !== 0 && (
                  <span
                    className={`mb-2 flex items-center gap-1 text-sm font-medium ${
                      delta >= 0 ? 'text-success' : 'text-error'
                    }`}
                  >
                    {delta >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {delta >= 0 ? '+' : ''}
                    {delta} this week
                  </span>
                )}
              </div>
            </div>

            {result && (
              <Chip color={result.color}>
                {result.bandLabel}
              </Chip>
            )}
          </div>

          <div className="mt-5">
            <ProgressBar value={result?.score ?? 0} color={result?.color} />
          </div>
        </div>

        {/* Simple result explanation */}
        {result && resultMessage && (
          <div className="card lg:col-span-2">
            <div
              className="rounded-3xl p-5"
              style={{
                background: resultMessage.bg,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="rounded-2xl p-3"
                  style={{
                    background: '#ffffff90',
                    color: resultMessage.color,
                  }}
                >
                  <ResultIcon size={28} />
                </div>

                <div>
                  <p
                    className="text-lg font-bold"
                    style={{
                      color: resultMessage.color,
                    }}
                  >
                    {resultMessage.title}
                  </p>

                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
                    {resultMessage.body}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-surface-low p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Score
                </p>
                <p className="mt-2 text-3xl font-bold text-on-surface">
                  {result.score}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Out of 100
                </p>
              </div>

              <div className="rounded-2xl bg-surface-low p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Status
                </p>
                <p
                  className="mt-2 text-lg font-bold"
                  style={{
                    color: result.color,
                  }}
                >
                  {result.bandLabel}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Based on today’s check-in
                </p>
              </div>

              <div className="rounded-2xl bg-surface-low p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Suggested action
                </p>
                <p className="mt-2 text-sm font-semibold text-on-surface">
                  {resultMessage.action}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  A simple next step for now
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Predictive forecast */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ai-gradient text-white">
                <Zap size={15} />
              </span>
              <SectionLabel>Wellbeing Trend</SectionLabel>
            </div>

            <Chip color={forecast?.daysToRisk ? '#ba1a1a' : '#059669'}>
              {forecast?.daysToRisk ? `Needs attention` : 'On track'}
            </Chip>
          </div>

          {forecast ? (
            <>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={forecast.data}
                    margin={{ top: 8, right: 10, left: -22, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4cd7f6" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#4cd7f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef0" vertical={false} />

                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#76777d' }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#76777d' }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e6e8ea',
                        fontSize: 12,
                      }}
                    />

                    <ReferenceLine
                      y={70}
                      stroke="#059669"
                      strokeDasharray="4 4"
                    />

                    <ReferenceLine
                      y={45}
                      stroke="#ba1a1a"
                      strokeDasharray="4 4"
                    />

                    <Area
                      type="monotone"
                      dataKey="forecast"
                      stroke="none"
                      fill="url(#fc)"
                    />

                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="History"
                      stroke="#712ae2"
                      strokeWidth={3}
                      dot={{ r: 3, fill: '#712ae2' }}
                    />

                    <Line
                      type="monotone"
                      dataKey="forecast"
                      name="Forecast"
                      stroke="#0090a9"
                      strokeWidth={2.5}
                      strokeDasharray="6 5"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex items-start gap-2 rounded-lg bg-surface-low p-3 text-sm">
                <Activity size={16} className="mt-0.5 shrink-0 text-secondary" />

                <p className="text-on-surface-variant">
                  {forecast.daysToRisk ? (
                    <>
                      Your recent trend is going down. This is a good time to act early with a small supportive step.
                    </>
                  ) : (
                    <>
                      Your current trend looks stable. Keep checking in regularly to track your wellbeing over time.
                    </>
                  )}
                </p>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-on-surface-variant">
              Complete a couple of check-ins to unlock your wellbeing trend.
            </p>
          )}
        </div>

        {/* AI insights */}
        <div className="card border-l-4 border-secondary lg:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-secondary" />
            <p className="text-sm font-semibold text-secondary">Helpful Insights</p>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {insights.length === 0 && (
              <p className="text-sm text-on-surface-variant">
                Complete a check-in to generate insights.
              </p>
            )}

            {insights.map((ins, i) => (
              <div
                key={i}
                className="rounded-lg p-3 text-sm"
                style={{
                  background:
                    ins.tone === 'concern'
                      ? '#ffdad633'
                      : ins.tone === 'positive'
                        ? '#05966915'
                        : '#4cd7f622',
                }}
              >
                <p
                  className="font-semibold"
                  style={{
                    color:
                      ins.tone === 'concern'
                        ? '#ba1a1a'
                        : ins.tone === 'positive'
                          ? '#059669'
                          : '#0090a9',
                  }}
                >
                  {ins.title}
                </p>

                <p className="mt-1 text-on-surface-variant">
                  {ins.body}
                </p>
              </div>
            ))}
          </div>

          {result && result.band !== 'supported' && (
            <button
              onClick={() => setShowReferral(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-soft py-3 text-sm font-semibold text-secondary"
            >
              <HeartHandshake size={16} />
              Explore support options
            </button>
          )}
        </div>

        {/* Recommended next steps */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <SectionLabel>Recommended Next Steps</SectionLabel>

            <Link to="/app/community" className="text-xs font-semibold text-secondary">
              View all
            </Link>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Protocol
              title="5-minute breathing reset"
              sub="Calms the nervous system"
              tag="5 min"
            />

            <Protocol
              title="Message one person"
              sub="Connection is protective"
              tag="Now"
            />
          </div>
        </div>
      </div>

      <Link to="/app/check-in" className="btn-ai mt-4 w-full !py-4">
        <Sparkles size={18} />
        New check-in
      </Link>

      {showReferral && result && (
        <ReferralModal score={result.score} onClose={() => setShowReferral(false)} />
      )}
    </div>
  )
}

function Protocol({ title, sub, tag }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface-low p-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-on-surface-variant">{sub}</p>
      </div>

      <span className="chip bg-secondary-soft text-secondary">
        {tag}
      </span>
    </div>
  )
}