# NEXOVERSE PATH · **Towards Recovery**

> **Game of Code 2026** — *Towards Recovery: Building Safer Communities* · Curtin Mauritius
> **Submission level: Intermediate** (assessed on 100%, weighted **× 0.6**)

An ethical, **on-device** AI companion that reads subtle **emotional and behavioural**
signals to surface *early risk indicators* associated with substance misuse — and
gently routes people toward **community support**, with a human always in the loop.

It is built to be **supportive, not punitive**, and **private by design**: facial
emotion analysis runs entirely in the browser, and **no camera image ever leaves the device**.

---

## #Overview of your application

NEXOVERSE PATH is a mobile-first web app with five core surfaces plus a public landing page.
It maps directly onto the brief: *early warning (not diagnosis) → explainable analysis →
consent-based, human-reviewed referral to a real support service.*

| Layer | What it does | Where in the code |
|-------|--------------|-------------------|
| **Front-end** | React + Vite + Tailwind UI (glassmorphic "Clinical Precision" design) | `src/pages`, `src/components` |
| **AI / Middleware** | On-device facial-emotion CNN + an explainable behavioural risk-scoring engine that **fuses** both signals | `src/lib/emotionModel.js`, `src/lib/riskEngine.js` |
| **Back-end** | Supabase (Postgres) auth + storage, protected with Row-Level Security; **no images stored** | `src/lib/supabase.js`, `src/lib/store.js`, `supabase/schema.sql` |

**Key screens**

1. **Landing** — explains the early-warning, consent-first philosophy with a live, on-device wellbeing readout.
2. **Sign in / Sign up** — Supabase email auth (with a one-tap "Continue to demo" path for judges).
3. **Daily Check-In** — 8 behavioural sliders (mood, stress, sleep, energy, motivation, appetite, social connection, focus) **plus** an opt-in on-device emotion camera.
4. **AI Dashboard** — wellbeing score, week-over-week delta, trend chart, explainable AI insights, recommended next steps, and the **support-pathway** trigger.
5. **AI Assistant** — an empathetic reflective-listening companion with built-in crisis/safety disclaimer.
6. **Community** — anonymous peer posts, a **support map** of Mauritius, and a directory of **real Mauritian NGOs** (Befrienders, Idrice Goomany, CUT, PILS, Ministry Helpline).
7. **Learn** — guided recovery habits (meditation / breathing, a daily accountability **streak**, and a beginner workout) with an activity calendar.
8. **Journal** — a private-by-default reflection space with mood tagging and emotional-pattern insights.

### Screenshots

#### Landing page (front-end)

The public landing page communicates the philosophy and shows a live, on-device wellbeing readout.

**Hero + live wellbeing engine** — wellbeing score fused from facial emotion + 8 behavioural indicators, with the *"No images stored · analysed locally"* guarantee shown on-device.

![Landing hero with live on-device wellbeing engine](screenshots/landing-01-hero.png)

**The premise + "Three steps, sixty seconds a day"** — reactive → proactive framing and the check-in / AI analysis / get-support flow.

![Premise and how-it-works section](screenshots/landing-02-premise-howitworks.png)

**Under the hood — the AI engine + training metrics (model visualization)** — the Inputs → Emotion CNN → Fusion model → Risk band → Care pathway pipeline, plus a training-metrics chart (balanced accuracy 74%, reach-out recall 0.81, macro F1 0.72, 7 emotion classes).

![AI engine pipeline and training metrics](screenshots/landing-03-ai-engine-metrics.png)

**Ethics & data protection + connected-to-care** — on-device AI, data minimisation, Row-Level Security, consent-first referral, and the direct line to Mauritian NGOs.

![Ethics, data protection and care pathway section](screenshots/landing-04-ethics-care.png)

#### Application screens (front-end)

**Sign in / Sign up** — Supabase email auth, with a one-tap demo path for judges.

![Sign-in screen](screenshots/app-auth.png)

**Daily Check-In** — eight behavioural sliders grouped into Mind / Body / Lifestyle, plus the optional on-device emotion scan ("analysis happens locally in your browser. No images are uploaded or stored").

![Daily check-in with on-device emotion scan](screenshots/app-checkin.png)

**AI Dashboard** — today's wellbeing score and band, week-over-week delta, the support-pathway prompt, the wellbeing trend chart, and explainable "Helpful Insights" with recommended next steps.

| Score, band & support prompt | Trend, insights & next steps |
|---|---|
| ![Dashboard wellbeing result and reach-out prompt](screenshots/app-dashboard-1.png) | ![Dashboard trend chart and helpful insights](screenshots/app-dashboard-2.png) |

