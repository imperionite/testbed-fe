import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

/**
 * Hook for managing form validation, lifecycle, and submission logic.
 * Isolates validation integration (Zod), payload filtering (RBAC), and API interactions.
 *
 * @param {Object} params - Hook parameters
 * @param {string} params.resourceName - Name of the resource (e.g, 'user', 'attendance', etc.)
 * @param {string} params.mode - Current modal/form mode ('create' | 'edit' | 'view')
 * @param {Object|null} params.entity - The active entity being viewed/edited, null for create mode
 * @param {Object} params.schema - Zod validation schema for the current mode
 * @param {Array} params.fieldConfig - Configuration fields containing metadata and RBAC definitions
 * @param {string} [params.role] - Current active user's role (for RBAC filtering fallback)
 * @param {Function} [params.getFieldRule] - Direct function to determine field rules: (field, role, mode) => rule
 * @param {Object} [params.permissions] - Active permission flags (e.g., { canSubmit: boolean })
 * @param {Object} [params.defaultValues] - Standard fallback default values
 * @param {Function} params.onSubmit - Async submission callback that receives the filtered payload
 * @param {Function} params.onSuccess - Callback triggered after successful form submission
 *
 * @returns {Object} Form registration methods, submit handler, saving state, and error message
 */
export function useFormSubmission({
  resourceName = 'item',
  mode,
  entity,
  schema,
  fieldConfig = [],
  role,
  getFieldRule,
  permissions = { canSubmit: true },
  defaultValues,
  onSubmit,
  onSuccess,
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  // Initialize react-hook-form with Zod resolver if schema is provided
  const formMethods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: entity ? { ...entity } : defaultValues || {},
    mode: 'onChange',
  })
  const { reset } = formMethods

  // Helper to determine the RBAC rule of a field ('hidden', 'readonly', 'required', 'editable')
  const getRule = useCallback(
    (field) => {
      if (getFieldRule) {
        return getFieldRule(field, role, mode)
      }
      if (field.rbac && role) {
        const roleRules = field.rbac[role]
        return roleRules ? roleRules[mode] : 'editable'
      }
      return 'editable'
    },
    [getFieldRule, role, mode],
  )

  // Synchronize form states when the active entity or mode changes
  useEffect(() => {
    if (entity) {
      // Pre-fill fields with active entity values in edit/view modes
      reset({ ...entity })
    } else {
      // Revert to default blank state for create mode
      reset(defaultValues || {})
    }
  }, [entity, mode, defaultValues, reset])

  /**
   * Submission workflow handler.
   * Validates values, strips hidden or read-only fields based on current permissions, handles async status, and catches API response rejections.
   */
  const handleSubmit = useCallback(
    async (formData) => {
      // 1. Guard against unauthorized submissions
      if (permissions && permissions.canSubmit === false) {
        setError('You do not have permission to submit this form.')
        return
      }

      // 2. Extra safety Zod client-side validation
      if (schema) {
        const validationResult = schema.safeParse(formData)
        if (!validationResult.success) {
          const errorMsg = validationResult.error.errors
            .map((err) => `${err.path.join('.')}: ${err.message}`)
            .join(', ')
          setError(`Validation failed: ${errorMsg}`)
          return
        }
      }

      // 3. Filter payload - strip hidden and readonly fields from submission payload
      const payload = {}
      for (const field of fieldConfig) {
        const rule = getRule(field)

        if (rule !== 'hidden') {
          // Exclude readonly fields in EDIT mode to prevent tampering with un-editable state (e.g. username)
          if (mode === 'edit' && rule === 'readonly') {
            continue
          }

          if (formData[field.name] !== undefined) {
            payload[field.name] = formData[field.name]
          }
        }
      }

      // If all configured fields were stripped, abort
      if (Object.keys(payload).length === 0 && fieldConfig.length > 0) {
        setError('No modifiable form fields were submitted.')
        return
      }

      setIsSaving(true)
      setError(null)

      try {
        // 4. Delegate mutation to parent API container
        await onSubmit(payload)

        // 5. Trigger post-submission success callbacks (like closing modal and notifying)
        if (onSuccess) {
          await onSuccess(payload)
        }
      } catch (submitError) {
        console.error('Form submission failed:', submitError)

        // Extract detailed server validation errors if present
        const serverMsg =
          submitError?.response?.data?.message ||
          submitError?.message ||
          `An error occurred while saving the ${resourceName}.`
        setError(serverMsg)
      } finally {
        setIsSaving(false)
      }
    },
    [permissions, schema, fieldConfig, getRule, mode, onSubmit, onSuccess, resourceName],
  )

  return {
    formMethods,
    isSaving,
    error,
    setError,
    onSubmit: handleSubmit,
  }
}

export default useFormSubmission
