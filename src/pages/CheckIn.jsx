import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Smile,
  Brain,
  Moon,
  Zap,
  Target,
  Utensils,
  Users,
  Crosshair,
  Sparkles,
  ShieldCheck,
  Heart,
  Activity,
} from 'lucide-react'
import EmotionCamera from '../components/EmotionCamera'
import { computeWellbeing } from '../lib/riskEngine'
import { saveCheckIn } from '../lib/store'

const SLIDERS = [
  { key: 'mood', label: 'Current Mood', icon: Smile, lo: 'Low', hi: 'High', group: 'Mind' },
  { key: 'stress', label: 'Stress Level', icon: Brain, lo: 'Calm', hi: 'Overwhelmed', group: 'Mind' },
  { key: 'sleep', label: 'Sleep Quality', icon: Moon, lo: 'Poor', hi: 'Excellent', group: 'Body' },
  { key: 'energy', label: 'Energy Level', icon: Zap, lo: 'Drained', hi: 'Vibrant', group: 'Body' },
  { key: 'motivation', label: 'Motivation', icon: Target, lo: 'None', hi: 'High', group: 'Mind' },
  { key: 'appetite', label: 'Appetite', icon: Utensils, lo: 'Poor', hi: 'Healthy', group: 'Body' },
  { key: 'social', label: 'Social Interaction', icon: Users, lo: 'Isolated', hi: 'Connected', group: 'Lifestyle' },
  { key: 'focus', label: 'Focus', icon: Crosshair, lo: 'Scattered', hi: 'Sharp', group: 'Lifestyle' },
]

const GROUPS = [
  {
    name: 'Mind',
    icon: Heart,
    description: 'Mood, stress, motivation, and emotional balance.',
  },
  {
    name: 'Body',
    icon: Moon,
    description: 'Sleep, energy, appetite, and physical signals.',
  },
  {
    name: 'Lifestyle',
    icon: Activity,
    description: 'Connection, focus, and day-to-day functioning.',
  },
]

export default function CheckIn() {
  const navigate = useNavigate()

  const [vals, setVals] = useState(
    Object.fromEntries(SLIDERS.map((s) => [s.key, 50]))
  )

  const [emotion, setEmotion] = useState(null)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => {
    setVals((p) => ({
      ...p,
      [k]: Number(v),
    }))
  }

  async function complete() {
    setSaving(true)

    const normalised = Object.fromEntries(
      Object.entries(vals).map(([k, v]) => [k, v / 100])
    )

    const result = computeWellbeing(normalised, emotion)

    try {
      await saveCheckIn({
        indicators: normalised,
        score: result.score,
        band: result.band,
        emotion: emotion?.dominant || null,
        emotion_confidence: emotion ? Math.round(emotion.confidence * 100) : null,
      })

      navigate('/app/dashboard', {
        state: {
          justCheckedIn: true,
        },
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4 pb-28">
      {/* Header */}
      <section className="rounded-[2rem] border border-outline/60 bg-gradient-to-br from-surface via-surface to-secondary/10 p-6 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
          <Sparkles size={14} />
          Step 1 · Daily wellbeing check-in
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              How are you feeling today?
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
              Answer honestly. Your responses help the AI understand your current wellbeing signals
              and tailor your dashboard recommendations.
            </p>
          </div>

          <div className="hidden rounded-3xl bg-secondary/10 p-5 text-secondary md:block">
            <Heart size={42} />
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-2xl bg-surface/70 p-3 text-xs text-on-surface-variant">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-secondary" />

          <p>
            This check-in is an early-warning support tool. It is not a medical diagnosis.
          </p>
        </div>
      </section>

      {/* Grouped sliders */}
      {GROUPS.map(({ name, icon: GroupIcon, description }) => {
        const items = SLIDERS.filter((s) => s.group === name)

        return (
          <section key={name} className="card !p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-2xl bg-secondary/10 p-2 text-secondary">
                <GroupIcon size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-secondary">
                  {name}
                </h2>

                <p className="mt-1 text-sm text-on-surface-variant">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map(({ key, label, icon: Icon, lo, hi }) => (
                <div
                  key={key}
                  className="rounded-3xl border border-outline/60 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-2xl bg-secondary/10 p-2 text-secondary">
                        <Icon size={18} />
                      </div>

                      <p className="text-sm font-semibold">
                        {label}
                      </p>
                    </div>

                    <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                      {vals[key]}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vals[key]}
                    onChange={(e) => set(key, e.target.value)}
                    className="mt-5 w-full accent-secondary"
                  />

                  <div className="mt-2 flex justify-between text-xs text-on-surface-variant">
                    <span>{lo}</span>
                    <span>{hi}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {/* Emotion camera */}
      <section className="card !p-5">
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-secondary">
            Optional emotion scan
          </h2>

          <p className="mt-1 text-sm text-on-surface-variant">
            Use the camera signal to add extra context to your check-in.
          </p>
        </div>

        <EmotionCamera onResult={setEmotion} />

        {emotion && (
          <div className="mt-4 rounded-2xl bg-secondary/10 p-3 text-sm text-on-surface-variant">
            Detected emotion:{' '}
            <span className="font-semibold text-secondary">
              {emotion.dominant}
            </span>

            {typeof emotion.confidence === 'number' && (
              <>
                {' '}
                · Confidence:{' '}
                <span className="font-semibold text-secondary">
                  {Math.round(emotion.confidence * 100)}%
                </span>
              </>
            )}
          </div>
        )}
      </section>

      <p className="text-center text-xs text-on-surface-variant">
        Your check-in will generate your wellbeing score, risk band, and dashboard insights.
      </p>

      {/* Sticky submit button */}
      <div className="sticky bottom-4 z-20">
        <div className="rounded-3xl border border-outline/60 bg-surface/90 p-3 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={complete}
            disabled={saving}
            className="btn-ai w-full !py-4 text-base disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Sparkles size={18} />
            {saving ? 'Analysing…' : 'Analyze my wellbeing'}
          </button>
        </div>
      </div>
    </div>
  )
}