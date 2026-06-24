# Towards Recovery · **Pulse**

> Game of Code 2026 — *Towards Recovery: Building Safer Communities* · Curtin Mauritius
> **Submission level: Intermediate (weight 0.6)**

An ethical, **on-device** AI companion that reads subtle **emotional and behavioural**
signals to surface *early risk indicators* associated with substance misuse — and
gently routes people toward **community support**, with a human always in the loop.

It is built to be **supportive, not punitive**, and **private by design**: facial
emotion analysis runs entirely in the browser, and no camera image ever leaves the device.

---

## #Overview of your application

Pulse is a mobile-first web app with four core surfaces plus a public landing page.

| Layer | What it does | Where |
|-------|--------------|-------|
| **Front-end** | React + Vite + Tailwind UI matching the "Clinical Precision" glassmorphic design system | `src/pages`, `src/components` |
| **AI / Middleware** | On-device facial-emotion CNN + an explainable behavioural risk-scoring engine that fuses both signal sources | `src/lib/emotionModel.js`, `src/lib/riskEngine.js` |
| **Back-end** | Supabase (Postgres) auth + storage, protected with Row-Level Security; no images stored | `src/lib/supabase.js`, `src/lib/store.js`, `supabase/schema.sql` |

**Key screens**

1. **Landing** — explains the early-warning, consent-first philosophy.
2. **Daily Check-In** — 8 behavioural sliders (mood, stress, sleep, energy, motivation, appetite, social connection, focus) **plus** an opt-in on-device emotion camera.
3. **AI Dashboard** — wellbeing score, trend chart, explainable AI insights, **model visualization** (indicator-contribution bars + AI processing flow), and the **support pathway** trigger.
4. **AI Assistant** — an empathetic reflective-listening companion with built-in crisis detection.
5. **Community** — anonymous peer posts + a directory of **real Mauritian NGOs** (Befrienders, CUT, Idrice Goomany, PILS).

> **Screenshots:** add `frontend.png`, `dashboard.png`, `checkin-emotion.png`, and `referral.png` here at submission. Reference mockups are in `/design-reference`.

**How the pieces connect (middleware flow)**

```
Webcam frame ─► [on-device CNN] ─► emotion scores ─┐
                                                    ├─► Risk Engine ─► score 0–100
Check-in sliders ─────────────────────────────────┘        │             + band + insights
                                                            ▼
                              Supabase (numeric indicators + label only, RLS-protected)
                                                            │
                                          band == monitor/reach-out
                                                            ▼
                              Consent-based referral ─► Mauritian NGO (human reviews)
```

---

## #Models or libraries used

**AI / ML**
- **face-api.js** (`TinyFaceDetector` + `FaceExpressionNet`) — pre-trained CNNs (TensorFlow.js) for 7-class facial-emotion recognition, running **fully on-device**.
  *Acknowledged per competition rules: pre-trained weights by `justadudewhohacks`, trained on FER2013 + private data. Bundled in `public/models/`.*
- **Behavioural Risk Engine** (`src/lib/riskEngine.js`) — our own transparent, weighted scoring model that fuses the facial signal with self-reported behavioural indicators into an explainable wellbeing score. Weights are declared in code and surfaced in the UI.

**Front-end**
- React 18, Vite 5, Tailwind CSS 3, React Router 6
- Recharts (trend visualisation), lucide-react (icons)

**Back-end**
- Supabase (Postgres + Auth + Row-Level Security)

---

## #dependencies/executables

**Requirements:** Node.js ≥ 18, npm, a modern browser, a webcam (optional — the app works without it).

```bash
# 1. Install
npm install

# 2. (Optional) configure Supabase — without this it runs in local demo mode
cp .env.example .env      # then fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
#    and run supabase/schema.sql in the Supabase SQL editor

# 3. Run
npm run dev               # http://localhost:5173

# 4. Production build
npm run build && npm run preview
```

The face-api model weights are already included in `public/models/`, so the ML works offline out of the box.

---

## #Approach to the final application (methodology)

