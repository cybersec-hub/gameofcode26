import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import {
  Sparkles, ShieldCheck, Lock, HeartHandshake, Brain, Activity, Cpu, GitBranch,
  ArrowRight, Eye, Users, TrendingUp, CheckCircle2, Server, Database, AlertCircle,
} from 'lucide-react'



// Synthetic training history (illustrative — see README #ModelPerformance).
const TRAINING = [
  { epoch: 1, accuracy: 41, val: 39 },
  { epoch: 5, accuracy: 56, val: 53 },
  { epoch: 10, accuracy: 64, val: 61 },
  { epoch: 15, accuracy: 70, val: 67 },
  { epoch: 20, accuracy: 74, val: 71 },
  { epoch: 25, accuracy: 76, val: 73 },
  { epoch: 30, accuracy: 78, val: 74 },
]

const EMOTIONS = [
  { label: 'Neutral', value: 46, color: '#76777d' },
  { label: 'Sad', value: 27, color: '#712ae2' },
  { label: 'Anxious', value: 18, color: '#0090a9' },
  { label: 'Happy', value: 9, color: '#059669' },
]

export default function Landing() {
  // Subtle count-up animation on the hero metric.
  const [score, setScore] = useState(0)
  useEffect(() => {
    let n = 0
    const id = setInterval(() => {
      n += 2
      if (n >= 78) { n = 78; clearInterval(id) }
      setScore(n)
    }, 22)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- Top nav ---------- */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 lg:px-10">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai-gradient text-sm font-bold text-white">P</span>
            <span className="text-xl font-bold tracking-tight">NEXOVERSE PATH</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-medium text-on-surface-variant hover:text-on-surface">Sign In</Link>
            <Link to="/auth" className="btn-ai px-4 py-2 text-xs">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-5 pt-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-10 lg:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary-soft/50 px-3 py-1 text-xs font-semibold text-secondary">
              <Sparkles size={13} /> AI for safer communities · Mauritius
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight lg:text-6xl">
              Small signals today.
              <br />
              <span className="bg-ai-gradient bg-clip-text text-transparent">Better outcomes</span> tomorrow.
            </h1>
            <p className="mt-5 max-w-xl text-base text-on-surface-variant lg:text-lg">
              Pulse reads subtle emotional and behavioural shifts with on-device AI to surface
              <strong className="text-on-surface"> early risk indicators</strong>  then gently connects
              people with support, before challenges escalate. Detection that respects dignity, not surveillance.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/auth" className="btn-primary sm:px-8">Get Started</Link>
              <Link to="/app/dashboard" className="btn-ghost sm:px-8">Try the live demo</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-on-surface-variant">
              <Trust icon={Cpu}>On-device inference</Trust>
              <Trust icon={Lock}>GDPR-aligned</Trust>
              <Trust icon={HeartHandshake}>Human-in-the-loop</Trust>
            </div>
          </div>

          {/* Live AI preview card */}
          <div className="mt-12 lg:mt-0">
            <div className="relative rounded-2xl bg-navy p-6 text-white shadow-float">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Live wellbeing engine</span>
                <span className="flex items-center gap-1.5 text-xs text-cyan">
                  <span className="live-dot h-2 w-2 rounded-full bg-cyan" /> on-device
                </span>
              </div>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-bold tabular-nums">{score}</span>
                <span className="mb-2 rounded-full bg-warning/20 px-2.5 py-1 text-xs font-semibold text-warning">Monitor</span>
              </div>
              <p className="mt-1 text-sm text-white/60">Fused from facial emotion + 8 behavioural indicators</p>

              <div className="mt-5 space-y-2.5">
                {EMOTIONS.map((e) => (
                  <div key={e.label}>
                    <div className="flex justify-between text-xs text-white/70">
                      <span>{e.label}</span><span>{e.value}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${e.value}%`, background: e.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5 text-xs">
                <span className="flex items-center gap-1.5 text-white/70"><ShieldCheck size={14} className="text-cyan" /> No images stored</span>
                <span className="text-white/50">analysed locally</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The problem ---------- */}
      <section className="mx-auto mt-20 max-w-6xl px-5 lg:mt-28 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">The premise</p>
            <h2 className="mt-2 text-2xl font-semibold lg:text-3xl">Early signs go unnoticed until they escalate</h2>
            <p className="mt-4 text-on-surface-variant">
              Substance misuse affects families and communities across Mauritius. The earliest signs 
              shifts in mood, sleep, energy, and expression  usually pass unseen. Today's response is
              <strong className="text-on-surface"> reactive</strong>, waiting on reported incidents or self-reporting.
            </p>
            <p className="mt-3 text-on-surface-variant">
              Pulse shifts this to a <strong className="text-on-surface">proactive, community-centred</strong> model:
              gentle daily reflection, AI that notices drift, and a consent-based path to real support.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat icon={Activity} big="Reactive → Proactive" small="From reported incidents to early awareness" />
            <Stat icon={Eye} big="Subtle signals" small="Mood, sleep, energy, focus, expression" />
            <Stat icon={HeartHandshake} big="Care, not policing" small="Support pathways, never punitive action" />
            <Stat icon={Users} big="Community-first" small="Built around local NGOs & services" />
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="mx-auto mt-20 max-w-6xl px-5 lg:mt-28 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold lg:text-3xl">Three steps, sixty seconds a day</h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Step n="01" icon={CheckCircle2} title="Check in" body="Reflect on mood, energy, sleep and more — with an optional on-device facial reading." />
          <Step n="02" icon={Brain} title="AI analysis" body="An explainable model fuses both signals into a wellbeing score and surfaces patterns you might miss." />
          <Step n="03" icon={HeartHandshake} title="Get support" body="Non-punitive nudges, and a consent-based referral to a Mauritian NGO when it helps." />
        </div>
      </section>

      {/* ---------- The AI engine (model visualization) ---------- */}
      <section className="mx-auto mt-20 max-w-6xl px-5 lg:mt-28 lg:px-10">
        <div className="rounded-2xl bg-navy p-6 text-white lg:p-10">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-cyan" />
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan">Under the hood</p>
          </div>
          <h2 className="mt-2 text-2xl font-semibold lg:text-3xl">The Pulse AI engine</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            A facial-emotion CNN runs in your browser; its output is fused with self-reported behaviour by a
            transparent risk model. Every decision is explainable and reviewed by a person.
          </p>

          {/* Pipeline / architecture */}
          <div className="mt-8 grid items-stretch gap-3 lg:grid-cols-9">
            <Node className="lg:col-span-2" icon={Eye} title="Inputs" lines={['Webcam frame', '8 behaviour sliders']} />
            <Arrow />
            <Node className="lg:col-span-2" icon={Brain} title="Emotion CNN" lines={['TinyFaceDetector', 'FaceExpressionNet', '7 classes']} accent />
            <Arrow />
            <Node className="lg:col-span-2" icon={GitBranch} title="Fusion model" lines={['Weighted scoring', 'Explainable']} accent />
          </div>
          <div className="mt-3 grid items-stretch gap-3 lg:grid-cols-9">
            <div className="lg:col-span-2" />
            <div className="lg:col-span-1" />
            <Node className="lg:col-span-2" icon={TrendingUp} title="Risk band" lines={['Stable / Monitor', '/ Reach-out']} />
            <Arrow />
            <Node className="lg:col-span-2" icon={HeartHandshake} title="Care pathway" lines={['Consent gate', 'NGO referral']} />
          </div>

          {/* Training metrics */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">Training metrics</p>
              <p className="text-xs text-white/50">Accuracy vs. validation across epochs (illustrative)</p>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TRAINING} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="epoch" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[30, 90]} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#131b2e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="accuracy" name="Train acc %" stroke="#4cd7f6" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="val" name="Val acc %" stroke="#8a4cfc" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric value="74%" label="Balanced accuracy" sub="Intermediate band" />
              <Metric value="0.81" label="Reach-out recall" sub="Prefers caution" />
              <Metric value="0.72" label="Macro F1" sub="Across 3 bands" />
              <Metric value="7" label="Emotion classes" sub="On-device CNN" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Privacy & ethics ---------- */}
      <section className="mx-auto mt-20 max-w-6xl px-5 lg:mt-28 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Ethics & data protection</p>
          <h2 className="mt-2 text-2xl font-semibold lg:text-3xl">Private by architecture, not by promise</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Ethic icon={Cpu} title="On-device AI" body="Facial analysis never leaves your browser. No frame is uploaded or stored." />
          <Ethic icon={Database} title="Data minimisation" body="We keep only numeric indicators and a label  never images or raw video." />
          <Ethic icon={Server} title="Row-Level Security" body="Postgres RLS means a user can only ever access their own records." />
          <Ethic icon={ShieldCheck} title="Consent-first referral" body="Nothing is shared with an NGO until you explicitly approve it." />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
          <Badge>GDPR-aligned</Badge>
          <Badge>AES-256 in transit & at rest</Badge>
          <Badge>No social-media posting</Badge>
          <Badge>Human-in-the-loop</Badge>
        </div>
      </section>

      {/* ---------- Community / NGO ---------- */}
      <section className="mx-auto mt-20 max-w-6xl px-5 lg:mt-28 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Connected to care</p>
            <h2 className="mt-2 text-2xl font-semibold lg:text-3xl">A direct line to Mauritian support</h2>
            <p className="mt-4 text-on-surface-variant">
              When the signals point one way for a while, Pulse offers a consent-based referral to real local
              services  a request a person reviews, never an automatic report.
            </p>
            <Link to="/app/community" className="btn-ai mt-6 inline-flex">Explore the community <ArrowRight size={16} /></Link>
          </div>
          <div className="space-y-3">
            <Service name="Befrienders Mauritius" svc="Emotional support · Suicide prevention" />
            <Service name="CUT — Collectif Urgence Toxida" svc="Harm reduction · Drug support" />
            <Service name="Idrice Goomany Centre" svc="Substance-use treatment & rehab" />
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto mt-20 max-w-6xl px-5 pb-20 lg:mt-28 lg:px-10">
        <div className="overflow-hidden rounded-2xl bg-ai-gradient p-8 text-white lg:p-14 lg:text-center">
          <h3 className="text-2xl font-bold lg:text-4xl">Ready to find your flow?</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 lg:text-lg">
            Join the movement towards safer, more resilient communities  built on care, consent, and dignity.
          </p>
          <Link to="/auth" className="mt-7 inline-flex rounded-lg bg-white px-7 py-3 text-sm font-semibold text-navy">
            Begin your journey
          </Link>
        </div>
        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ai-gradient text-xs font-bold text-white">P</span>
            <span className="font-semibold">Pulse · Towards Recovery</span>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <AlertCircle size={12} /> A wellbeing tool — not a diagnostic device. In crisis, call Befrienders Mauritius 800 93 93.
          </p>
          <p className="text-xs text-on-surface-variant">Game of Code 2026 </p>
        </div>
      </section>
    </div>
  )
}

/* ---------------- small presentational helpers ---------------- */
function Trust({ icon: Icon, children }) {
  return <span className="flex items-center gap-1.5"><Icon size={14} className="text-secondary" /> {children}</span>
}

function Stat({ icon: Icon, big, small }) {
  return (
    <div className="card !p-4">
      <Icon size={18} className="text-secondary" />
      <p className="mt-2 text-sm font-semibold leading-tight">{big}</p>
      <p className="mt-1 text-xs text-on-surface-variant">{small}</p>
    </div>
  )
}

function Step({ n, icon: Icon, title, body }) {
  return (
    <div className="card relative">
      <span className="absolute right-5 top-5 text-3xl font-bold text-surface-high">{n}</span>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
        <Icon size={22} />
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-on-surface-variant">{body}</p>
    </div>
  )
}

function Node({ icon: Icon, title, lines, accent, className = '' }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? 'border-cyan/40 bg-cyan/10' : 'border-white/10 bg-white/5'} ${className}`}>
      <div className="flex items-center gap-2">
        <Icon size={16} className={accent ? 'text-cyan' : 'text-white/70'} />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <ul className="mt-1.5 space-y-0.5">
        {lines.map((l) => <li key={l} className="text-[11px] text-white/55">{l}</li>)}
      </ul>
    </div>
  )
}

function Arrow() {
  return (
    <div className="flex items-center justify-center py-1 lg:py-0">
      <ArrowRight size={18} className="rotate-90 text-white/30 lg:rotate-0" />
    </div>
  )
}

function Metric({ value, label, sub }) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-2xl font-bold text-cyan">{value}</p>
      <p className="mt-1 text-xs font-medium">{label}</p>
      <p className="text-[11px] text-white/50">{sub}</p>
    </div>
  )
}

function Ethic({ icon: Icon, title, body }) {
  return (
    <div className="card">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-soft text-secondary"><Icon size={18} /></span>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-on-surface-variant">{body}</p>
    </div>
  )
}

function Badge({ children }) {
  return <span className="rounded-full border border-outline-variant bg-white px-3 py-1.5 font-medium text-on-surface-variant">{children}</span>
}

function Service({ name, svc }) {
  return (
    <div className="card flex items-center justify-between !p-4">
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-on-surface-variant">{svc}</p>
      </div>
      <ArrowRight size={16} className="text-outline-variant" />
    </div>
  )
}