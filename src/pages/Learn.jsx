import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Wind,
  Flame,
  CheckCircle2,
  Upload,
  Camera,
  Dumbbell,
  Timer,
  Sparkles,
  Heart,
  Brain,
  Waves,
  Moon,
  Activity,
  Headphones,
  Zap,
} from 'lucide-react'

const T = {
  ink: '#111827',
  inkSoft: '#374151',
  faint: '#6B7280',

  base: '#F7F8FC',
  base2: '#F1F3F8',
  card: '#FFFFFF',
  line: '#E5E7EB',

  pine: '#6D28D9',
  pineDeep: '#4C1D95',

  sage: '#38BDF8',
  sageSoft: '#E9D5FF',

  mist: '#F3E8FF',
  amber: '#7C3AED',
  coral: '#EF4444',

  cyan: '#38BDF8',
  purple: '#6D28D9',
  purpleSoft: '#EDE9FE',
}

const gradient = `linear-gradient(90deg, ${T.cyan}, ${T.purple})`

const SESSIONS = [
  {
    id: 'b5',
    title: 'Box Breathing Reset',
    short: 'Focus',
    desc: 'A structured breathing pattern to calm your nervous system and regain control.',
    seconds: 300,
    level: 'Beginner',
    mood: 'Grounding',
    color: '#6D28D9',
    soft: '#F3E8FF',
    icon: Brain,
    prompt: 'Let your attention return to the rhythm. Nothing else needs to be solved right now.',
    cycle: [
      { phase: 'in', label: 'Breathe in', dur: 4 },
      { phase: 'hold', label: 'Hold gently', dur: 4 },
      { phase: 'out', label: 'Breathe out', dur: 4 },
      { phase: 'rest', label: 'Rest', dur: 4 },
    ],
  },
  {
    id: 'r10',
    title: 'Deep Calm Session',
    short: 'Calm',
    desc: 'A slower breathing session for stress, tension, and emotional overload.',
    seconds: 600,
    level: 'Intermediate',
    mood: 'Relaxation',
    color: '#38BDF8',
    soft: '#E0F2FE',
    icon: Waves,
    prompt: 'Relax your jaw, soften your shoulders, and allow the breath to slow down.',
    cycle: [
      { phase: 'in', label: 'Slow inhale', dur: 4 },
      { phase: 'out', label: 'Long exhale', dur: 6 },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep Wind-Down',
    short: 'Sleep',
    desc: 'A gentle breathing flow designed to prepare your body for rest.',
    seconds: 420,
    level: 'Easy',
    mood: 'Wind-down',
    color: '#4C1D95',
    soft: '#EDE9FE',
    icon: Moon,
    prompt: 'Let the day end here. You can continue tomorrow with a clearer mind.',
    cycle: [
      { phase: 'in', label: 'Breathe in softly', dur: 5 },
      { phase: 'hold', label: 'Pause', dur: 2 },
      { phase: 'out', label: 'Release slowly', dur: 6 },
    ],
  },
]

const WORKOUTS = [
  {
    id: 'warmup',
    title: 'Warm-up march',
    duration: '2 min',
    reps: 'Light pace',
    desc: 'March in place and loosen your shoulders.',
  },
  {
    id: 'squat',
    title: 'Bodyweight squats',
    duration: '3 sets',
    reps: '10 reps',
    desc: 'Keep your chest up and sit back slowly.',
  },
  {
    id: 'pushup',
    title: 'Incline push-ups',
    duration: '3 sets',
    reps: '8 reps',
    desc: 'Use a desk, wall, or bench if needed.',
  },
  {
    id: 'plank',
    title: 'Plank hold',
    duration: '3 rounds',
    reps: '20 sec',
    desc: 'Keep your body straight and breathe slowly.',
  },
  {
    id: 'walk',
    title: 'Recovery walk',
    duration: '5 min',
    reps: 'Easy pace',
    desc: 'Walk slowly to cool down and reset your breathing.',
  },
]

const STORAGE_KEY = 'nexoverse_streak_days'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readStreakDays() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveStreakDays(days) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days))
}