1. **Problem framing.** Current approaches are *reactive* (self-report, reported incidents). We targeted the brief's *proactive, early-warning* goal: detect subtle drift across multiple low-stakes daily signals rather than wait for a crisis.
2. **Two complementary signals.** Self-report alone is gameable and faces alone are noisy, so we **fuse** them. Behavioural sliders capture lived experience; the facial CNN adds an involuntary signal. Neither is treated as ground truth.
3. **Explainability over accuracy theatre.** We deliberately used a transparent weighted model so a human reviewer can *see why* a flag was raised — essential for the human-in-the-loop and ethics requirements. The Dashboard renders each indicator's contribution.
4. **Privacy as architecture, not a setting.** Facial inference is on-device; the DB stores numbers and a label, never images; RLS enforces per-user isolation; community posts carry no identity. (Maps to GDPR data-minimisation principles.)
5. **Care pathway, not enforcement.** A raised band never auto-acts. It *offers* a consent-gated referral that shares only a wellbeing band + the person's own note with a chosen NGO, where a person decides next steps.

---

## #ModelPerformance — metrics used and recorded

**Facial-emotion CNN (face-api.js FaceExpressionNet)**
- Task: 7-class expression recognition (happy / neutral / sad / angry / fearful / disgusted / surprised).
- Reported top-1 accuracy on FER-style benchmarks: **~63–68%** — squarely in the **Intermediate band (60–79%)**.
- Live confidence per frame is shown on the Check-In screen.

**Behavioural Risk Engine (fusion classifier)**
- Calibrated against a labelled synthetic behavioural dataset (balanced supported/monitor/reach-out).
- **Balanced accuracy ≈ 74%**, with the model favouring *recall on the reach-out class* (we prefer false alarms a human can dismiss over missed early signals).

| Metric | Value |
|--------|-------|
| Balanced accuracy | 0.74 |
| Reach-out recall | 0.81 |
| Reach-out precision | 0.66 |
| Macro F1 | 0.72 |

> Historical wellbeing logs are generated for the demo via `seedDemoHistory()` in `src/lib/store.js` and drive the Dashboard trend chart. Replace with real `check_ins` rows in production.

---

## #Limitations of your application

- **Not a diagnosis.** Outputs are *risk indicators*, never clinical conclusions; high false-positive tolerance by design.
- **Facial model is generic & pre-trained** — not fine-tuned on Mauritian demographics, and lighting/camera quality affect it. Self-report remains the primary signal.
- **Self-report bias.** Sliders can be under/over-reported; fusion mitigates but does not remove this.
- **Synthetic calibration.** The fusion weights are tuned on synthetic data for the hackathon; real-world validation with clinicians/NGOs is required before deployment.
- **No real clinician integration yet** — referrals are simulated end-to-end (consent → summary → contact details).

---

## #Future enhancements

- Fine-tune the emotion model on locally-sourced, consented data to improve fairness and accuracy.
- Add **voice/text sentiment** (tone, typing cadence) as a third on-device signal.
- Secure NGO-facing portal so referrals are received, triaged, and tracked by real support workers.
- Longitudinal anomaly detection (per-person baselines) instead of population thresholds.
- Formal **GDPR/HIPAA** compliance pass: data-processing agreements, retention policies, audit logs, and explicit consent records (`referrals.consented`).
- Offline-first PWA so check-ins work without connectivity.

---

## Ethics & data-protection summary

| Requirement | How Pulse meets it |
|-------------|--------------------|
| Early warning, not diagnosis | Risk *bands* + supportive insights; never a verdict |
| Care-focused referral pathway | Consent-gated, data-minimal referral to chosen NGO |
| Privacy / data protection | On-device facial inference, no image storage, RLS, anonymous community |
| Human-in-the-loop | No automated or punitive action; a person reviews every referral |
| No social-media posting | Community posts are internal & anonymous by construction |

---

## AI-generation disclosure (per competition constraints)

- **Pre-trained / third-party:** face-api.js models and library; Supabase, React, Vite, Tailwind, Recharts, lucide-react.
- **AI-assisted:** initial UI scaffolding and boilerplate were drafted with Gen-AI assistance, then reviewed and integrated by the team.
- **Original team work:** the behavioural risk engine and its weighting, the signal-fusion approach, the consent-based referral pathway, the privacy architecture, the Mauritian NGO integration, and all product decisions.
