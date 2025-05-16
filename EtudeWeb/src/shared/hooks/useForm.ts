import { useState, useCallback, FormEvent } from 'react'

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit: (values: T) => void
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(options.initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target
      setValues((prev) => ({ ...prev, [name]: value }))
      setTouched((prev) => ({ ...prev, [name]: true }))
    },
    []
  )

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }))
  }, [])

  const validateForm = useCallback(() => {
    if (!options.validate) return {}

    const newErrors = options.validate(values)
    setErrors(newErrors)
    return newErrors
  }, [options, values])

  const handleSubmit = useCallback(
    (event?: FormEvent) => {
      if (event) {
        event.preventDefault()
      }

      const formErrors = validateForm()
      const hasErrors = Object.keys(formErrors).length > 0

      if (!hasErrors) {
        options.onSubmit(values)
      }
    },
    [options, validateForm, values]
  )

  const reset = useCallback(
    (newValues = options.initialValues) => {
      setValues(newValues)
      setErrors({})
      setTouched({})
    },
    [options.initialValues]
  )

  return {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    reset,
    validateForm
  }
}
