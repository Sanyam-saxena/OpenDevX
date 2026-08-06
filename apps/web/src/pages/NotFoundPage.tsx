import { Link } from 'react-router-dom'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { Button, Card } from '@/components/ui'

export function NotFoundPage() {
  return (
    <Card className="w-full max-w-md p-8 text-center bg-[var(--bg-secondary)] border-[var(--border-color)]">
      <div className="flex flex-col items-center">
        <div className="p-3 bg-[var(--bg-surface)] rounded-full text-[var(--text-secondary)] mb-4">
          <FileQuestion className="w-10 h-10" />
        </div>
        <span className="text-xs font-mono text-[#58a6ff] uppercase tracking-widest">
          404
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Page not found
        </h1>
        <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
          The page you are looking for does not exist.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
