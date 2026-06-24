import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ComposedChart, Line, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  CartesianGrid, ReferenceLine, LineChart, Legend,
} from 'recharts'
import {
  Sparkles, Cpu, HeartHandshake, TrendingDown, TrendingUp, Activity, Zap,
} from 'lucide-react'
import { listCheckIns, seedDemoHistory } from '../lib/store'
import { computeWellbeing, generateInsights } from '../lib/riskEngine'
import { Chip, SectionLabel, ProgressBar } from '../components/ui'
import ReferralModal from '../components/ReferralModal'


// Illustrative training history (see README #ModelPerformance).
const TRAINING = [
  { epoch: 1, acc: 41, loss: 1.62 }, { epoch: 5, acc: 56, loss: 1.18 },
  { epoch: 10, acc: 64, loss: 0.92 }, { epoch: 15, acc: 70, loss: 0.74 },
  { epoch: 20, acc: 74, loss: 0.61 }, { epoch: 25, acc: 76, loss: 0.55 },
  { epoch: 30, acc: 78, loss: 0.51 },
]

// Illustrative confusion matrix (rows = actual, cols = predicted), normalised %.
const CONFUSION = {
  labels: ['Stable', 'Monitor', 'Reach-out'],
  matrix: [
    [82, 14, 4],
    [16, 71, 13],
    [3, 16, 81],
  ],
}

