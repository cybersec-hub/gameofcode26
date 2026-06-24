import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, Camera, Loader2 } from 'lucide-react'
import { loadEmotionModels, analyseFrame, EMOTION_LABELS } from '../lib/emotionModel'
import { Chip } from './ui'

/**
 * Live, on-device facial-emotion reading. Streams frames from the webcam,
 * runs the CNN locally every ~800ms, and reports the dominant emotion up
 * to the parent. No frame is ever uploaded or stored.
 */
export default function EmotionCamera({ onResult }) {
  const videoRef = useRef(null)
  const timerRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | running | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function start() {
    try {
      setStatus('loading')
      await loadEmotionModels()
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('running')
      timerRef.current = setInterval(tick, 800)
    } catch (e) {
      setError(e.message || 'Camera unavailable')
      setStatus('error')
    }
  }

  async function tick() {
    if (!videoRef.current) return
    const r = await analyseFrame(videoRef.current)
    if (r) {
      setResult(r)
      onResult?.(r)
    }
  }

  function stop() {
    clearInterval(timerRef.current)
    const stream = videoRef.current?.srcObject
    stream?.getTracks().forEach((t) => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setStatus('idle')
  }

  useEffect(() => () => stop(), [])

  const top3 = result
    ? Object.entries(result.scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
    : []

  return (
    <div className="overflow-hidden rounded-xl bg-navy text-white">
      <div className="flex items-center justify-between px-4 pt-4">
        <p className="text-sm font-semibold">Emotion Recognition</p>
        <span className="flex items-center gap-1.5 text-xs text-cyan">
          <span className="live-dot h-2 w-2 rounded-full bg-success" /> ON DEVICE
        </span>
      </div>

      <div className="relative mt-3 aspect-video bg-black">
        <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
        {status === 'idle' && (
          <button
            onClick={start}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-white/80"
          >
            <Camera size={28} />
            Tap to analyse expression
          </button>
        )}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-white/80">
            <Loader2 size={28} className="animate-spin" /> Loading on-device model…
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-error-container">
            {error}
          </div>
        )}
        {top3.length > 0 && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
            {top3.map(([emo, p], i) => (
              <span
                key={emo}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  i === 0 ? 'bg-secondary text-white' : 'bg-black/60 text-white/80'
                }`}
              >
                {EMOTION_LABELS[emo]} {Math.round(p * 100)}%
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 px-4 py-3 text-xs text-white/70">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan" />
        <p>
          Privacy Badge: analysis happens locally in your browser. No images are uploaded or stored —
          only the emotion label feeds your wellbeing score.
        </p>
      </div>

      {status === 'running' && (
        <button onClick={stop} className="w-full bg-white/10 py-2.5 text-xs font-semibold">
          Stop camera
        </button>
      )}
    </div>
  )
}
