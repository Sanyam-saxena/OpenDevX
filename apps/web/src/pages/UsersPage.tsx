import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, UserCheck, UserX, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button, Card, Table } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { getUsersApi, updateUserApi } from '@/services/usersApi'
import type { User } from '@/types/api'

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsersApi(page, 10),
  })

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { role?: string; is_active?: boolean } }) =>
      updateUserApi(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Failed to update user'
      toast.error(msg)
    },
  })

  const handleToggleActive = (userItem: User) => {
    if (userItem.id === currentUser?.id) {
      toast.error('Cannot deactivate your own administrator account')
      return
    }
    updateMutation.mutate({
      userId: userItem.id,
      data: { is_active: !userItem.is_active },
    })
  }

  const handleRoleChange = (userItem: User, newRole: string) => {
    if (userItem.id === currentUser?.id && newRole !== 'admin') {
      toast.error('Cannot demote your own administrator role')
      return
    }
    updateMutation.mutate({
      userId: userItem.id,
      data: { role: newRole },
    })
  }

  const filteredUsers =
    usersData?.items?.filter(
      (u) =>
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2f81f7]" />
            User Management ({usersData?.total || 0})
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage platform users, RBAC roles (Viewer, Operator, Admin), and account active status.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] pl-9 pr-3 py-2 rounded-md border border-[var(--border-color)] focus:outline-none focus:border-[#2f81f7] placeholder-[var(--text-secondary)] transition-colors"
            aria-label="Search users"
          />
        </div>
      </div>

      {/* Users Data Table */}
      <Card padded={false}>
        <Table<User>
          keyExtractor={(u) => u.id}
          isLoading={isLoading}
          columns={[
            {
              key: 'user',
              header: 'USER',
              render: (u) => (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#2f81f7] text-white font-bold text-xs flex items-center justify-center">
                    {u.full_name ? u.full_name[0] : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">{u.full_name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{u.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'role',
              header: 'RBAC ROLE',
              render: (u) => (
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u, e.target.value)}
                  className="bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] border border-[var(--border-color)] rounded px-2.5 py-1 focus:outline-none focus:border-[#2f81f7]"
                  aria-label={`Role for ${u.full_name}`}
                >
                  <option value="viewer">viewer</option>
                  <option value="operator">operator</option>
                  <option value="admin">admin</option>
                </select>
              ),
            },
            {
              key: 'is_active',
              header: 'STATUS',
              render: (u) => (
                <Badge variant={u.is_active ? 'success' : 'danger'}>
                  {u.is_active ? 'active' : 'disabled'}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: 'ACTIONS',
              className: 'text-right',
              render: (u) => (
                <Button
                  variant={u.is_active ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleActive(u)}
                  leftIcon={u.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                >
                  {u.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              ),
            },
          ]}
          data={filteredUsers}
        />
      </Card>

      {/* Pagination Controls */}
      {usersData && usersData.pages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs text-[var(--text-secondary)]">
          <span>
            Page {usersData.page} of {usersData.pages} ({usersData.total} total users)
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= usersData.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
