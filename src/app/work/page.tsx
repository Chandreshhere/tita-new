import type { Metadata } from 'next'
import { WorkIntro } from '@/components/work/WorkIntro'
import { WorkGrid } from '@/components/work/WorkGrid'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    "We don't run ads. We orchestrate movements. We don't design posts. We paint legacies. Selected work across Renaissance, Amplify, Compose, Ignite and Genesis.",
}

export default function WorkPage() {
  return (
    <>
      <WorkIntro />
      <WorkGrid />
    </>
  )
}