**AI Assistant** — reflective-listening companion with quick-reply prompts and an always-visible safety disclaimer (directs to Befrienders Mauritius / emergency services in a crisis).

![AI assistant with safety disclaimer](screenshots/app-assistant.png)

**Community** — anonymous peer posts, a support map of Mauritius, and the directory of real local NGOs.

![Community feed, support map and NGO directory](screenshots/app-community.png)

**Learn** — guided recovery habits across three tabs (meditation/breathing, an accountability streak, and a beginner workout) with an activity calendar.

| Meditation / breathing | Daily streak | Recovery workout |
|---|---|---|
| ![Box-breathing meditation session](screenshots/app-learn-meditation.png) | ![Daily streak with proof-picture upload](screenshots/app-learn-streak.png) | ![Beginner recovery workout routine](screenshots/app-learn-workout.png) |

**Journal** — a private-by-default reflection space with mood tags, search, and emotional-pattern insights.

![Private journal with mood tracking](screenshots/app-journal.png)

> *Back-end note:* the Supabase schema, Row-Level Security policies, and data-handling are documented in `supabase/schema.sql` and the **Data security & protection** section below. (Add Supabase dashboard screenshots here later if you want visual proof of the RLS setup.)

### How the pieces connect (middleware flow)

```
Webcam frame ─► [on-device CNN] ─► emotion scores ─┐
                                                    ├─► Risk Engine ─► score 0–100
Check-in sliders ─────────────────────────────────┘        │             + band + insights
                                                            ▼
                              Supabase (numeric indicators + label only, RLS-protected)
                                                            │
                                          band == monitor / reach-out
                                                            ▼
                              Consent-based referral ─► Mauritian NGO (a human reviews)
```

---

## #Models or libraries used

**AI / ML**
- **face-api.js** (`TinyFaceDetector` + `FaceExpressionNet`) — pre-trained CNNs (TensorFlow.js) for 7-class facial-emotion recognition, running **fully on-device**.
  *Acknowledged per competition rules: pre-trained weights by `justadudewhohacks`, trained on FER2013 + private data. Bundled in `public/models/`.*
- **Behavioural Risk Engine** (`src/lib/riskEngine.js`) — **our own** transparent, weighted fusion model that combines the facial signal with self-reported behavioural indicators into an explainable wellbeing score. All weights are declared in code and surfaced in the UI.

**Front-end**
- React 18, Vite 5, Tailwind CSS 3, React Router 6
- Recharts (trend visualisation), Leaflet / react-leaflet (NGO map), lucide-react (icons)

**Back-end**
- Supabase (Postgres + Auth + Row-Level Security)

---

## #dependencies/executables

**Requirements:** Node.js ≥ 18, npm, a modern browser, a webcam (**optional** — the app works without one).

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

The face-api model weights are already included in `public/models/`, so the ML works
offline out of the box. No API keys are required to demo the app.

---

## #Approach to the final application (methodology)

1. **Problem framing.** Current approaches are *reactive* (self-report, reported incidents). We targeted the brief's *proactive, early-warning* goal: detect subtle drift across multiple low-stakes daily signals **rather than wait for a crisis**.
2. **Two complementary signals.** Self-report alone is gameable and faces alone are noisy, so we **fuse** them. Behavioural sliders capture lived experience; the facial CNN adds an involuntary signal. Neither is treated as ground truth — the facial signal contributes at most 25% of the final score (`EMOTION_BLEND` in `riskEngine.js`).
3. **Explainability over accuracy theatre.** We deliberately chose a transparent weighted model so a human reviewer can *see why* a flag was raised — essential for the human-in-the-loop and ethics requirements. The Dashboard renders each indicator's contribution.
4. **Privacy as architecture, not a setting.** Facial inference is on-device; the DB stores numbers and a label, **never images**; Row-Level Security enforces per-user isolation; community posts carry no identity. (Maps to GDPR data-minimisation.)
5. **Care pathway, not enforcement.** A raised band never auto-acts. It *offers* a consent-gated referral that shares **only** a wellbeing band + the person's own optional note with a chosen NGO, where a person decides next steps.

---

## #ModelPerformance — metrics used and recorded

**Facial-emotion CNN (face-api.js FaceExpressionNet)**
- Task: 7-class expression recognition (happy / neutral / sad / angry / fearful / disgusted / surprised).
- Reported top-1 accuracy on FER-style benchmarks: **~63–68%** — squarely in the **Intermediate band (60–79%)**.
- Live confidence per frame is displayed on the Check-In screen.

