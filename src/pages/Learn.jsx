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
} from 'lucide-react'

const T = {
  ink: '#1B2A2A',
  inkSoft: '#516461',
  faint: '#7B8C88',
  base: '#F2F5F1',
  base2: '#E7EEE9',
  card: '#FFFFFF',
  line: '#DBE6DF',
  pine: '#2E6F5E',
  pineDeep: '#21503F',
  sage: '#6BA48E',
  sageSoft: '#A9CABA',
  mist: '#DCEAE2',
  amber: '#DDA152',
  coral: '#D58A77',
}

const SESSIONS = [
  {
    id: 'b5',
    title: '5-minute breathing',
    desc: 'Box breathing to settle your nervous system.',
    seconds: 300,
    cycle: [
      { phase: 'in', label: 'Breathe in', dur: 4 },
      { phase: 'hold', label: 'Hold', dur: 4 },
      { phase: 'out', label: 'Breathe out', dur: 4 },
      { phase: 'rest', label: 'Rest', dur: 4 },
    ],
  },
  {
    id: 'r10',
    title: '10-minute relaxation',
    desc: 'Slow breathing to release tension.',
    seconds: 600,
    cycle: [
      { phase: 'in', label: 'Breathe in', dur: 4 },
      { phase: 'out', label: 'Breathe out', dur: 6 },
    ],
  },
  {
    id: 'sleep',
    title: 'Guided wind-down',
    desc: 'A calm rhythm to ease your body into rest.',
    seconds: 420,
    cycle: [
      { phase: 'in', label: 'Breathe in', dur: 5 },
      { phase: 'hold', label: 'Hold', dur: 2 },
      { phase: 'out', label: 'Breathe out', dur: 6 },
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
        boxShadow: '0 1px 2px rgba(27,42,42,.04)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Orb({ phase = 'idle', running = false }) {
  const scale =
    phase === 'in'
      ? 'scale(1.12)'
      : phase === 'out' || phase === 'rest'
        ? 'scale(.78)'
        : 'scale(1)'

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <div
        className="absolute rounded-full"
        style={{
          width: 176,
          height: 176,
          border: `1px solid ${T.sageSoft}`,
          animation: running ? 'nx-ring 3s ease-out infinite' : 'none',
        }}
      />

      <div
        className="rounded-full transition-all duration-1000 ease-in-out"
        style={{
          width: 132,
          height: 132,
          transform: scale,
          background: `radial-gradient(circle at 32% 28%, ${T.sage}, ${T.pine} 70%, ${T.pineDeep})`,
          boxShadow: `0 18px 50px ${T.sage}66, inset 0 2px 12px #ffffff44`,
          animation: running ? 'nx-float 4s ease-in-out infinite' : 'none',
        }}
      />
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

  for (let i = 0; i < firstDay; i++) {
    cells.push(null)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: T.ink }}>
          Activity Calendar
        </h3>

        <span className="text-xs" style={{ color: T.faint }}>
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
                background: completed ? T.pine : isToday ? T.mist : 'transparent',
                color: completed ? '#fff' : isToday ? T.pine : T.inkSoft,
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
  const phaseTimer = useRef(null)

  const phase = session.cycle[phaseIndex % session.cycle.length]

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
      setPhaseIndex((i) => i + 1)
    }, phase.dur * 1000)

    return () => clearTimeout(phaseTimer.current)
  }, [running, phaseIndex, phase.dur])

  const reset = () => {
    setRunning(false)
    setLeft(session.seconds)
    setPhaseIndex(0)
  }

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  return (
    <Card className="p-6 text-center">
      <div
        className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white"
        style={{ background: T.pine }}
      >
        <Wind size={13} />
        {session.title}
      </div>

      <h3 className="text-xl font-bold" style={{ color: T.ink }}>
        {session.desc}
      </h3>

      <div className="my-6 flex justify-center">
        <Orb phase={phase.phase} running={running} />
      </div>

      <p className="text-2xl font-bold" style={{ color: T.pine }}>
        {running ? phase.label : 'Ready'}
      </p>

      <p className="mt-1 text-sm" style={{ color: T.faint }}>
        {mm}:{ss} remaining
      </p>

      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((v) => !v)}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
          style={{ background: T.pine }}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? 'Pause' : 'Start'}
        </button>

        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold"
          style={{ borderColor: T.sageSoft, color: T.pine }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
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

  // FIXED:
  // The streak button now becomes active after image upload.
  // Meditation and workout are optional.
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

        .nx-active-card {
          animation: nx-pulse-soft 2.4s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <div className="mb-5">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: T.pine }}
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
                background: activeTab === tab ? T.pine : T.card,
                color: activeTab === tab ? '#fff' : T.inkSoft,
                boxShadow: activeTab === tab ? `0 8px 20px ${T.pine}33` : '0 1px 3px rgba(0,0,0,.06)',
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
                <div
                  className="relative overflow-hidden rounded-[2rem] p-6 text-white"
                  style={{
                    background: `linear-gradient(160deg, ${T.sage} 0%, ${T.pine} 60%, ${T.pineDeep} 100%)`,
                  }}
                >
                  <div className="absolute right-5 top-5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                    Recommended
                  </div>

                  <div className="flex min-h-[190px] flex-col items-center justify-center text-center">
                    <button
                      type="button"
                      onClick={() => setActiveSession(SESSIONS[0])}
                      className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/20 transition hover:scale-105"
                    >
                      <Play size={26} />
                    </button>

                    <h2 className="text-2xl font-bold">
                      Center the Mind. Free the Soul.
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-white/80">
                      Start with a short breathing session to calm your body and reset your focus.
                    </p>
                  </div>
                </div>

                <MeditationTimer
                  session={activeSession}
                  onComplete={() => setMeditationDone(true)}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {SESSIONS.map((session) => (
                    <Card
                      key={session.id}
                      className={`cursor-pointer p-4 transition hover:-translate-y-1 hover:shadow-md ${
                        activeSession.id === session.id ? 'nx-active-card' : ''
                      }`}
                      style={{
                        borderColor: activeSession.id === session.id ? T.pine : T.line,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveSession(session)}
                        className="flex w-full items-start gap-3 text-left"
                      >
                        <div className="rounded-2xl p-3" style={{ background: T.mist, color: T.pine }}>
                          <Wind size={20} />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold" style={{ color: T.ink }}>
                            {session.title}
                          </h3>

                          <p className="mt-1 text-xs leading-relaxed" style={{ color: T.inkSoft }}>
                            {session.desc}
                          </p>

                          <p className="mt-2 text-xs font-bold" style={{ color: T.pine }}>
                            {Math.round(session.seconds / 60)} min
                          </p>
                        </div>
                      </button>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'Streak' && (
              <>
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-3xl p-4 text-white" style={{ background: T.amber }}>
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
                          style={{ background: T.pine }}
                        >
                          <CheckCircle2 size={13} />
                          Today completed
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: T.pine }}>
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
                        <Camera size={34} style={{ color: T.pine }} />

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
                    style={{ background: T.pine }}
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
                    <p className="mt-2 text-center text-xs" style={{ color: T.pine }}>
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
                    <div className="rounded-3xl p-4 text-white" style={{ background: T.pine }}>
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
                            background: T.pine,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs font-bold" style={{ color: T.pine }}>
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
                          borderColor: done ? T.pine : T.line,
                          background: done ? '#E3F2EA' : T.card,
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
                              background: done ? T.pine : T.mist,
                              color: done ? '#fff' : T.pine,
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
                                style={{ background: T.mist, color: T.pine }}
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
                  <Card className="p-5 text-center" style={{ background: T.mist }}>
                    <CheckCircle2 className="mx-auto" size={32} style={{ color: T.pine }} />

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

            <Card className="p-5" style={{ background: T.mist, border: 'none' }}>
              <div className="flex items-center gap-2">
                <Flame size={20} style={{ color: T.amber }} />

                <h3 className="text-sm font-bold" style={{ color: T.ink }}>
                  Current streak
                </h3>
              </div>

              <p className="mt-3 text-4xl font-bold" style={{ color: T.pine }}>
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
      <CheckCircle2 size={14} color={done ? '#A9CABA' : 'rgba(255,255,255,.35)'} />

      <span className="text-xs font-semibold text-white/85">
        {label}
      </span>
    </div>
  )
}