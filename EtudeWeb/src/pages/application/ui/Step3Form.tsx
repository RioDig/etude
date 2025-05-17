import React, { useEffect, useState } from 'react'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Add, Delete } from '@mui/icons-material'
import { useApplicationStore, Approver } from '@/entities/application/model/applicationStore'
import { AutocompleteSelect } from '@/shared/ui/autocompleteSelect'
import { Employee } from '@/shared/api/employeeAutocomplete'

interface Step3FormProps {
  onValidChange: (isValid: boolean) => void
}

export const Step3Form: React.FC<Step3FormProps> = ({ onValidChange }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()

  const [approvers, setApprovers] = useState<Approver[]>(() => {
    if (currentApplication?.approvers && currentApplication.approvers.length > 0) {
      return currentApplication.approvers
    }
    return [{ id: '1', user_id: '' }]
  })

  const validateForm = () => {
    const isValid = approvers.length > 0 && approvers.every((approver) => approver.user_id !== '')
    onValidChange(isValid)
    return isValid
  }

  useEffect(() => {
    validateForm()
    updateApplicationData({ approvers })
  }, [approvers, updateApplicationData])

  const getExcludeIds = (currentApproverId: string): string[] => {
    return approvers.filter((a) => a.id !== currentApproverId && a.user_id).map((a) => a.user_id)
  }

  const handleAddApprover = () => {
    setApprovers([...approvers, { id: Date.now().toString(), user_id: '' }])
  }

  const handleRemoveApprover = (id: string) => {
    if (approvers.length > 1) {
      setApprovers(approvers.filter((approver) => approver.id !== id))
    }
  }

  const handleApproverChange = (id: string, value: string, employeeData?: Employee) => {
    setApprovers(
      approvers.map((approver) =>
        approver.id === id ? { ...approver, user_id: value, employeeData } : approver
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="b3Regular" className="text-mono-800">
        Выберите согласующих для вашего заявления. Необходимо выбрать хотя бы одного согласующего.
      </Typography>

      <div className="flex flex-col gap-4">
        {approvers.map((approver, index) => (
          <div key={approver.id} className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-mono-200 flex items-center justify-center">
              <Typography variant="b4">{index + 1}</Typography>
            </div>

            <div className="flex-grow">
              <AutocompleteSelect
                value={approver.user_id}
                onChange={(value, employeeData) =>
                  handleApproverChange(approver.id, value, employeeData)
                }
                placeholder="Начните вводить для поиска сотрудника..."
                excludeIds={getExcludeIds(approver.id)}
                initialEmployee={approver.employeeData}
              />
            </div>

            <Button
              variant="third"
              onClick={() => handleRemoveApprover(approver.id)}
              disabled={approvers.length <= 1}
              className="flex-shrink-0"
            >
              <Delete />
            </Button>
          </div>
        ))}

        <div className="mt-2">
          <Button variant="secondary" leftIcon={<Add />} onClick={handleAddApprover}>
            Добавить сотрудника
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Step3Form
