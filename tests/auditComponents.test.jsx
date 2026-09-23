// import { render, screen } from '@testing-library/react'
// import { describe, it, expect } from 'vitest'
// import AuditTable from '../src/features/audit/components/AuditTable'

// describe('Audit Module Components', () => {
//   it('renders AuditTable', () => {
//     const data = [
//       {
//         created_at: '2026-09-14T00:00:00Z',
//         action: 'LOGIN',
//         resource_type: 'AUTH',
//         resource_id: '1',
//         user_id: 'user1',
//         ip_address: '127.0.0.1',
//       },
//     ]
//     render(<AuditTable data={data} />)
//     expect(screen.getByText(/LOGIN/i)).toBeDefined()
//   })
// })

//Mocked version
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AuditTable from '../src/features/audit/components/AuditTable'

// Mock usersApi
vi.mock('../src/api/users', () => ({
  usersApi: {
    listUsers: vi
      .fn()
      .mockResolvedValue([
        { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      ]),
  },
}))

describe('Audit Module Components', () => {
  it('renders AuditTable', async () => {
    const data = [
      {
        created_at: '2026-09-14T00:00:00Z',
        action: 'LOGIN',
        resource_type: 'AUTH',
        resource_id: '1',
        user_id: 'user1',
        ip_address: '127.0.0.1',
      },
    ]

    render(<AuditTable data={data} />)

    expect(await screen.findByText(/LOGIN/i)).toBeDefined()
  })
})
