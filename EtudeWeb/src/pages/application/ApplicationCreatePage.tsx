import React, { useEffect, useState } from 'react'
import { Container } from '@/shared/ui/container'
import { Stepper } from '@/shared/ui/stepper'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Hint } from '@/shared/ui/hint'
import { useNavigate } from 'react-router-dom'
import { CatalogView } from './ui/CatalogView'
import { Step1Form } from './ui/Step1Form'
import { Step2Form } from './ui/Step2Form'
import { Step3Form } from './ui/Step3Form'
import { ConfirmationView } from './ui/ConfirmationView'
import { useApplicationStore } from '@/entities/application/model/applicationStore'
import { CourseTemplate } from '@/shared/types'
import { Spinner } from '@/shared/ui/spinner'
import { notification } from '@/shared/lib/notification'
import { useApplicationSubmit } from '@/entities/application/hooks/useApplicationSubmit'

export const ApplicationCreatePage: React.FC = () => {
  const navigate = useNavigate()

  const {
    currentApplication,
    reset,
    setActiveStep,
    selectTemplate,
    updateApplicationData,
    activeStep: stepFromStore,
    selectedTemplateId
  } = useApplicationStore()

  const { mutate: submitApplication, isPending: isSubmitting } = useApplicationSubmit()

  const [showForm, setShowForm] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const steps = [{ label: 'О мероприятии' }, { label: 'О проведении' }, { label: 'Согласующие' }]

  const handleNext = () => {
    if (!showForm && selectedTemplateId) {
      setShowForm(true)
      setActiveStep(0)
    } else if (stepFromStore < steps.length) {
      setActiveStep(stepFromStore + 1)
    }
  }

  const handleBack = () => {
    if (stepFromStore > 0) {
      setActiveStep(stepFromStore - 1)
    } else if (showForm) {
      setShowForm(false)
    }
  }

  const handleGoToCatalog = () => {
    reset()
    setShowForm(false)
  }

  const handleSelectTemplate = (template: CourseTemplate) => {
    selectTemplate(template.course_template_id)

    updateApplicationData({
      name: template.course_template_name,
      description: template.course_template_description,
      type: template.course_template_type,
      track: template.course_template_track,
      format: template.course_template_format,
      trainingCenter: template.course_template_trainingCenter,
      startDate: template.course_template_startDate,
      endDate: template.course_template_endDate,
      link: template.course_template_link
    })
  }

  const handleCreateCustomEvent = () => {
    setShowForm(true)
    setActiveStep(0)
    selectTemplate('')

    updateApplicationData({
      name: '',
      description: '',
      type: undefined,
      track: undefined,
      format: undefined,
      trainingCenter: '',
      startDate: '',
      endDate: '',
      link: ''
    })
  }

  const handleFormValidChange = (isValid: boolean) => {
    setFormIsValid(isValid)
  }

  const handleSubmit = () => {
    if (!currentApplication) return

    submitApplication(currentApplication, {
      onSuccess: () => {
        notification.success({
          title: 'Заявление отправлено',
          description: 'Ваше заявление успешно отправлено и находится на рассмотрении'
        })

        navigate('/applications')
      },
      onError: () => {
        notification.error({
          title: 'Ошибка отправки',
          description: 'Не удалось отправить заявление. Пожалуйста, попробуйте позже.'
        })
      }
    })
  }

  const getStepTitle = () => {
    if (!showForm) {
      return 'Каталог мероприятий'
    }

    if (stepFromStore >= steps.length) {
      return 'Подтверждение заявления'
    }

    return steps[stepFromStore]?.label || 'Новое заявление'
  }

  const renderStepContent = () => {
    if (!showForm) {
      return (
        <CatalogView
          onSelectTemplate={handleSelectTemplate}
          onCreateCustomEvent={handleCreateCustomEvent}
          selectedTemplateId={selectedTemplateId}
        />
      )
    }

    switch (stepFromStore) {
      case 0:
        return (
          <Step1Form
            onValidChange={handleFormValidChange}
            isTemplateSelected={!!selectedTemplateId}
          />
        )
      case 1:
        return <Step2Form onValidChange={handleFormValidChange} />
      case 2:
        return <Step3Form onValidChange={handleFormValidChange} />
      case 3:
        return <ConfirmationView />
      default:
        return null
    }
  }

  return (
    <Container className="flex flex-col gap-6 h-full max-w-[1200px] overflow-visible mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <Typography variant="b3Regular" className="text-mono-600 mb-1">
            Новое заявление
          </Typography>
          <Typography variant="h2">{getStepTitle()}</Typography>
        </div>

        {showForm && stepFromStore < steps.length && (
          <div className="mt-2">
            <Stepper steps={steps} activeStep={stepFromStore} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto pr-2 relative">{renderStepContent()}</div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-mono-200">
        <div>
          {!showForm || stepFromStore === 0 ? (
            <Hint content="Вы уже на первом этапе" position="top-right">
              <Button variant="third" disabled={true}>
                Вернуться назад
              </Button>
            </Hint>
          ) : (
            <Button variant="third" onClick={handleBack}>
              Вернуться назад
            </Button>
          )}
        </div>

        <div className="flex gap-4">
          {!showForm ? (
            <>
              <Button variant="secondary" onClick={handleCreateCustomEvent}>
                Предложить свое мероприятие
              </Button>
              <Button onClick={handleNext} disabled={!selectedTemplateId}>
                Далее
              </Button>
            </>
          ) : stepFromStore < steps.length ? (
            <>
              <Button variant="secondary" onClick={handleGoToCatalog}>
                Перейти в каталог мероприятий
              </Button>
              <Button disabled={!formIsValid} onClick={handleNext}>
                Далее
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="small" variant="white" className="mr-2" />
                  <span>Отправка заявления...</span>
                </>
              ) : (
                'Подтвердить и отправить'
              )}
            </Button>
          )}
        </div>
      </div>
    </Container>
  )
}
