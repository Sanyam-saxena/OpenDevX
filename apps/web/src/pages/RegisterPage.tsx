import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail, ShieldCheck, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Card, Input } from '@/components/ui'
import { registerApi } from '@/services/authApi'
import { useAuth } from '@/hooks/useAuth'

function getPasswordStrength(pwd: string): { label: string; color: string; score: number } {
  if (!pwd) return { label: '', color: 'bg-transparent', score: 0 }
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) return { label: 'Weak', color: 'bg-[#da3633]', score: 25 }
  if (score <= 3) return { label: 'Moderate', color: 'bg-[#d29922]', score: 65 }
  return { label: 'Strong', color: 'bg-[#238636]', score: 100 }
}

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pwdStrength = getPasswordStrength(password)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await registerApi(email, password, fullName)
      await login(email, password)
      toast.success('Account created successfully', {
        description: 'Welcome to OpenDevX Platform!',
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } } }
      const detail = axiosError?.response?.data?.detail
      const errorMessage =
        typeof detail === 'string'
          ? detail
          : 'Registration failed. Check registration details and try again.'
      setError(errorMessage)
      toast.error('Registration failed', {
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
          <div className="p-3 bg-blue-50 dark:bg-[#2f81f7]/15 text-blue-700 dark:text-[#58a6ff] border border-blue-200 dark:border-[#2f81f7]/30 rounded-xl mb-3 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Create Developer Account
          </h1>
          <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
            Join the OpenDevX Developer Platform
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-md bg-red-50 dark:bg-[#da3633]/10 border border-red-200 dark:border-[#da3633]/30 p-3 text-xs text-red-700 dark:text-[#f85149] font-semibold" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="FULL NAME"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="WORK EMAIL"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div>
            <Input
              label="PASSWORD"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-[10px] text-[var(--text-secondary)]">
                  <span>Password Strength</span>
                  <span className="font-semibold text-[var(--text-primary)]">{pwdStrength.label}</span>
                </div>
                <div className="h-1 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                    style={{ width: `${pwdStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-3 py-2.5"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-8 pt-5 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-[var(--accent-color)] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}
