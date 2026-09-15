import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DocumentUploader from '../src/features/documents/components/DocumentUploader'
import DocumentItem from '../src/features/documents/components/DocumentItem'

// Mock the hook
vi.mock('../src/features/documents/hooks/useDocumentMutations', () => ({
  useDocumentMutations: vi.fn(() => ({
    uploadDocument: { mutateAsync: vi.fn(), isLoading: false },
  })),
}))

describe('Document Module Components', () => {
  it('renders DocumentUploader', () => {
    render(<DocumentUploader internshipId="123" />)
    expect(screen.getByText(/Upload Document/i)).toBeDefined()
  })

  it('renders DocumentItem', () => {
    const doc = {
      id: '1',
      document_type: 'resume',
      file_name: 'test.pdf',
      status: 'pending',
      uploaded_at: '2026-09-14T00:00:00Z',
    }
    render(<DocumentItem document={doc} />)
    expect(screen.getByText(/RESUME/i)).toBeDefined()
  })
})
