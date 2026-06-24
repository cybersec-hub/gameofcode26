import * as faceapi from 'face-api.js'

/**
 * On-device facial emotion analysis.
 *
 * Models: TinyFaceDetector (face localisation) + FaceExpressionNet (7-class
 * emotion CNN), both pre-trained and bundled in /public/models. Everything
 * runs in the browser via TensorFlow.js — NO frame ever leaves the device,
 * which is what makes the "Privacy by Design" claim real and verifiable.
 *
 * Pre-trained weights: face-api.js (justadudewhohacks), trained on the
 * FER2013 + private datasets. Acknowledged per competition rules.
 */

const MODEL_URL = '/models'
let loaded = false

export async function loadEmotionModels() {
  if (loaded) return
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ])
  loaded = true
}

export const modelsLoaded = () => loaded

// face-api emotion keys -> our wellbeing-oriented labels
export const EMOTION_LABELS = {
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  angry: 'Frustrated',
  fearful: 'Anxious',
  disgusted: 'Withdrawn',
  surprised: 'Alert',
}

/**
 * Analyse a single video/image element.
 * @returns {null | { dominant, confidence, scores }}
 */
export async function analyseFrame(mediaEl) {
  if (!loaded || !mediaEl) return null
  const detection = await faceapi
    .detectSingleFace(mediaEl, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 }))
    .withFaceExpressions()

  if (!detection) return null

  const scores = detection.expressions // { happy: 0.8, sad: 0.1, ... }
  const [dominant, confidence] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return {
    dominant,
    dominantLabel: EMOTION_LABELS[dominant] || dominant,
    confidence,
    scores,
    box: detection.detection.box,
  }
}
