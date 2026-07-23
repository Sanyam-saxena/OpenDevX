import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        404
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
