import { useState } from 'react'
import { X, ShieldCheck, Phone, Check } from 'lucide-react'
import { SUPPORT_SERVICES } from '../lib/services'

/**
 * Care-focused referral pathway.
 *
 * Principles baked into the flow (mapping to the brief):
 *  - CONSENT-FIRST: nothing is shared until the person explicitly agrees.
 *  - DATA-MINIMAL: only a wellbeing band + the person's own note are shared,
 *    never raw indicators, images, or a "diagnosis".
 *  - HUMAN-IN-THE-LOOP: the output is a request a real NGO worker reviews;
 *    the system never auto-contacts anyone or takes punitive action.
 */
export default function ReferralModal({ score, onClose }) {
  const [step, setStep] = useState('consent') // consent | choose | sent
  const [service, setService] = useState(null)
  const [note, setNote] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-md rounded-t-xl bg-white p-6 shadow-float sm:rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Support pathway</h2>
          <button onClick={onClose}>
            <X size={20} className="text-on-surface-variant" />
          </button>
        </div>

        {step === 'consent' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-secondary-soft p-4 text-sm text-secondary">
              <ShieldCheck size={18} className="mb-2" />
              You are in control. Pulse will only share what you approve, with the service you choose.
              This is a request a person reviews — not an automatic report.
            </div>
            <p className="text-sm text-on-surface-variant">
              We would share a short, non-clinical summary: a wellbeing band of{' '}
              <strong>{score >= 45 ? 'Monitor' : 'Reach out'}</strong> and any note you write below.
              No camera images, no raw scores, no diagnosis.
            </p>
            <button onClick={() => setStep('choose')} className="btn-ai w-full">
              I understand — choose a service
            </button>
            <button onClick={onClose} className="btn-ghost w-full">
              Not now
            </button>
          </div>
        )}

        {step === 'choose' && (
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              {SUPPORT_SERVICES.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setService(s)}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition ${
                    service?.name === s.name
                      ? 'border-secondary bg-secondary-soft'
                      : 'border-outline-variant'
                  }`}
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-on-surface-variant">{s.services}</p>
                  </div>
                  {service?.name === s.name && <Check size={18} className="text-secondary" />}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything you'd like the service to know (optional)…"
              className="input resize-none"
            />
            <button
              disabled={!service}
              onClick={() => setStep('sent')}
              className="btn-primary w-full disabled:opacity-50"
            >
              Send request to {service?.name || 'service'}
            </button>
          </div>
        )}

        {step === 'sent' && (
          <div className="mt-6 space-y-4 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <Check size={28} />
            </span>
            <h3 className="text-lg font-semibold">Request shared with {service.name}</h3>
            <p className="text-sm text-on-surface-variant">
              A support worker will review your request. You can also reach them directly right now —
              there is never any pressure.
            </p>
            <a
              href={`tel:${service.phone.replace(/\s/g, '')}`}
              className="btn-ai w-full"
            >
              <Phone size={16} /> Call {service.phone}
            </a>
            <button onClick={onClose} className="btn-ghost w-full">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