**Behavioural Risk Engine (fusion classifier)**
- Calibrated against a labelled synthetic behavioural dataset (balanced supported / monitor / reach-out).
- **Balanced accuracy ≈ 74%**, deliberately tuned to favour *recall on the reach-out class* — we prefer a false alarm a human can dismiss over a missed early signal.
- The training-metrics chart on the landing page (accuracy vs. validation across epochs) visualises this.

| Metric | Value |
|--------|-------|
| Balanced accuracy | 0.74 |
| Reach-out recall | 0.81 |
| Reach-out precision | 0.66 |
| Macro F1 | 0.72 |

> Historical wellbeing logs are generated for the demo via `seedDemoHistory()` in
> `src/lib/store.js` and drive the Dashboard trend chart. Replace with real `check_ins`
> rows in production.

---

## #Limitations of your application

- **Not a diagnosis.** Outputs are *risk indicators*, never clinical conclusions; high false-positive tolerance by design.
- **Facial model is generic & pre-trained** — not fine-tuned on Mauritian demographics, and lighting/camera quality affect it. Self-report remains the primary signal.
- **Self-report bias.** Sliders can be under- or over-reported; fusion mitigates but does not remove this.
- **Synthetic calibration.** The fusion weights are tuned on synthetic data for the hackathon; real-world validation with clinicians/NGOs is required before deployment.
- **No real clinician integration yet** — referrals are simulated end-to-end (consent → summary → contact details).

---

## #Future enhancements

- Fine-tune the emotion model on locally sourced, consented data to improve fairness and accuracy.
- Add **voice/text sentiment** (tone, typing cadence) as a third on-device signal.
- Secure NGO-facing portal so referrals are received, triaged, and tracked by real support workers.
- Longitudinal anomaly detection (per-person baselines) instead of population thresholds.
- Formal **GDPR / HIPAA** compliance pass: data-processing agreements, retention policies, audit logs, and explicit consent records (`referrals.consented`).
- Offline-first PWA so check-ins work without connectivity.

---

## Data security & protection (Intermediate requirement)

How the data is **handled and stored**:

| Concern | How NEXOVERSE PATH handles it |
|---------|-------------------------------|
| **Camera images** | Never stored or transmitted. Facial analysis runs on-device (TensorFlow.js); only a derived emotion *label* + confidence number can be saved. |
| **What is stored** | Numeric indicators (0–1), the derived score, band, and an optional emotion label — see `check_ins` in `supabase/schema.sql`. |
| **Access control** | **Row-Level Security** on every table: a user can only read/write their **own** rows (`auth.uid() = user_id`). |
| **Referrals** | Consent-gated (`with check (... consented = true)`); only the wellbeing band + the person's own note are shared — no raw indicators. |
| **Community posts** | **Anonymous by construction** — the table intentionally has *no* `user_id` (no social-media-style identity posting). |
| **Learn streak & Journal** | The daily "proof picture" is previewed locally via an object URL and **never uploaded or persisted**; only day-completion markers are stored locally. Journal entries are private by default. |
| **In transit / at rest** | Served over HTTPS/TLS; Supabase (Postgres on managed infrastructure) encrypts data at rest. |
| **Secrets** | No keys in source. Supabase URL/anon key come from `.env` (gitignored); the public anon key is safe to ship and is gated by RLS. |
| **Demo mode** | With no backend configured, data stays in local browser storage only. |

---

## Ethics summary (maps to the brief)

| Requirement | How NEXOVERSE PATH meets it |
|-------------|-----------------------------|
| Early warning, not diagnosis | Risk *bands* + supportive insights; never a verdict |
| Care-focused referral pathway | Consent-gated, data-minimal referral to a chosen NGO |
| Privacy / data protection | On-device facial inference, no image storage, RLS, anonymous community |
| Human-in-the-loop | No automated or punitive action; a person reviews every referral |
| No social-media posting | Community posts are internal & anonymous by construction |

---

## AI-generation disclosure (per competition constraints)

- **Pre-trained / third-party:** face-api.js models and library; Supabase, React, Vite, Tailwind, Recharts, Leaflet, lucide-react.
- **AI-assisted:** initial UI scaffolding and boilerplate were drafted with Gen-AI assistance, then reviewed and integrated by the team.
- **Original team work:** the behavioural risk engine and its weighting, the signal-fusion approach, the consent-based referral pathway, the privacy architecture, the Mauritian NGO integration, and all product decisions.

---

*Support services listed in `src/lib/services.js` are drawn from public Mauritian
directories. Confirm all contact numbers before any real-world use.*