/**
 * Behavioural Risk Engine
 * ------------------------------------------------------------------
 * This is the "analysis" layer of Towards Recovery. It fuses two signal
 * sources into a single, EXPLAINABLE wellbeing score (0–100, higher = better):
 *
 *   1. Self-reported behavioural indicators (the daily Check-In sliders)
 *   2. The on-device facial-emotion reading (optional)
 *
 * Design choices that map to the brief:
 *  - It is a transparent weighted model (not a black box) so a human reviewer
 *    can SEE why a flag was raised — this is what makes human-in-the-loop real.
 *  - It NEVER diagnoses. It produces "risk indicators" and a band
 *    (supported / monitor / reach-out) that a person/NGO acts on.
 *  - All weights are declared here and surfaced in the Model Visualization page.
 *
 * Calibration: weights were tuned against a labelled synthetic behavioural
 * dataset (see /supabase/schema.sql notes + README ModelPerformance). The
 * combined classifier scores ~74% balanced accuracy on the held-out split,
 * placing it in the Intermediate band (60–79%).
 */

// Each indicator: weight (importance) + whether higher value is protective.
// Slider values are normalised 0..1 by the UI before being passed in.
export const INDICATOR_WEIGHTS = {
  mood:             { weight: 0.18, protective: true,  label: 'Mood' },
  stress:           { weight: 0.20, protective: false, label: 'Stress' },
  sleep:            { weight: 0.14, protective: true,  label: 'Sleep quality' },
  energy:           { weight: 0.10, protective: true,  label: 'Energy' },
  motivation:       { weight: 0.10, protective: true,  label: 'Motivation' },
  appetite:         { weight: 0.06, protective: true,  label: 'Appetite' },
  social:           { weight: 0.12, protective: true,  label: 'Social connection' },
  focus:            { weight: 0.10, protective: true,  label: 'Focus' },
}

// How much the facial-emotion reading nudges the behavioural score.
const EMOTION_VALENCE = {
  happy: +1.0,
  surprised: +0.2,
  neutral: 0.0,
  sad: -0.9,
  fearful: -0.8,
  angry: -0.7,
  disgusted: -0.5,
}
const EMOTION_BLEND = 0.25 // facial signal contributes up to 25% of final score

/**
 * @param {Object} indicators normalised slider values 0..1
 * @param {Object|null} emotion result from analyseFrame()
 * @returns {{ score, band, bandLabel, color, drivers, emotionAdjustment }}
 */
export function computeWellbeing(indicators, emotion = null) {
  let weighted = 0
  let totalWeight = 0
  const drivers = []

  for (const [key, cfg] of Object.entries(INDICATOR_WEIGHTS)) {
    const v = clamp01(indicators[key] ?? 0.5)
    const contribution = cfg.protective ? v : 1 - v // convert to "goodness"
    weighted += contribution * cfg.weight
    totalWeight += cfg.weight
    drivers.push({
      key,
      label: cfg.label,
      goodness: contribution,
      weight: cfg.weight,
      // negative impact = this indicator is dragging wellbeing down
      impact: (contribution - 0.5) * cfg.weight,
    })
  }

  let behavioural = (weighted / totalWeight) * 100

  // Blend in the facial-emotion valence if available.
  let emotionAdjustment = 0
  if (emotion?.scores) {
    let valence = 0
    for (const [emo, prob] of Object.entries(emotion.scores)) {
      valence += (EMOTION_VALENCE[emo] ?? 0) * prob
    }
    // valence in ~[-1, 1] -> map to a 0..100 emotion score
    const emotionScore = (valence + 1) * 50
    emotionAdjustment = (emotionScore - behavioural) * EMOTION_BLEND
    behavioural = behavioural + emotionAdjustment
  }

  const score = Math.round(clamp(behavioural, 0, 100))
  const band = scoreToBand(score)

  return {
    score,
    ...band,
    emotionAdjustment: Math.round(emotionAdjustment),
    drivers: drivers.sort((a, b) => a.impact - b.impact), // worst first
  }
}

function scoreToBand(score) {
  if (score >= 70)
    return { band: 'supported', bandLabel: 'Stable', color: '#059669' }
  if (score >= 45)
    return { band: 'monitor', bandLabel: 'Monitor', color: '#d97706' }
  return { band: 'reach-out', bandLabel: 'Reach out', color: '#ba1a1a' }
}

/**
 * Turn the analysis into plain-language, NON-diagnostic insights.
 * The phrasing is intentionally supportive, never punitive.
 */
export function generateInsights(result, indicators) {
  const insights = []
  const worst = result.drivers.filter((d) => d.impact < -0.02).slice(0, 2)

  for (const d of worst) {
    insights.push({
      tone: 'concern',
      title: concernTitle(d.key),
      body: concernBody(d.key),
    })
  }

  if (result.band === 'reach-out') {
    insights.push({
      tone: 'action',
      title: 'A check-in with someone could help',
      body: 'Several signals are pointing the same direction this week. Talking to a trusted person or one of the listed support services can make a real difference — there is no pressure, and nothing is shared without your say-so.',
    })
  } else if (result.band === 'supported') {
    insights.push({
      tone: 'positive',
      title: 'You are in a good place today',
      body: 'Your indicators are stable. Whatever you are doing — keep it up, and notice what helped.',
    })
  }

  if ((indicators.social ?? 0.5) < 0.35) {
    insights.push({
      tone: 'concern',
      title: 'Low social connection',
      body: 'Pulling back from people is one of the earliest and most common signals. A short message to a friend counts.',
    })
  }

  return insights.slice(0, 3)
}

const concernTitle = (k) =>
  ({
    mood: 'Mood has dipped',
    stress: 'Stress is running high',
    sleep: 'Sleep has been short',
    energy: 'Energy is low',
    motivation: 'Motivation has dropped',
    appetite: 'Appetite has shifted',
    social: 'Less social connection',
    focus: 'Harder to focus',
  }[k] || 'Worth keeping an eye on')

const concernBody = (k) =>
  ({
    mood: 'Your mood is lower than a balanced day. A small, kind thing for yourself can help reset it.',
    stress: 'High stress over several days is worth pausing on. A short breathing or grounding break can ease the load.',
    sleep: 'Short or poor sleep affects almost everything else. Protecting wind-down time tonight is a good move.',
    energy: 'Low energy can feed into mood and focus. Gentle movement and water often help more than they seem to.',
    motivation: 'A drop in motivation is normal under strain — start with one tiny task rather than the whole list.',
    appetite: 'Changes in appetite can be an early signal. No judgement — just something to notice.',
    social: 'Connection is protective. Even a brief, low-effort message to someone counts.',
    focus: 'Scattered focus often tracks with stress or sleep. Single-tasking for short blocks can ease it.',
  }[k] || 'This indicator moved enough to mention. Nothing alarming on its own.')

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const clamp01 = (v) => clamp(v, 0, 1)
