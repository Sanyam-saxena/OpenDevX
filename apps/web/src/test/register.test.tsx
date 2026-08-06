import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/providers/AuthProvider'
import { RegisterPage } from '@/pages/RegisterPage'
import * as authApi from '@/services/authApi'
import type { User } from '@/types/api'

vi.mock('@/services/authApi', () => ({
  registerApi: vi.fn(),
  loginApi: vi.fn(),
  getMeApi: vi.fn(),
}))

describe('RegisterPage', () => {
  it('automatically logs in and navigates to dashboard after successful registration', async () => {
    const mockUser: User = {
      id: '123',
      email: 'newuser@example.com',
      full_name: 'New User',
      role: 'viewer',
      is_active: true,
      is_superuser: false,
      created_at: '2026-08-05T00:00:00Z',
      updated_at: '2026-08-05T00:00:00Z',
    }

    vi.mocked(authApi.registerApi).mockResolvedValueOnce(mockUser)
    vi.mocked(authApi.loginApi).mockResolvedValueOnce({
      access_token: 'fake-access-token',
      refresh_token: 'fake-refresh-token',
      token_type: 'bearer',
      user: mockUser,
    })

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    const nameInput = screen.getByPlaceholderText('Jane Doe')
    const emailInput = screen.getByPlaceholderText('jane@company.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'New User')
    await user.type(emailInput, 'newuser@example.com')
    await user.type(passwordInput, 'Password123!')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authApi.registerApi).toHaveBeenCalledWith(
        'newuser@example.com',
        'Password123!',
        'New User',
      )
      expect(authApi.loginApi).toHaveBeenCalledWith(
        'newuser@example.com',
        'Password123!',
      )
    })

    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument()
  })
})