function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={`rounded-3xl ${className}`}
      style={{
        background: T.card,
        border: `1px solid ${T.line}`,
        boxShadow: '0 14px 40px rgba(17,24,39,.06)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Orb({ phase = 'idle', running = false, color = T.purple }) {
  const scale =
    phase === 'in'
      ? 'scale(1.18)'
      : phase === 'out' || phase === 'rest'
        ? 'scale(.76)'
        : 'scale(1)'

  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      <div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          background: `radial-gradient(circle, ${color}20, transparent 68%)`,
          animation: running ? 'nx-orb-glow 3.5s ease-in-out infinite' : 'none',
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: 188,
          height: 188,
          border: `1px solid ${color}55`,
          animation: running ? 'nx-ring 3s ease-out infinite' : 'none',
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: 150,
          height: 150,
          border: `1px dashed ${color}66`,
          animation: running ? 'nx-spin 14s linear infinite' : 'none',
        }}
      />

      <div
        className="relative rounded-full transition-all duration-1000 ease-in-out"
        style={{
          width: 132,
          height: 132,
          transform: scale,
          background: `radial-gradient(circle at 32% 28%, ${T.cyan}, ${color} 72%, ${T.pineDeep})`,
          boxShadow: `0 22px 65px ${color}55, inset 0 2px 14px #ffffff66`,
          animation: running ? 'nx-float 4s ease-in-out infinite' : 'none',
        }}
      >
        <div className="absolute inset-5 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

function MiniCalendar({ completedDays }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDate = today.getDate()

  const monthName = today.toLocaleString('default', { month: 'long' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const completedSet = new Set(completedDays)
  const cells = []

  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: T.ink }}>
          Activity Calendar
        </h3>

        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: T.purpleSoft, color: T.purple }}
        >
          {monthName} {year}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="py-1 text-center text-[11px] font-bold"
            style={{ color: T.faint }}
          >
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isToday = day === todayDate
          const completed = completedSet.has(dateKey)

          return (
            <div
              key={dateKey}
              className="flex aspect-square items-center justify-center rounded-xl text-xs font-semibold transition"
              style={{
                background: completed ? gradient : isToday ? T.purpleSoft : 'transparent',
                color: completed ? '#fff' : isToday ? T.purple : T.inkSoft,
                border: isToday && !completed ? `1px solid ${T.sageSoft}` : '1px solid transparent',
              }}
            >
              {completed ? '✓' : day}
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-xs" style={{ color: T.faint }}>
        Completed days are marked with ✓.
      </p>
    </Card>
  )
}

