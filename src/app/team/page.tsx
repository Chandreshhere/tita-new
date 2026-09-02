import type { Metadata } from 'next'
import { TeamHero } from '@/components/team/TeamHero'
import { TeamGrid } from '@/components/team/TeamGrid'
import { TeamHistory } from '@/components/team/TeamHistory'
import { TeamNetwork } from '@/components/team/TeamNetwork'
import { StudioGallery } from '@/components/team/StudioGallery'
import { TeamCollective } from '@/components/team/TeamCollective'

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Two cities. Two energies. One vision. TITA was founded in Indore by Ghazal Somaiya and Naamdasi Patel, and now works from Ahmedabad too.',
}

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <TeamGrid />
      <TeamCollective />
      <TeamHistory />
      <TeamNetwork />
      <StudioGallery />
    </>
  )
}
