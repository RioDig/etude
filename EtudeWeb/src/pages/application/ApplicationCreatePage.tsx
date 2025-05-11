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
import { ApplicationEvent } from '@/entities/application'
import { Spinner } from '@/shared/ui/spinner'
import { notification } from '@/shared/lib/notification'
import { useApplicationSubmit } from '@/entities/application'

export const ApplicationCreatePage: React.FC = () => {
  const navigate = useNavigate()

  // Получаем состояние из глобального хранилища
  const {
    currentApplication,
    reset,
    setActiveStep,
    selectEvent,
    updateApplicationData,
    activeStep: stepFromStore
  } = useApplicationStore()

  // Хук для отправки заявления
  const { mutate: submitApplication, isPending: isSubmitting } = useApplicationSubmit()

  // Локальное состояние страницы
  const [showForm, setShowForm] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  // Сбрасываем данные заявления при размонтировании компонента
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const steps = [{ label: 'О мероприятии' }, { label: 'О проведении' }, { label: 'Согласующие' }]

  // Обработчик перехода к следующему шагу
  const handleNext = () => {
    if (!showForm && selectedEventId) {
      // Если находимся в каталоге и выбрано мероприятие
      setShowForm(true)
      setActiveStep(0)
    } else if (stepFromStore < steps.length) {
      // Переходим к следующему шагу
      setActiveStep(stepFromStore + 1)
    }
  }

  // Обработчик возврата к предыдущему шагу
  const handleBack = () => {
    if (stepFromStore > 0) {
      setActiveStep(stepFromStore - 1)
    } else if (showForm) {
      // Возврат от формы к каталогу
      setShowForm(false)
    }
  }

  // Обработчик для возврата к каталогу с очисткой данных
  const handleGoToCatalog = () => {
    // Сбрасываем состояние формы
    reset()
    // Переходим обратно к каталогу
    setShowForm(false)
    // Сбрасываем выбранное мероприятие
    setSelectedEventId(null)
  }

  // Обработчик выбора мероприятия
  const handleSelectEvent = (event: ApplicationEvent) => {
    setSelectedEventId(event.id)
    selectEvent(event.id)

    // Предзаполняем форму данными выбранного мероприятия
    updateApplicationData({
      type: event.type,
      title: event.title,
      category: event.category,
      format: event.format,
      description: event.description
    })
  }

  // Обработчик создания собственного мероприятия
  const handleCreateCustomEvent = () => {
    setShowForm(true)
    setActiveStep(0)
    setSelectedEventId(null)
    // Сбрасываем данные формы при создании нового мероприятия
    updateApplicationData({
      type: '',
      title: '',
      category: '',
      format: '',
      description: '',
      link: ''
    })
    selectEvent('')
  }

  // Обработчик изменения валидности формы
  const handleFormValidChange = (isValid: boolean) => {
    setFormIsValid(isValid)
  }

  // Обработчик отправки заявления
  const handleSubmit = () => {
    if (!currentApplication) return

    // Отправляем заявление на сервер
    submitApplication(currentApplication, {
      onSuccess: () => {
        // Показываем уведомление об успехе
        notification.success({
          title: 'Заявление отправлено',
          description: 'Ваше заявление успешно отправлено и находится на рассмотрении'
        })

        // Перенаправляем на страницу заявлений
        navigate('/applications')
      },
      onError: () => {
        // Показываем уведомление об ошибке
        notification.error({
          title: 'Ошибка отправки',
          description: 'Не удалось отправить заявление. Пожалуйста, попробуйте позже.'
        })
      }
    })
  }

  // Получение заголовка на основе активного шага
  const getStepTitle = () => {
    if (!showForm) {
      return 'Каталог мероприятий'
    }

    if (stepFromStore >= steps.length) {
      return 'Подтверждение заявления'
    }

    return steps[stepFromStore]?.label || 'Новое заявление'
  }

  // Рендер содержимого на основе текущего шага
  const renderStepContent = () => {
    // Показываем каталог, если не выбрано мероприятие
    if (!showForm) {
      return (
        <CatalogView
          onSelectEvent={handleSelectEvent}
          onCreateCustomEvent={handleCreateCustomEvent}
          selectedEventId={selectedEventId}
        />
      )
    }

    // Показываем соответствующую форму для текущего шага
    switch (stepFromStore) {
      case 0:
        return <Step1Form
          onValidChange={handleFormValidChange}
          isEventSelected={!!selectedEventId} // Добавить этот проп
        />
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
      {/* Верхний блок с заголовком и Stepper */}
      <div className="flex justify-between items-start">
        <div>
          <Typography variant="b3Regular" className="text-mono-600 mb-1">
            Новое заявление
          </Typography>
          <Typography variant="h2">{getStepTitle()}</Typography>
        </div>

        {/* Показываем степпер только для этапов формы (не для подтверждения) */}
        {showForm && stepFromStore < steps.length && (
          <div className="mt-2">
            <Stepper steps={steps} activeStep={stepFromStore} />
          </div>
        )}
      </div>

      {/* Основной блок с содержимым шага */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto pr-2 relative">{renderStepContent()}</div>
      </div>

      {/* Нижний блок с кнопками навигации */}
      <div className="flex justify-between items-center pt-4 border-t border-mono-200">
        <div>
          {/* Кнопка "Вернуться назад" с подсказкой, если на первом шаге */}
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
          {/* Кнопки в правой части нижнего блока */}
          {!showForm ? (
            <>
              <Button variant="secondary" onClick={handleCreateCustomEvent}>
                Предложить свое мероприятие
              </Button>
              <Button onClick={handleNext} disabled={!selectedEventId}>
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
