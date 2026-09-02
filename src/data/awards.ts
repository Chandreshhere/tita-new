export type Award = {
  date: string
  publication: string
  project: string
  url: string
}

/**
 * TITA does not publish a press index, so this table carries the studio's own
 * "Work Process" — the three stages it takes every engagement through — in the
 * same editorial table the reference layout uses for recognition.
 */
export const awards: Award[] = []

export type ProcessStep = { number: string; title: string; body: string }

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Research & Define',
    body: 'We begin by understanding the problem, the users, and the business goals from start to finish.',
  },
  {
    number: '02',
    title: 'Ideate & Design',
    body: 'We craft clear, user-friendly flows and high-fidelity interfaces, then pressure-test them against the numbers.',
  },
  {
    number: '03',
    title: 'Test & Implement',
    body: 'Refining the final solution, testing usability, and handing off assets for development and launch.',
  },
]
