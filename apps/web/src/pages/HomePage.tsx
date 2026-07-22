import { Container } from '@/components/ui/Container'

export function HomePage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          OpenDevX
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Cloud Native Internal Developer Platform
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Platform Status
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Navigation
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
          </div>
        </div>
      </div>
    </Container>
  )
}
