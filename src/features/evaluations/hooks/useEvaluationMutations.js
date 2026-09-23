import { useMutation, useQueryClient } from '@tanstack/react-query'
import { evaluationsApi } from '../../../api/evaluations'

export function useEvaluationMutations() {
  const queryClient = useQueryClient()
  const invalidateEvaluations = () => queryClient.invalidateQueries({ queryKey: ['evaluations'] })

  const createEvaluation = useMutation({
    mutationFn: (payload) => evaluationsApi.createEvaluation(payload),
    onSuccess: invalidateEvaluations,
  })

  const updateEvaluation = useMutation({
    mutationFn: ({ id, payload }) => evaluationsApi.updateEvaluation(id, payload),
    onSuccess: invalidateEvaluations,
  })

  const submitEvaluation = useMutation({
    mutationFn: ({ id }) => evaluationsApi.submitEvaluation(id),
    onSuccess: invalidateEvaluations,
  })

  // const bulkSubmitEvaluations = useMutation({
  //   mutationFn: ({ ids }) =>
  //     Promise.all(ids.map((id) => evaluationsApi.submitEvaluation(id))),
  //   onSuccess: invalidateEvaluations,
  // });

  return {
    createEvaluation,
    updateEvaluation,
    submitEvaluation,
  }
}
