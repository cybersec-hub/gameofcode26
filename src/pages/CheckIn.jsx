import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Smile, Brain, Moon, Zap, Target, Utensils, Users, Crosshair, Sparkles } from 'lucide-react'
import EmotionCamera from '../components/EmotionCamera'
import { computeWellbeing } from '../lib/riskEngine'
import { saveCheckIn } from '../lib/store'

const SLIDERS = [
  { key: 'mood', label: 'Current Mood', icon: Smile, lo: 'Low', hi: 'High' },
  { key: 'stress', label: 'Stress Level', icon: Brain, lo: 'Calm', hi: 'Overwhelmed' },
  { key: 'sleep', label: 'Sleep Quality', icon: Moon, lo: 'Poor', hi: 'Excellent' },
  { key: 'energy', label: 'Energy Level', icon: Zap, lo: 'Drained', hi: 'Vibrant' },
  { key: 'motivation', label: 'Motivation', icon: Target, lo: 'None', hi: 'High' },
  { key: 'appetite', label: 'Appetite', icon: Utensils, lo: 'Poor', hi: 'Healthy' },
  { key: 'social', label: 'Social Interaction', icon: Users, lo: 'Isolated', hi: 'Connected' },
  { key: 'focus', label: 'Focus', icon: Crosshair, lo: 'Scattered', hi: 'Sharp' },
]

export default function CheckIn() {
  const navigate = useNavigate()
  const [vals, setVals] = useState(Object.fromEntries(SLIDERS.map((s) => [s.key, 50])))
  const [emotion, setEmotion] = useState(null)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setVals((p) => ({ ...p, [k]: Number(v) }))

  async function complete() {
    setSaving(true)
    const normalised = Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, v / 100]))
    const result = computeWellbeing(normalised, emotion)
    try {
      await saveCheckIn({
        indicators: normalised,
        score: result.score,
        band: result.band,
        emotion: emotion?.dominant || null,
        emotion_confidence: emotion ? Math.round(emotion.confidence * 100) : null,
      })
      navigate('/app/dashboard', { state: { justCheckedIn: true } })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 py-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Daily Check-In</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          How are you feeling today? Your responses help the AI tailor your wellbeing journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {SLIDERS.map(({ key, label, icon: Icon, lo, hi }) => (
        <div key={key} className="card !p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{label}</p>
            <Icon size={18} className="text-secondary" />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={vals[key]}
            onChange={(e) => set(key, e.target.value)}
            className="mt-4"
          />
          <div className="mt-2 flex justify-between text-xs text-on-surface-variant">
            <span>{lo}</span>
            <span>{hi}</span>
          </div>
        </div>
      ))}
      </div>{/* end slider grid */}

      <EmotionCamera onResult={setEmotion} />

      <button onClick={complete} disabled={saving} className="btn-ai w-full !py-4 text-base">
        <Sparkles size={18} />
        {saving ? 'Analysing…' : 'Complete Check-In'}
      </button>
    </div>
  )
}
