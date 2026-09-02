import type { Metadata } from 'next'
import { ContactColumns } from '@/components/contact/ContactColumns'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Ready to compose your renaissance? Have an idea in mind? Let's connect and explore how we can help bring it to life.",
}

export default function ContactPage() {
  return <ContactColumns />
}
