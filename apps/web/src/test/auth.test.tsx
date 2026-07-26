import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/providers/AuthProvider'
import { useAuth } from '@/hooks/useAuth'

function TestAuthConsumer() {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'guest'}</span>
      {user && <span data-testid="user-email">{user.email}</span>}
    </div>
  )
}

describe('AuthProvider & useAuth', () => {
  it('renders child component and provides unauthenticated guest status initially', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>,
    )

    expect(await screen.findByTestId('auth-status')).toHaveTextContent('guest')
  })
})
