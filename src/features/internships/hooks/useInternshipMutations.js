import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { internshipsApi } from '../../../api/internships'

export function useInternships(options = {}) {
  return useQuery({
    queryKey: ['internships'],
    queryFn: () => internshipsApi.listInternships(),
    ...options,
  })
}

export function useInternshipMutations() {
  const queryClient = useQueryClient()

  const invalidateInternshipRelatedQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['internships'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['students'],
      }),
    ])
  }

  const createInternship = useMutation({
    mutationFn: (payload) => internshipsApi.createInternship(payload),
    onSuccess: invalidateInternshipRelatedQueries,
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => internshipsApi.updateInternshipStatus(id, status),
    onSuccess: invalidateInternshipRelatedQueries,
  })

  const bulkUpdateStatus = useMutation({
    mutationFn: ({ ids, status }) =>
      Promise.all(ids.map((id) => internshipsApi.updateInternshipStatus(id, status))),
    onSuccess: invalidateInternshipRelatedQueries,
  })

  const updateInternship = useMutation({
    mutationFn: ({ id, payload }) => internshipsApi.updateInternship(id, payload),
    onSuccess: invalidateInternshipRelatedQueries,
  })

  const assignAdviser = useMutation({
    mutationFn: ({ id, facultyAdviserId }) =>
      internshipsApi.assignFacultyAdviser(id, facultyAdviserId),
    onSuccess: invalidateInternshipRelatedQueries,
  })

  return {
    createInternship,
    updateStatus,
    bulkUpdateStatus,
    updateInternship,
    assignAdviser,
  }
}
