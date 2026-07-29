import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

function renderWithProviders(ui: React.ReactNode, initialEntries = ['/']) {
  return render(
    <ThemeProvider>
      <QueryClientProvider client={makeQueryClient()}>
        <AuthProvider>
          <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}

describe('HomePage', () => {
  it('renders the application name', () => {
    renderWithProviders(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /engineered for developer velocity/i }),
    ).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderWithProviders(<HomePage />)
    expect(
      screen.getByText(/opendevx provides unified project management/i),
    ).toBeInTheDocument()
  })

  it('renders the platform status overview card', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/platform status/i)).toBeInTheDocument()
  })
})

describe('NotFoundPage', () => {
  it('renders the 404 heading', () => {
    renderWithProviders(<NotFoundPage />, ['/missing'])
    expect(
      screen.getByRole('heading', { level: 1, name: /page not found/i }),
    ).toBeInTheDocument()
  })

  it('renders a link back to home', () => {
    renderWithProviders(<NotFoundPage />, ['/missing'])
    const link = screen.getByRole('link', { name: /back to home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})

describe('ThemeProvider', () => {
  it('mounts without errors', () => {
    const { container } = render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>,
    )
    expect(container).toBeInTheDocument()
  })
})

describe('QueryProvider', () => {
  it('mounts without errors', () => {
    const { container } = render(
      <QueryClientProvider client={makeQueryClient()}>
        <span>child</span>
      </QueryClientProvider>,
    )
    expect(container).toBeInTheDocument()
  })
})

describe('App shell', () => {
  it('renders the home page content at root', () => {
    renderWithProviders(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /engineered for developer velocity/i }),
    ).toBeInTheDocument()
  })
})
