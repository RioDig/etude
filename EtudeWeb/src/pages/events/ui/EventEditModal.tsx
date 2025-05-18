import React, { useState, useEffect } from 'react'
import { Modal } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { Spinner } from '@/shared/ui/spinner'
import { Control } from '@/shared/ui/controls'
import { Stepper } from '@/shared/ui/stepper'

import { notification } from '@/shared/lib/notification'
import { ApplicationDetail, ApplicationUpdate } from '@/shared/types'
import { useUpdateApplication } from '@/entities/event'
import { AutocompleteSelect } from '@/shared/ui/autocompleteSelect'
import { CourseTypeLabels } from '@/shared/labels/courseType'
import { CourseFormatLabels } from '@/shared/labels/courseFormat'
import { Typography } from '@/shared/ui/typography'
import { Add, Delete } from '@mui/icons-material'
import { Employee } from '@/shared/api/employeeAutocomplete.ts'
import { Approver } from '@/entities/application'

interface EventEditModalProps {
  isOpen: boolean
  onClose: () => void
  eventDetails: ApplicationDetail
}

export const EventEditModal: React.FC<EventEditModalProps> = ({
  isOpen,
  onClose,
  eventDetails
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const [formValues, setFormValues] = useState<ApplicationUpdate>({})
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [approvers, setApprovers] = useState<Approver[]>([{ id: '1', user_id: '' }])

  const updateMutation = useUpdateApplication()

  useEffect(() => {
    if (eventDetails && isOpen) {
      const initialFormValues = {
        name: eventDetails.course.course_name,
        description: eventDetails.course.course_description,
        type: eventDetails.course.course_type,
        track: eventDetails.course.course_track,
        format: eventDetails.course.course_format,
        trainingCenter: eventDetails.course.course_trainingCenter,
        startDate: eventDetails.course.course_startDate,
        endDate: eventDetails.course.course_endDate,
        link: eventDetails.course.course_link,
        price:
          typeof eventDetails.course.course_price === 'number'
            ? String(eventDetails.course.course_price)
            : (eventDetails.course.course_price as string),
        educationGoal: eventDetails.course.course_educationGoal
      }

      setFormValues(initialFormValues)

      setStartDate(
        eventDetails.course.course_startDate ? new Date(eventDetails.course.course_startDate) : null
      )
      setEndDate(
        eventDetails.course.course_endDate ? new Date(eventDetails.course.course_endDate) : null
      )

      if (eventDetails.approvers && eventDetails.approvers.length > 0) {
        const preparedApprovers = eventDetails.approvers.map((user) => ({
          id: user.id,
          user_id: user.id,
          employeeData: {
            id: user.id,
            surname: user.surname,
            patronymic: user.patronymic,
            name: user.name,
            position: user.position || '',
            department: user.department || ''
          }
        }))
        setApprovers(preparedApprovers)
      } else {
        setApprovers([{ id: '1', user_id: '' }])
      }
    }
  }, [eventDetails, isOpen])

  const handleFormChange = (field: keyof ApplicationUpdate, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    if (!eventDetails) return

    if (
      !startDate ||
      !endDate ||
      !formValues.trainingCenter ||
      !formValues.price ||
      !formValues.educationGoal
    ) {
      notification.error({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля'
      })
      return
    }

    if (!hasValidApprovers()) {
      notification.error({
        title: 'Ошибка',
        description: 'Необходимо выбрать хотя бы одного согласующего'
      })
      return
    }

    const approverIds = approvers
      .filter(
        (approver) => approver.user_id && approver.user_id.trim() !== '' && approver.employeeData
      )
      .map((approver) => approver.user_id)

    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0]
    }

    const userId = eventDetails.course.course_learner?.id || ''

    const updatedFormValues = {
      ...formValues,
      startDate: startDate ? formatDate(startDate) : '',
      endDate: endDate ? formatDate(endDate) : '',
      approvers: approverIds,
      learner_id: userId,
      author_id: userId
    }

    updateMutation.mutate(
      {
        id: eventDetails.application_id,
        data: updatedFormValues
      },
      {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Заявка успешно обновлена'
          })
          onClose()
        },
        onError: (error) => {
          notification.error({
            title: 'Ошибка',
            description: `Не удалось обновить заявку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
          })
        }
      }
    )
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
      approvers.map((approver) => {
        // Если value пустая, сбрасываем и user_id и employeeData
        if (approver.id === id) {
          return value
            ? { ...approver, user_id: value, employeeData }
            : { ...approver, user_id: '', employeeData: undefined }
        }
        return approver
      })
    )
  }

  const hasValidApprovers = () => {
    return approvers.some(
      (approver) => approver.user_id && approver.user_id.trim() !== '' && approver.employeeData
    )
  }

  // Функция получения списка ID для исключения
  const getExcludeIds = (currentApproverId: string) => {
    return approvers
      .filter((approver) => approver.id !== currentApproverId && approver.user_id)
      .map((approver) => approver.user_id)
  }

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (
        !startDate ||
        !endDate ||
        !formValues.trainingCenter ||
        !formValues.price ||
        !formValues.educationGoal
      ) {
        notification.error({
          title: 'Ошибка',
          description:
            'Пожалуйста, заполните все обязательные поля перед переходом к следующему шагу'
        })
        return
      }
    }
    setActiveStep((prev) => Math.min(prev + 1, 2))
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const canGoNext = () => {
    if (activeStep === 0) {
      return !!(formValues.name && formValues.type && formValues.track && formValues.format)
    }

    if (activeStep === 1) {
      return !!(
        formValues.startDate &&
        formValues.endDate &&
        formValues.trainingCenter &&
        formValues.price &&
        formValues.educationGoal
      )
    }

    return true
  }

  const steps = [{ label: 'О мероприятии' }, { label: 'О проведении' }, { label: 'Согласующие' }]

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="flex flex-col gap-4">
            <Control.Select
              label="Тип"
              value={formValues.type || ''}
              onChange={(value) => handleFormChange('type', value)}
              options={Object.entries(CourseTypeLabels).map(([value, label]) => ({ value, label }))}
              required
            />

            <Control.Input
              label="Наименование"
              value={formValues.name || ''}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
            />

            <Control.Select
              label="Направление"
              value={formValues.track || ''}
              onChange={(value) => handleFormChange('track', value)}
              options={[
                { value: 'HardSkills', label: 'Hard Skills' },
                { value: 'SoftSkills', label: 'Soft Skills' },
                { value: 'ManagementSkills', label: 'Management Skills' }
              ]}
              required
            />

            <Control.Select
              label="Формат"
              value={formValues.format || ''}
              onChange={(value) => handleFormChange('format', value)}
              options={Object.entries(CourseFormatLabels).map(([value, label]) => ({
                value,
                label
              }))}
              required
            />

            <Control.Input
              label="Ссылка"
              value={formValues.link || ''}
              onChange={(e) => handleFormChange('link', e.target.value)}
              placeholder="Введите ссылку"
            />

            <Control.Textarea
              label="Описание"
              value={formValues.description || ''}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Введите описание"
              rows={4}
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Control.DateInput
                label="Дата начала"
                value={startDate}
                onChange={(date) => {
                  setStartDate(date)
                  if (date) handleFormChange('startDate', date.toISOString())
                }}
                required
              />

              <Control.DateInput
                label="Дата окончания"
                value={endDate}
                onChange={(date) => {
                  setEndDate(date)
                  if (date) handleFormChange('endDate', date.toISOString())
                }}
                required
              />
            </div>

            <Control.Input
              label="Учебный центр"
              value={formValues.trainingCenter || ''}
              onChange={(e) => handleFormChange('trainingCenter', e.target.value)}
              placeholder="Введите название учебного центра"
              required
            />

            <Control.Input
              label="Стоимость"
              value={formValues.price?.toString() || ''}
              onChange={(e) => handleFormChange('price', e.target.value)}
              type="number"
              placeholder="Введите стоимость"
              required
            />

            <Control.Textarea
              label="Цель обучения"
              value={formValues.educationGoal || ''}
              onChange={(e) => handleFormChange('educationGoal', e.target.value)}
              placeholder="Введите цель обучения"
              rows={3}
              required
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Typography variant="b3Regular" className="text-mono-800">
              Выберите согласующих для вашего заявления. Необходимо выбрать хотя бы одного
              согласующего.
            </Typography>

            <div className="flex flex-col gap-4">
              {approvers.map((approver, index) => (
                <div key={approver.id} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-mono-200 flex items-center justify-center">
                    <Typography variant="b4">{index + 1}</Typography>
                  </div>

                  <div className="flex-grow">
                    <AutocompleteSelect
                      value={approver.user_id || ''}
                      onChange={(value, employeeData) =>
                        handleApproverChange(approver.id, value, employeeData)
                      }
                      placeholder="Начните вводить для поиска сотрудника..."
                      excludeIds={getExcludeIds(approver.id)}
                      initialEmployee={approver.employeeData}
                      required
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

      default:
        return null
    }
  }

  if (!eventDetails) return null

  const activeStepText = (step: number) => {
    switch (step) {
      case 0:
        return 'О мероприятии'
      case 1:
        return 'О проведении'
      case 2:
        return 'Согласующие'
      default:
        return ''
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      subtitle="Редактирование заявления"
      title={activeStepText(activeStep)}
      className="min-w-[1000px] min-h-[80vh] flex flex-col"
      stepper={
        <div className="flex">
          <Stepper steps={steps} activeStep={activeStep} />
        </div>
      }
      actions={
        <div className="flex justify-between gap-3">
          <Button variant="secondary" onClick={activeStep === 0 ? onClose : handlePrevStep}>
            {activeStep === 0 ? 'Вернуться назад' : 'Назад'}
          </Button>

          <Button
            variant="primary"
            onClick={activeStep === 2 ? handleSubmit : handleNextStep}
            disabled={
              (activeStep !== 2 && !canGoNext()) ||
              (activeStep === 2 && (updateMutation.isPending || !hasValidApprovers()))
            }
          >
            {activeStep === 2 ? (
              updateMutation.isPending ? (
                <>
                  <Spinner size="small" variant="white" className="mr-2" />
                  <span>Сохранение...</span>
                </>
              ) : (
                'Сохранить'
              )
            ) : (
              'Далее'
            )}
          </Button>
        </div>
      }
    >
      {renderStepContent()}
    </Modal>
  )
}

export default EventEditModal