function MeditationTimer({ session, onComplete }) {
  const [running, setRunning] = useState(false)
  const [left, setLeft] = useState(session.seconds)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [completedRounds, setCompletedRounds] = useState(0)
  const phaseTimer = useRef(null)

  const phase = session.cycle[phaseIndex % session.cycle.length]
  const progress = Math.round(((session.seconds - left) / session.seconds) * 100)
  const Icon = session.icon

  useEffect(() => {
    setRunning(false)
    setLeft(session.seconds)
    setPhaseIndex(0)
    setCompletedRounds(0)
  }, [session])

  useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(interval)
          setRunning(false)
          onComplete()
          return 0
        }

        return v - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [running, onComplete])

  useEffect(() => {
    if (!running) return

    phaseTimer.current = setTimeout(() => {
      setPhaseIndex((i) => {
        const next = i + 1

        if (next % session.cycle.length === 0) {
          setCompletedRounds((rounds) => rounds + 1)
        }

        return next
      })
    }, phase.dur * 1000)

    return () => clearTimeout(phaseTimer.current)
  }, [running, phaseIndex, phase.dur, session.cycle.length])

  const reset = () => {
    setRunning(false)
    setLeft(session.seconds)
    setPhaseIndex(0)
    setCompletedRounds(0)
  }

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  return (
    <Card className="overflow-hidden">
      <div
        className="relative p-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${T.cyan}, ${session.color})`,
        }}
      >
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              <Icon size={14} />
              {session.level} · {session.mood}
            </div>

            <h2 className="text-2xl font-bold">
              {session.title}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">
              {session.desc}
            </p>
          </div>

          <div className="rounded-3xl bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wide text-white/75">
              Remaining
            </p>

            <p className="text-3xl font-bold">
              {mm}:{ss}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col items-center justify-center rounded-[2rem] bg-[#F9FAFB] p-6">
          <Orb phase={phase.phase} running={running} color={session.color} />

          <div className="mt-4 text-center">
            <p className="text-3xl font-bold" style={{ color: session.color }}>
              {running ? phase.label : left === 0 ? 'Completed' : 'Ready'}
            </p>

            <p className="mt-2 max-w-md text-sm leading-relaxed" style={{ color: T.inkSoft }}>
              {session.prompt}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setRunning((v) => !v)}
              className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
              style={{
                background: `linear-gradient(90deg, ${T.cyan}, ${session.color})`,
              }}
            >
              {running ? <Pause size={17} /> : <Play size={17} />}
              {running ? 'Pause session' : left === 0 ? 'Restart session' : 'Start session'}
            </button>

            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition hover:scale-[1.02]"
              style={{
                borderColor: session.color,
                color: session.color,
                background: session.soft,
              }}
            >
              <RotateCcw size={17} />
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: T.ink }}>
                Session progress
              </span>

              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: session.soft,
                  color: session.color,
                }}
              >
                {progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#F1F3F8]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${T.cyan}, ${session.color})`,
                }}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Activity size={18} style={{ color: session.color }} />

              <h3 className="text-sm font-bold" style={{ color: T.ink }}>
                Breathing pattern
              </h3>
            </div>

            <div className="space-y-2">
              {session.cycle.map((step, index) => {
                const active = index === phaseIndex % session.cycle.length

                return (
                  <div
                    key={`${step.label}-${index}`}
                    className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition"
                    style={{
                      background: active ? session.soft : '#F9FAFB',
                      color: active ? session.color : T.inkSoft,
                    }}
                  >
                    <span className="font-semibold">{step.label}</span>
                    <span className="text-xs font-bold">{step.dur}s</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] bg-[#F9FAFB] p-4">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: T.faint }}>
                Rounds
              </p>
              <p className="mt-1 text-2xl font-bold" style={{ color: session.color }}>
                {completedRounds}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-[#F9FAFB] p-4">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: T.faint }}>
                Status
              </p>
              <p className="mt-1 text-sm font-bold" style={{ color: running ? session.color : T.ink }}>
                {running ? 'In progress' : left === 0 ? 'Done' : 'Not started'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function Learn() {
  const [activeTab, setActiveTab] = useState('Meditation')
  const [activeSession, setActiveSession] = useState(SESSIONS[0])
  const [completedWorkout, setCompletedWorkout] = useState([])
  const [proofImage, setProofImage] = useState(null)
  const [meditationDone, setMeditationDone] = useState(false)
  const [completedDays, setCompletedDays] = useState(() => readStreakDays())

  const workoutProgress = Math.round((completedWorkout.length / WORKOUTS.length) * 100)
  const todayCompleted = completedDays.includes(todayKey())

  const canCompleteStreak = Boolean(proofImage) && !todayCompleted

  const currentStreak = useMemo(() => {
    const completed = new Set(completedDays)
    let streak = 0
    const cursor = new Date()

    while (completed.has(cursor.toISOString().slice(0, 10))) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }

    return streak
  }, [completedDays])

  const toggleWorkout = (id) => {
    setCompletedWorkout((items) =>
      items.includes(id) ? items.filter((x) => x !== id) : [...items, id]
    )
  }

  const handleProofUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (proofImage) {
      URL.revokeObjectURL(proofImage)
    }

    const url = URL.createObjectURL(file)
    setProofImage(url)
  }

  const markTodayComplete = () => {
    const key = todayKey()

    if (!canCompleteStreak) return

    const next = [...new Set([...completedDays, key])]
    setCompletedDays(next)
    saveStreakDays(next)
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: T.base }}>
      <style>{`
        @keyframes nx-ring {
          0% { transform: scale(.8); opacity: .5; }
          70% { opacity: 0; }
          100% { transform: scale(1.45); opacity: 0; }
        }

        @keyframes nx-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes nx-pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        @keyframes nx-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes nx-orb-glow {
          0%, 100% { transform: scale(.92); opacity: .6; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        .nx-active-card {
          animation: nx-pulse-soft 2.4s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <div className="mb-5">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: gradient }}
          >
            <Sparkles size={14} />
            Meditation & wellness
          </div>

          <h1 className="text-3xl font-bold leading-tight md:text-4xl" style={{ color: T.ink }}>
            Build your daily recovery streak
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: T.inkSoft }}>
            Upload your daily proof picture to count your streak. Meditation and workout are optional healthy activities.
          </p>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {['Meditation', 'Streak', 'Workout'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="rounded-full px-5 py-2 text-sm font-bold transition"
              style={{
                background: activeTab === tab ? gradient : T.card,
                color: activeTab === tab ? '#fff' : T.inkSoft,
                boxShadow: activeTab === tab ? `0 8px 20px rgba(109,40,217,.25)` : '0 1px 3px rgba(0,0,0,.06)',
                border: `1px solid ${activeTab === tab ? 'transparent' : T.line}`,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {activeTab === 'Meditation' && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  {SESSIONS.map((session) => {
                    const Icon = session.icon
                    const active = activeSession.id === session.id

                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => setActiveSession(session)}
                        className="rounded-[2rem] border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
                        style={{
                          background: active ? session.soft : T.card,
                          borderColor: active ? session.color : T.line,
                          boxShadow: active ? `0 18px 40px ${session.color}22` : '0 8px 24px rgba(17,24,39,.04)',
                        }}
                      >
                        <div
                          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                          style={{
                            background: `linear-gradient(135deg, ${T.cyan}, ${session.color})`,
                          }}
                        >
                          <Icon size={22} />
                        </div>

                        <div className="mb-2 flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold" style={{ color: T.ink }}>
                            {session.short}
                          </h3>

                          <span
                            className="rounded-full px-2 py-1 text-[11px] font-bold"
                            style={{
                              background: active ? '#fff' : session.soft,
                              color: session.color,
                            }}
                          >
                            {Math.round(session.seconds / 60)} min
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed" style={{ color: T.inkSoft }}>
                          {session.title}
                        </p>
                      </button>
                    )
                  })}
                </div>

                <MeditationTimer
                  session={activeSession}
                  onComplete={() => setMeditationDone(true)}
                />

                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl p-3 text-white" style={{ background: gradient }}>
                      <Headphones size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold" style={{ color: T.ink }}>
                        Guided reflection after meditation
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed" style={{ color: T.inkSoft }}>
                        After finishing a session, take 30 seconds to notice your breathing, body tension, and emotional state. This helps you connect the meditation habit with real self-awareness.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-5">
                    <Zap size={22} style={{ color: T.purple }} />

                    <h3 className="mt-3 text-sm font-bold" style={{ color: T.ink }}>
                      Quick reset
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed" style={{ color: T.inkSoft }}>
                      Use this before studying, working, or when your mind feels overloaded.
                    </p>
                  </Card>

                  <Card className="p-5">
                    <Brain size={22} style={{ color: T.purple }} />

                    <h3 className="mt-3 text-sm font-bold" style={{ color: T.ink }}>
                      Mind clarity
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed" style={{ color: T.inkSoft }}>
                      Breathing gives your nervous system a simple rhythm to follow.
                    </p>
                  </Card>

                  <Card className="p-5">
                    <Moon size={22} style={{ color: T.purple }} />

                    <h3 className="mt-3 text-sm font-bold" style={{ color: T.ink }}>
                      Better rest
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed" style={{ color: T.inkSoft }}>
                      A slower exhale can help your body move toward a calmer state.
                    </p>
                  </Card>
                </div>
              </>
            )}

            {activeTab === 'Streak' && (
              <>
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-3xl p-4 text-white" style={{ background: gradient }}>
                      <Flame size={34} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: T.ink }}>
                        {currentStreak} day streak
                      </h2>

                      <p className="mt-1 text-sm" style={{ color: T.inkSoft }}>
                        Upload a daily proof picture to count today.
                      </p>

                      {todayCompleted && (
                        <div
                          className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white"
                          style={{ background: gradient }}
                        >
                          <CheckCircle2 size={13} />
                          Today completed
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: T.purple }}>
                    Daily proof upload
                  </h3>

                  <label
                    className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition hover:scale-[1.01]"
                    style={{
                      borderColor: T.sageSoft,
                      background: T.base2,
                    }}
                  >
                    {proofImage ? (
                      <img
                        src={proofImage}
                        alt="Daily proof"
                        className="max-h-64 w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <>
                        <Camera size={34} style={{ color: T.purple }} />

                        <p className="mt-3 text-sm font-bold" style={{ color: T.ink }}>
                          Upload today’s picture
                        </p>

                        <p className="mt-1 text-xs" style={{ color: T.faint }}>
                          This acts as your daily accountability proof.
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={markTodayComplete}
                    disabled={!canCompleteStreak}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ background: gradient }}
                  >
                    <Upload size={17} />
                    {todayCompleted ? 'Streak already counted today' : 'Count today’s streak'}
                  </button>

                  {!proofImage && !todayCompleted && (
                    <p className="mt-2 text-center text-xs" style={{ color: T.faint }}>
                      Upload a picture to unlock today’s streak.
                    </p>
                  )}

                  {proofImage && !todayCompleted && (
                    <p className="mt-2 text-center text-xs" style={{ color: T.purple }}>
                      Picture uploaded. You can now count today’s streak.
                    </p>
                  )}
                </Card>
              </>
            )}

            {activeTab === 'Workout' && (
              <>
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-3xl p-4 text-white" style={{ background: gradient }}>
                      <Dumbbell size={34} />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold" style={{ color: T.ink }}>
                        Daily recovery workout
                      </h2>

                      <p className="mt-1 text-sm" style={{ color: T.inkSoft }}>
                        A simple full-body routine that is realistic, beginner-friendly, and useful for building consistency.
                      </p>

                      <div className="mt-4 h-3 overflow-hidden rounded-full" style={{ background: T.base2 }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${workoutProgress}%`,
                            background: gradient,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs font-bold" style={{ color: T.purple }}>
                        {workoutProgress}% completed
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-3">
                  {WORKOUTS.map((item, index) => {
                    const done = completedWorkout.includes(item.id)

                    return (
                      <Card
                        key={item.id}
                        className="p-4 transition hover:-translate-y-1 hover:shadow-md"
                        style={{
                          borderColor: done ? T.purple : T.line,
                          background: done ? T.purpleSoft : T.card,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleWorkout(item.id)}
                          className="flex w-full items-center gap-4 text-left"
                        >
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold"
                            style={{
                              background: done ? gradient : T.purpleSoft,
                              color: done ? '#fff' : T.purple,
                            }}
                          >
                            {done ? <CheckCircle2 size={18} /> : index + 1}
                          </div>

                          <div className="flex-1">
                            <h3 className="text-sm font-bold" style={{ color: T.ink }}>
                              {item.title}
                            </h3>

                            <p className="mt-1 text-xs" style={{ color: T.inkSoft }}>
                              {item.desc}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold"
                                style={{ background: T.purpleSoft, color: T.purple }}
                              >
                                <Timer size={11} />
                                {item.duration}
                              </span>

                              <span
                                className="rounded-full px-2 py-1 text-[11px] font-bold"
                                style={{ background: T.base2, color: T.inkSoft }}
                              >
                                {item.reps}
                              </span>
                            </div>
                          </div>
                        </button>
                      </Card>
                    )
                  })}
                </div>

                {workoutProgress === 100 && (
                  <Card className="p-5 text-center" style={{ background: T.purpleSoft }}>
                    <CheckCircle2 className="mx-auto" size={32} style={{ color: T.purple }} />

                    <h3 className="mt-2 text-lg font-bold" style={{ color: T.ink }}>
                      Workout completed
                    </h3>

                    <p className="mt-1 text-sm" style={{ color: T.inkSoft }}>
                      Great work. Upload a proof picture in the Streak tab to count today.
                    </p>
                  </Card>
                )}
              </>
            )}
          </div>

          <div className="space-y-4">
            <MiniCalendar completedDays={completedDays} />

            <Card className="p-5" style={{ background: T.purpleSoft, border: 'none' }}>
              <div className="flex items-center gap-2">
                <Flame size={20} style={{ color: T.purple }} />

                <h3 className="text-sm font-bold" style={{ color: T.ink }}>
                  Current streak
                </h3>
              </div>

              <p className="mt-3 text-4xl font-bold" style={{ color: T.purple }}>
                {currentStreak}
              </p>

              <p className="text-xs" style={{ color: T.inkSoft }}>
                day{currentStreak === 1 ? '' : 's'} in a row
              </p>
            </Card>

            <Card className="p-5" style={{ background: T.pineDeep, border: 'none' }}>
              <h3 className="text-sm font-bold text-white">
                Today’s checklist
              </h3>

              <div className="mt-3 space-y-2">
                <ChecklistItem done={Boolean(proofImage)} label="Upload proof picture" />
                <ChecklistItem done={meditationDone} label="Complete meditation optional" />
                <ChecklistItem done={workoutProgress === 100} label="Finish workout optional" />
                <ChecklistItem done={todayCompleted} label="Count today’s streak" />
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Heart size={18} style={{ color: T.coral }} />

                <h3 className="text-sm font-bold" style={{ color: T.ink }}>
                  Why this works
                </h3>
              </div>

              <p className="mt-2 text-sm leading-relaxed" style={{ color: T.inkSoft }}>
                Small daily actions build consistency. Meditation calms the nervous system, movement improves energy, and photo proof creates accountability.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({ done, label }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/10 p-2">
      <CheckCircle2 size={14} color={done ? '#C4B5FD' : 'rgba(255,255,255,.35)'} />

      <span className="text-xs font-semibold text-white/85">
        {label}
      </span>
    </div>
  )
}