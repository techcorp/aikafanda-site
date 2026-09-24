'use client'

import { useRef, useState } from 'react'
import { Check } from './UI'

/* ------------------------------------------------------------------ FAQ -- */

export function FAQ({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="font-display text-h3 text-fg">{item.q}</span>
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-muted"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)' }}
                aria-hidden="true"
              >
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              className="grid"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 420ms cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div className="overflow-hidden">
                <p
                  className="max-w-prose pb-6 text-body-md text-muted"
                  style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 300ms ease 100ms' }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* --------------------------------------------------------- ContactForm -- */

const serviceOptions = ['Website', 'Automation', 'Chatbot', 'Mobile app', 'Something else']
const budgetOptions = ['Under $500', '$500 – $2,000', '$2,000 – $5,000', '$5,000+', 'Not sure yet']

function Field({ label, name, type = 'text', required, children, error }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-kicker uppercase text-muted">
        {label}
        {required ? <span className="text-amber"> *</span> : null}
      </span>
      {children || <input className="field" type={type} name={name} required={required} />}
      {error ? <span className="mt-1.5 block text-body-sm text-red-400">{error}</span> : null}
    </label>
  )
}

export function ContactForm() {
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [message, setMessage] = useState('')
  const formRef = useRef(null)

  async function onSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(formRef.current))

    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      setState('error')
      setMessage('Name, email and a message are needed before we can reply.')
      return
    }

    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Send failed')
      setState('sent')
    } catch (err) {
      setState('error')
      setMessage(err.message || 'That did not go through. Email us directly instead.')
    }
  }

  if (state === 'sent') {
    return (
      <div className="card flex min-h-[420px] flex-col items-center justify-center p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-indigo/15 text-indigo-soft">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 font-display text-h2 text-fg">Message sent</h3>
        <p className="mt-3 max-w-sm text-body-md text-muted">
          We read every message ourselves and reply within 24 hours. Check your inbox — and your spam
          folder, just in case.
        </p>
        <button onClick={() => setState('idle')} className="btn-ghost mt-7">
          Send another
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="card p-6 md:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>

      <div className="mt-5">
        <Field label="Company" name="company" />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="What do you need?" name="service">
          <select name="service" className="field" defaultValue={serviceOptions[0]}>
            {serviceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget" name="budget">
          <select name="budget" className="field" defaultValue={budgetOptions[1]}>
            {budgetOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" name="message" required>
          <textarea
            name="message"
            rows={5}
            required
            className="field resize-y"
            placeholder="What are you building, and when do you need it live?"
          />
        </Field>
      </div>

      {state === 'error' && (
        <p className="mt-5 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-sm text-red-300">
          {message}
        </p>
      )}

      <button type="submit" disabled={state === 'sending'} className="btn-signal mt-6 w-full disabled:opacity-60">
        {state === 'sending' ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-void/30 border-t-void" />
            Sending
          </>
        ) : (
          'Send message'
        )}
      </button>

      <p className="mt-4 text-center text-body-sm text-muted">
        We only use your details to reply. No lists, no sharing.
      </p>
    </form>
  )
}
