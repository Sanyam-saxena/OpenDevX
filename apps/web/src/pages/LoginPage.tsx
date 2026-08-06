import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail, Terminal } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Card, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(email, password)
      toast.success('Successfully authenticated', {
        description: 'Welcome back to OpenDevX Platform',
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } }
      const detail = axiosError?.response?.data?.detail
      const errorMessage =
        typeof detail === 'string'
          ? detail
          : 'Invalid email or password.'
      setError(errorMessage)
      toast.error('Authentication failed', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)] backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-emerald-50 dark:bg-[#238636]/15 text-emerald-600 dark:text-[#3fb950] border border-emerald-200 dark:border-[#238636]/30 rounded-xl mb-3 shadow-xs">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Sign in to OpenDevX
          </h1>
          <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
            Enterprise Developer Platform Console
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-md bg-red-50 dark:bg-[#da3633]/10 border border-red-200 dark:border-[#da3633]/30 p-3 text-xs text-red-700 dark:text-[#f85149] font-semibold" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="EMAIL ADDRESS"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="developer@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="PASSWORD"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2 py-2.5"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-5 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
          New to OpenDevX?{' '}
          <Link
            to="/register"
            className="font-bold text-[var(--accent-color)] hover:underline"
          >
            Create an account
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}
