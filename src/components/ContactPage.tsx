import { useState } from 'react';
import type { FormEvent } from 'react';

type Status =
  | { type: 'idle'; message: '' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

const defaultStatus: Status = { type: 'idle', message: '' };

const responseHighlights = [
  {
    label: 'Response time',
    value: 'Under 24 hours',
    copy: 'Dedicated coordinators route your request to the right finance pod.'
  },
  {
    label: 'Email us',
    value: 'hello@xceltax.com',
    copy: 'Prefer async? Drop us a note and we’ll follow up with resources.',
    href: 'mailto:hello@xceltax.com'
  }
];

const timelineSteps = [
  {
    title: 'Discovery',
    copy: 'We align on your goals, current systems, and timeline in a 30-minute call with a lead strategist.'
  },
  {
    title: 'Blueprint',
    copy: 'Within 48 hours we deliver a tailored scope, cost, and rollout plan across taxes, payroll, and books.'
  },
  {
    title: 'Activation',
    copy: 'We assemble your dedicated pod, connect tools, and begin onboarding within the first week.'
  }
];

const supportLinks = [
  { href: '#', label: 'Open client workspace' },
  { href: 'mailto:support@xceltax.com', label: 'support@xceltax.com' }
];

export default function ContactPage() {
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(defaultStatus);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        throw new Error(result?.error ?? 'Unable to send message');
      }

      form.reset();
      setStatus({
        type: 'success',
        message: 'Thanks! We received your message and will respond within one business day.'
      });
    } catch (error) {
      console.error('Contact form submission failed', error);
      setStatus({
        type: 'error',
        message: 'Something went wrong while sending your message. Please try again, or email hello@xceltax.com.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-[#0a112c] py-24 text-slate-100">
        <div className="pointer-events-none absolute -left-24 top-[-35%] h-[520px] w-[520px] rounded-full bg-primary/35 blur-3xl" />
        <div className="pointer-events-none absolute right-[-20%] top-10 h-[520px] w-[520px] rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a112c] to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                Contact
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Let’s design a proactive finance plan around the way you work.
              </h1>
              <p className="text-lg text-slate-300">
                Share a few details and we’ll match you with a specialist pod. We typically respond within one business day with next
                steps and a tailored agenda for your strategy session.
              </p>
              <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
                <div className="grid gap-6 sm:grid-cols-2">
                  {responseHighlights.map(({ label, value, copy, href }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-accent transition hover:text-accent/80"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                      )}
                      <p className="mt-2 text-sm text-slate-300">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 p-8 shadow-[0_40px_80px_-50px_rgba(9,14,36,0.8)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <form
                className="relative space-y-6"
                method="post"
                action="/.netlify/functions/contact-email"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-white/80">
                    First name
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Jordan"
                      className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-accent/60 focus:bg-white/15"
                    />
                  </label>
                  <label className="block text-sm font-medium text-white/80">
                    Last name
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Rivera"
                      className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-accent/60 focus:bg-white/15"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-white/80">
                  Work email
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@studio.co"
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-accent/60 focus:bg-white/15"
                  />
                </label>

                <label className="block text-sm font-medium text-white/80">
                  Company name
                  <input
                    type="text"
                    name="company"
                    placeholder="Studio Nimbus"
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-accent/60 focus:bg-white/15"
                  />
                </label>

                <label className="block text-sm font-medium text-white/80">
                  Current annual revenue
                  <select
                    name="revenue"
                    defaultValue=""
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-accent/60 focus:bg-white/15"
                  >
                    <option value="" className="bg-slate-900 text-slate-900">
                      Select a range
                    </option>
                    <option value="under-250k" className="bg-slate-900 text-slate-100">
                      $0 – $250k
                    </option>
                    <option value="250-750k" className="bg-slate-900 text-slate-100">
                      $250k – $750k
                    </option>
                    <option value="750-1_5m" className="bg-slate-900 text-slate-100">
                      $750k – $1.5M
                    </option>
                    <option value="1_5m-plus" className="bg-slate-900 text-slate-100">
                      $1.5M+
                    </option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-white/80">
                  What should we focus on?
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your goals, timeline, and any current gaps we should know about."
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-accent/60 focus:bg-white/15"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-base font-semibold text-slate-900 shadow-[0_30px_60px_-35px_rgba(255,137,166,0.8)] transition-transform duration-200 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending…' : 'Submit and book strategy call'}
                </button>

                {status.type !== 'idle' && (
                  <p
                    className={`text-center text-sm ${
                      status.type === 'success' ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {status.message}
                  </p>
                )}

                <p className="text-center text-xs text-white/70">
                  By submitting, you agree to receive updates from Xceltax. We’ll handle your info with care and never spam.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f5f6ff] to-white py-24">
        <div className="pointer-events-none absolute left-[5%] top-[-20%] h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute right-[15%] bottom-[-25%] h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">What happens after you reach out?</h2>
              <p className="mt-4 text-lg text-slate-600">
                We compress what used to be weeks of back-and-forth into three clear steps so you can make a confident decision fast.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {timelineSteps.map(({ title, copy }, index) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_45px_-40px_rgba(79,61,255,0.6)]"
                  >
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2.25rem] border border-slate-200/60 bg-white/80 p-8 shadow-[0_40px_80px_-60px_rgba(79,61,255,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Need something else?</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">Existing client support</h3>
              <p className="mt-3 text-sm text-slate-600">
                Already working with us? Jump into your client workspace or message us in the shared Slack channel for the fastest
                response.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                {supportLinks.map(({ href, label }) => (
                  <a
                    key={label}
                    className="block rounded-2xl border border-slate-200/70 bg-white px-4 py-3 font-semibold text-primary transition hover:-translate-y-0.5 hover:border-primary/40"
                    href={href}
                  >
                    {label}
                  </a>
                ))}
              </div>
              <p className="mt-8 text-xs text-slate-500">Support coverage: 7 days a week · 8am–8pm PT</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
