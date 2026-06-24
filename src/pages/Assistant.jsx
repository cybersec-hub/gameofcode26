import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, AlertCircle, MessageSquareHeart, Brain, BookOpen } from 'lucide-react'



const CRISIS_TERMS = ['suicide', 'kill myself', 'end it', 'self harm', 'self-harm', 'overdose', "don't want to live"]

const QUICK = ['I feel overwhelmed', 'How can I manage stress?', "I can't sleep"]

function respond(text) {
  const t = text.toLowerCase()
  if (CRISIS_TERMS.some((c) => t.includes(c))) {
    return {
      crisis: true,
      body:
        "I'm really glad you told me. What you're feeling matters and you don't have to carry it alone. " +
        'Please reach out right now to Befrienders Mauritius on 800 93 93 — they listen, free and confidential. ' +
        'If you are in immediate danger, call 999.',
    }
  }
  if (t.includes('overwhelm') || t.includes('stress'))
    return {
      body:
        "That sounds heavy. When everything piles up, it helps to shrink the field — what's the single next thing that " +
        'feels most pressing? We can take just that one. Would a 60-second breathing reset help before we do?',
    }
  if (t.includes('sleep'))
    return {
      body:
        "Sleep trouble often rides on a busy mind. A gentle wind-down — dim lights, no screens for 20 minutes, slow breathing — " +
        'can signal your body it is safe to rest. What does your evening usually look like?',
    }
  if (t.includes('alone') || t.includes('lonely'))
    return {
      body:
        'Feeling alone is hard, and reaching out here already counts. Is there one person — even an acquaintance — you could send a ' +
        'short message to today? Connection rarely needs to be big to help.',
    }
  return {
    body:
      "Thank you for sharing that with me. I'm listening. Tell me a little more about what's been on your mind — " +
      'there is no right or wrong way to say it.',
  }
}

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello, I'm NEXOVERSE PATH . I noticed you've had a busy week. How are you feeling today?",
    },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages])

  function send(text) {
    const content = (text ?? input).trim()
    if (!content) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: content }])
    setTimeout(() => {
      const r = respond(content)
      setMessages((m) => [...m, { role: 'ai', text: r.body, crisis: r.crisis }])
    }, 500)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-2xl flex-col py-2">
      <div className="card flex items-center gap-3 !p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ai-gradient text-white">
          <Sparkles size={18} />
        </span>
        <div>
          <p className="font-semibold">NEXOVERSE PATH</p>
          <p className="flex items-center gap-1.5 text-xs text-secondary">
            <span className="live-dot h-2 w-2 rounded-full bg-secondary" /> Always listening
          </p>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                m.role === 'user'
                  ? 'bg-navy text-white'
                  : m.crisis
                  ? 'border border-error/30 bg-error-container text-on-surface'
                  : 'bg-white text-on-surface shadow-glass'
              }`}
            >
              {m.crisis && (
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-error">
                  <AlertCircle size={14} /> Please read this
                </p>
              )}
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="rounded-full border border-secondary/40 px-3 py-1.5 text-xs font-medium text-secondary"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type your message…"
          className="input"
        />
        <button onClick={() => send()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ai-gradient text-white">
          <Send size={18} />
        </button>
      </div>

      {/* Capability cards */}
      <div className="mt-6 space-y-3">
        <Cap icon={MessageSquareHeart} title="Support conversations" body="Reflective listening and active support for daily challenges." />
        <Cap icon={Brain} title="Coping strategies" body="Personalised mindfulness and cognitive framing tools." />
        <Cap icon={BookOpen} title="Wellness education" body="Insights grounded in modern mental-health research." />
      </div>

      <div className="mt-4 rounded-lg bg-surface-low p-4 text-xs text-on-surface-variant">
        <p className="flex items-center gap-1 font-semibold text-error">
          <AlertCircle size={14} /> SAFETY DISCLAIMER
        </p>
        <p className="mt-1">
          NEXOVERSE PATH  supports your wellbeing — it does not diagnose medical conditions. If you are in crisis,
          contact Befrienders Mauritius (800 93 93) or emergency services (999).
        </p>
      </div>
    </div>
  )
}

function Cap({ icon: Icon, title, body }) {
  return (
    <div className="card flex items-start gap-3 !p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-soft text-secondary">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-on-surface-variant">{body}</p>
      </div>
    </div>
  )
}