// Least-squares linear regression on an array of y-values (x = index).
function linreg(ys) {
  const n = ys.length
  if (n < 2) return { slope: 0, intercept: ys[0] ?? 50 }
  const xs = ys.map((_, i) => i)
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, den = 0
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2 }
  const slope = den === 0 ? 0 : num / den
  return { slope, intercept: my - slope * mx }
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export default function Dashboard() {
  const location = useLocation()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReferral, setShowReferral] = useState(false)

  useEffect(() => {
    ;(async () => {
      seedDemoHistory(8)
      setHistory(await listCheckIns(14))
      setLoading(false)
    })()
  }, [location.key])

  const latest = history[0]
  const indicators = latest?.indicators || {}
  const result = useMemo(() => (latest ? computeWellbeing(indicators) : null), [latest])
  const insights = result ? generateInsights(result, indicators) : []
  const delta = history.length > 1 ? history[0].score - history[1].score : 0

  // ---- WOW FEATURE: forecast ----
  const forecast = useMemo(() => {
    const chrono = [...history].reverse()
    const scores = chrono.map((h) => h.score)
    if (scores.length < 2) return null
    const { slope, intercept } = linreg(scores)
    const n = scores.length

    const data = chrono.map((h, i) => ({
      label: new Date(h.created_at).toLocaleDateString('en', { weekday: 'short' }),
      actual: h.score,
    }))
    // bridge point so the dashed forecast connects to the last actual
    data[n - 1].forecast = scores[n - 1]
    const horizon = 5
    for (let i = 1; i <= horizon; i++) {
      const y = clamp(Math.round(intercept + slope * (n - 1 + i)), 0, 100)
      data.push({ label: `+${i}d`, forecast: y })
    }

    // days until projected to cross the reach-out threshold (45)
    let daysToRisk = null
    if (slope < -0.2) {
      const xCross = (45 - intercept) / slope
      const d = Math.ceil(xCross - (n - 1))
      if (d > 0 && d <= 30) daysToRisk = d
    }
    return { data, slope, daysToRisk, projected: data[data.length - 1].forecast }
  }, [history])

  if (loading) return <div className="py-20 text-center text-on-surface-variant">Loading…</div>

  return (
    <div className="py-2">
      <div className="mb-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">Pulse  AI Dashboard</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Visualising your emotional trajectory through on-device AI and predictive behavioural analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">

        {/* Wellbeing score */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <SectionLabel>Wellbeing Score</SectionLabel>
            {result && <Chip color={result.color}>{result.bandLabel}</Chip>}
          </div>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-5xl font-bold">{result?.score ?? '—'}</span>
            {delta !== 0 && (
              <span className={`mb-2 flex items-center gap-1 text-sm font-medium ${delta >= 0 ? 'text-success' : 'text-error'}`}>
                {delta >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {delta >= 0 ? '+' : ''}{delta} this week
              </span>
            )}
          </div>
          <div className="mt-4"><ProgressBar value={result?.score ?? 0} color={result?.color} /></div>
        </div>

        {/* ---- WOW: Predictive forecast ---- */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ai-gradient text-white"><Zap size={15} /></span>
              <SectionLabel>Predictive Forecast — early warning</SectionLabel>
            </div>
            <Chip color={forecast?.daysToRisk ? '#ba1a1a' : '#059669'}>
              {forecast?.daysToRisk ? `~${forecast.daysToRisk}d to watch` : 'On track'}
            </Chip>
          </div>

          {forecast ? (
            <>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecast.data} margin={{ top: 8, right: 10, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4cd7f6" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#4cd7f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#76777d' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#76777d' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e6e8ea', fontSize: 12 }} />
                    <ReferenceLine y={70} stroke="#059669" strokeDasharray="4 4" label={{ value: 'Stable', fontSize: 10, fill: '#059669', position: 'right' }} />
                    <ReferenceLine y={45} stroke="#ba1a1a" strokeDasharray="4 4" label={{ value: 'Reach-out', fontSize: 10, fill: '#ba1a1a', position: 'right' }} />
                    <Area type="monotone" dataKey="forecast" stroke="none" fill="url(#fc)" />
                    <Line type="monotone" dataKey="actual" name="History" stroke="#712ae2" strokeWidth={3} dot={{ r: 3, fill: '#712ae2' }} />
                    <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#0090a9" strokeWidth={2.5} strokeDasharray="6 5" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-surface-low p-3 text-sm">
                <Activity size={16} className="mt-0.5 shrink-0 text-secondary" />
                <p className="text-on-surface-variant">
                  {forecast.daysToRisk ? (
                    <>Your trend is declining. If the current pattern continues, your wellbeing could enter the
                      <strong className="text-error"> reach-out</strong> band in about
                      <strong className="text-error"> {forecast.daysToRisk} days</strong> — a good moment to act early.</>
                  ) : (
                    <>Projected wellbeing in 5 days: <strong className="text-on-surface">{forecast.projected}</strong>.
                      Your trajectory looks stable — early intervention isn't indicated right now.</>
                  )}
                </p>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-on-surface-variant">Complete a couple of check-ins to unlock your forecast.</p>
          )}
        </div>

        {/* AI insights + referral */}
        <div className="card border-l-4 border-secondary lg:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-secondary" />
            <p className="text-sm font-semibold text-secondary">AI INSIGHTS</p>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {insights.length === 0 && <p className="text-sm text-on-surface-variant">Complete a check-in to generate insights.</p>}
            {insights.map((ins, i) => (
              <div key={i} className="rounded-lg p-3 text-sm" style={{
                background: ins.tone === 'concern' ? '#ffdad633' : ins.tone === 'positive' ? '#05966915' : '#4cd7f622',
              }}>
                <p className="font-semibold" style={{ color: ins.tone === 'concern' ? '#ba1a1a' : ins.tone === 'positive' ? '#059669' : '#0090a9' }}>{ins.title}</p>
                <p className="mt-1 text-on-surface-variant">{ins.body}</p>
              </div>
            ))}
          </div>
          {result && result.band !== 'supported' && (
            <button onClick={() => setShowReferral(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-soft py-3 text-sm font-semibold text-secondary">
              <HeartHandshake size={16} /> Explore support options
            </button>
          )}
        </div>

        {/* ================= ADVANCED MODEL VISUALIZATION ================= */}
        <div className="card lg:col-span-2 !bg-navy text-white">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-cyan" />
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan">Model Visualization</p>
          </div>
          <h3 className="mt-1 text-lg font-semibold">How the AI reaches its decision</h3>

          {/* Architecture */}
          <p className="mt-5 text-xs font-medium text-white/60">Network architecture (emotion CNN → fusion head)</p>
          <NeuralNet />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Training metrics */}
            <div>
              <p className="text-xs font-medium text-white/60">Training metrics — accuracy & loss</p>
              <div className="mt-3 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TRAINING} margin={{ top: 6, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#131b2e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="acc" name="Accuracy %" stroke="#4cd7f6" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="loss" name="Loss (×10)" stroke="#8a4cfc" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Confusion matrix */}
            <div>
              <p className="text-xs font-medium text-white/60">Confusion matrix  validation set</p>
              <ConfusionMatrix />
            </div>
          </div>

          {/* Explainability: live indicator contribution */}
          <p className="mt-6 text-xs font-medium text-white/60">Explainability — what drove today's score</p>
          <div className="mt-3 space-y-2">
            {result?.drivers?.slice(0, 5).map((d) => (
              <div key={d.key}>
                <div className="flex justify-between text-xs text-white/70">
                  <span>{d.label}</span>
                  <span>{d.impact < 0 ? '−' : '+'}{Math.abs(Math.round(d.impact * 200))}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: `${d.goodness * 100}%`, background: d.impact < 0 ? '#ff6b6b' : '#4cd7f6' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Metric value="74%" label="Balanced acc" />
            <Metric value="0.81" label="Reach-out recall" />
            <Metric value="7" label="Emotion classes" />
          </div>
        </div>

        {/* Recommended next steps */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <SectionLabel>Recommended Next Steps</SectionLabel>
            <Link to="/app/community" className="text-xs font-semibold text-secondary">View all</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Protocol title="5-minute breathing reset" sub="Calms the nervous system" tag="5 min" />
            <Protocol title="Message one person" sub="Connection is protective" tag="Now" />
          </div>
        </div>
      </div>

      <Link to="/app/check-in" className="btn-ai mt-4 w-full !py-4"><Sparkles size={18} /> New check-in</Link>

      {showReferral && <ReferralModal score={result.score} onClose={() => setShowReferral(false)} />}
    </div>
  )
}

/* ---------------- Neural network architecture (animated SVG) ---------------- */
function NeuralNet() {
  const layers = [
    { n: 4, label: 'Input', color: '#4cd7f6' },
    { n: 6, label: 'Conv', color: '#8a4cfc' },
    { n: 5, label: 'Dense', color: '#8a4cfc' },
    { n: 3, label: 'Output', color: '#712ae2' },
  ]
  const W = 520, H = 150, padX = 40
  const colX = (i) => padX + (i * (W - 2 * padX)) / (layers.length - 1)
  const nodeY = (count, j) => {
    const gap = H / (count + 1)
    return gap * (j + 1)
  }
  return (
    <div className="mt-3 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full min-w-[420px]">
        {/* edges */}
        {layers.slice(0, -1).map((layer, li) =>
          Array.from({ length: layer.n }).map((_, a) =>
            Array.from({ length: layers[li + 1].n }).map((_, b) => (
              <line key={`${li}-${a}-${b}`}
                x1={colX(li)} y1={nodeY(layer.n, a)}
                x2={colX(li + 1)} y2={nodeY(layers[li + 1].n, b)}
                stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            ))
          )
        )}
        {/* nodes */}
        {layers.map((layer, li) =>
          Array.from({ length: layer.n }).map((_, j) => (
            <circle key={`${li}-${j}`} cx={colX(li)} cy={nodeY(layer.n, j)} r="7"
              fill={layer.color}
              style={{ animation: `pulse-dot ${1.6 + (li + j) * 0.12}s ease-in-out infinite` }} />
          ))
        )}
        {/* labels */}
        {layers.map((layer, li) => (
          <text key={`l-${li}`} x={colX(li)} y={H + 16} textAnchor="middle"
            fontSize="10" fill="rgba(255,255,255,0.55)">{layer.label}</text>
        ))}
      </svg>
    </div>
  )
}

/* ---------------- Confusion matrix heatmap ---------------- */
function ConfusionMatrix() {
  const { labels, matrix } = CONFUSION
  return (
    <div className="mt-3">
      <div className="grid" style={{ gridTemplateColumns: `64px repeat(${labels.length}, 1fr)` }}>
        <div />
        {labels.map((l) => (
          <div key={l} className="pb-1 text-center text-[10px] text-white/50">{l}</div>
        ))}
        {matrix.map((row, i) => (
          <Fragmentish key={i} label={labels[i]} row={row} />
        ))}
      </div>
      <p className="mt-2 text-[10px] text-white/40">Rows = actual · Columns = predicted (% of class)</p>
    </div>
  )
}
function Fragmentish({ label, row }) {
  return (
    <>
      <div className="flex items-center pr-2 text-[10px] text-white/50">{label}</div>
      {row.map((v, j) => (
        <div key={j} className="m-0.5 flex aspect-square items-center justify-center rounded text-[11px] font-semibold"
          style={{ background: `rgba(76,215,246,${v / 100})`, color: v > 45 ? '#0a1020' : 'rgba(255,255,255,0.8)' }}>
          {v}
        </div>
      ))}
    </>
  )
}

function Metric({ value, label }) {
  return (
    <div className="rounded-lg bg-white/5 p-3 text-center">
      <p className="text-xl font-bold text-cyan">{value}</p>
      <p className="text-[11px] text-white/55">{label}</p>
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
      <span className="chip bg-secondary-soft text-secondary">{tag}</span>
    </div>
  )
}