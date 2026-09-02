import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects } from '@/data/projects'
import { ProjectDetail } from '@/components/work/ProjectDetail'

/**
 * Client detail route.
 *
 * TITA's own site does not publish per-client case studies, so this is built
 * from the portfolio data that does exist — client, collection and service tags.
 * It exists chiefly so every card resolves: the grid links here from three
 * separate places.
 */

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: project.title,
    description: `${project.title} — ${project.categories.join(', ')}. ${project.collection} collection, by TITA.`,
    ...(project.image ? { openGraph: { images: [project.image] } } : {}),
  }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  return (
    <ProjectDetail
      project={projects[index]}
      next={projects[(index + 1) % projects.length]}
    />
  )
}
