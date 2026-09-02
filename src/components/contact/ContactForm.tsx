'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { gsap } from '@/lib/gsap'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './ContactForm.module.scss'

type Fields = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY: Fields = { firstName: '', lastName: '', email: '', phone: '', message: '' }

// Deliberately permissive: the goal is to catch typos, not to police addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: Fields): Errors {
  const errors: Errors = {}
  if (!values.firstName.trim()) errors.firstName = 'Please enter your first name'
  if (!values.lastName.trim()) errors.lastName = 'Please enter your last name'
  if (!values.email.trim()) errors.email = 'Please enter your email'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email'
  if (!values.message.trim()) errors.message = 'Please write us a message'
  return errors
}

/**
 * `c-Contact-form`.
 *
 * Client-side validation only — there is no backend here, so submit resolves
 * against a mocked delay. Swap `submit` for a real POST and everything else
 * (states, focus management, live region) already works.
 */
export function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const uid = useId()

  const fieldId = (name: keyof Fields) => `${uid}-${name}`

  const set = (name: keyof Fields) => (e: { target: { value: string } }) => {
    const next = { ...values, [name]: e.target.value }
    setValues(next)
    // Only re-validate a field the user has already left once, so errors don't
    // appear mid-typing on a field they haven't finished.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }))
    }
  }

  const blur = (name: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [name]: true }))
    const next = validate(values)
    setErrors((prev) => ({ ...prev, [name]: next[name] }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({ firstName: true, lastName: true, email: true, phone: true, message: true })

    if (Object.keys(found).length) {
      // Move the user to the first thing that needs fixing.
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
      first?.focus()
      if (first) {
        gsap.fromTo(
          first.closest(`.${styles.line}`),
          { x: -6 },
          { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' },
        )
      }
      return
    }

    setStatus('submitting')
    try {
      // No backend in this build — see the component docblock.
      await new Promise((resolve) => setTimeout(resolve, 900))
      setStatus('success')
      setValues(EMPTY)
      setTouched({})
    } catch {
      setStatus('error')
    }
  }

  const field = (
    name: keyof Fields,
    label: string,
    { required = false, type = 'text' }: { required?: boolean; type?: string } = {},
  ) => {
    const invalid = Boolean(errors[name] && touched[name])
    return (
      <div className={`${styles.line} t-form-line ${invalid ? 'is-error' : ''}`}>
        <label className="t-h6" htmlFor={fieldId(name)}>
          {label}
          {required && '*'}
        </label>
        <input
          id={fieldId(name)}
          className="t-input--text"
          type={type}
          name={name}
          value={values[name]}
          onChange={set(name)}
          onBlur={blur(name)}
          required={required}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${fieldId(name)}-error` : undefined}
          autoComplete={
            name === 'firstName' ? 'given-name'
            : name === 'lastName' ? 'family-name'
            : name === 'email' ? 'email'
            : name === 'phone' ? 'tel'
            : undefined
          }
        />
        <p className="t-form-error" id={`${fieldId(name)}-error`}>
          {errors[name]}
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} className={`${styles.root} t-form`} onSubmit={submit} noValidate>
      <div className="row middle">
        <div className="col-5of11 col-sm-12of12">
          <div className={styles.info}>
            <h2 className={`${styles.infoTitle} t-h5 t-h5--bold`}>
              <MonopoText>Let’s create</MonopoText>
            </h2>
            <div className="t-text">
              <p>
                Tell us what you&rsquo;re building. We&rsquo;ll tell you how we&rsquo;d
                compose it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.content} row`}>
        <div className="col-5of11 col-sm-12of12">
          {field('firstName', 'First name', { required: true })}
          {field('lastName', 'Last name', { required: true })}
          {field('email', 'Email', { required: true, type: 'email' })}
          {field('phone', 'Phone number', { type: 'tel' })}
        </div>

        <div className="col-5of11 offset-1of11 col-sm-12of12 offset-sm-0">
          <div
            className={`${styles.line} t-form-line ${
              errors.message && touched.message ? 'is-error' : ''
            }`}
          >
            <label className="t-h6" htmlFor={fieldId('message')}>Your message*</label>
            <textarea
              id={fieldId('message')}
              className={`${styles.textarea} t-textarea`}
              name="message"
              rows={8}
              value={values.message}
              onChange={set('message')}
              onBlur={blur('message')}
              required
              aria-invalid={Boolean(errors.message && touched.message)}
              aria-describedby={
                errors.message && touched.message ? `${fieldId('message')}-error` : undefined
              }
            />
            <p className="t-form-error" id={`${fieldId('message')}-error`}>
              {errors.message}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.foot}>
        <button
          type="submit"
          className={`${styles.btn} t-btn-primary t-btn-primary--black`}
          disabled={status === 'submitting'}
        >
          <span>{status === 'submitting' ? 'Sending…' : 'Submit'}</span>
          <span className="t-btn-primary-arrow" aria-hidden="true">→</span>
        </button>

        <p className={styles.status} role="status" aria-live="polite">
          {status === 'success' && (
            <span className={styles.valid}>Thank you for your message</span>
          )}
          {status === 'error' && (
            <span className={styles.error}>Sorry, an error occured… please try again</span>
          )}
        </p>
      </div>
    </form>
  )
}
