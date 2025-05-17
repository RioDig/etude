import React, { useState } from 'react'
import { Sidebar, SidebarAction } from '@/widgets/sidebar'
import { Typography } from '@/shared/ui/typography'
import { Tag } from '@/shared/ui/tag'
import { Spinner } from '@/shared/ui/spinner'
import { Control } from '@/shared/ui/controls'
import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'
import { MiniModal } from '@/shared/ui/modal'
import { notification } from '@/shared/lib/notification'
import {
  useApplicationDetail,
  useUpdateApplication,
  useChangeApplicationStatus,
  useDeleteApplication
} from '@/entities/event'
import {
  Application,
  ApplicationStatusType,
  ApplicationUpdate,
  CustomStatus,
  StatusType
} from '@/shared/types'
import { useAuth } from '@/entities/session'
import { useCustomStatuses } from '@/entities/customStatus'
import { CourseTypeLabels } from '@/shared/labels/courseType'
import { CourseFormatLabels } from '@/shared/labels/courseFormat'
import clsx from 'clsx'
import { getCommentColorVariant } from '@/widgets/calendar/utils/calendar-helpers.ts'
import { StatusTypeLabels } from '@/shared/labels/statusType.ts'
import { Autorenew, Check, Close, Delete, Edit } from '@mui/icons-material'

interface EventsSidebarProps {
  open: boolean
  onClose: () => void
  event: Application | null
}

type ModalType = 'edit' | 'approve' | 'reject' | 'delete' | 'changeStatus' | 'complete' | null

export const EventsSidebar: React.FC<EventsSidebarProps> = ({ open, onClose, event }) => {
  const { user } = useAuth()
  const isAdmin = user?.role !== 'admin'

  const [modalType, setModalType] = useState<ModalType>(null)
  const [statusComment, setStatusComment] = useState('')
  const [selectedStatusId, setSelectedStatusId] = useState('')

  const [formValues, setFormValues] = useState<ApplicationUpdate>({})

  const { data: eventDetails, isLoading, error } = useApplicationDetail(event?.application_id)

  const updateMutation = useUpdateApplication()
  const changeStatusMutation = useChangeApplicationStatus()
  const deleteMutation = useDeleteApplication()

  const { data: customStatuses } = useCustomStatuses()

  const filteredStatuses =
    customStatuses?.filter(
      (status) => status.type === StatusType.Processed && status.name !== eventDetails?.status.name
    ) || []

  const handleClose = () => {
    setModalType(null)
    setStatusComment('')
    setSelectedStatusId('')
    setFormValues({})
    onClose()
  }

  const openModal = (type: ModalType) => {
    setModalType(type)

    if (type === 'edit' && eventDetails) {
      setFormValues({
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
      })
    }
  }

  const handleFormChange = (field: keyof ApplicationUpdate, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUpdateSubmit = () => {
    if (!eventDetails) return

    updateMutation.mutate(
      {
        id: eventDetails.application_id,
        data: formValues
      },
      {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Заявка успешно обновлена'
          })
          setModalType(null)
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

  const handleApprove = () => {
    if (!eventDetails) return

    changeStatusMutation.mutate(
      {
        id: eventDetails.application_id,
        status: 'Approvement',
        comment: statusComment
      },
      {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Заявка успешно подтверждена'
          })
          setModalType(null)
          setStatusComment('')
        },
        onError: (error) => {
          notification.error({
            title: 'Ошибка',
            description: `Не удалось подтвердить заявку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
          })
        }
      }
    )
  }

  const handleReject = () => {
    if (!eventDetails) return

    changeStatusMutation.mutate(
      {
        id: eventDetails.application_id,
        status: 'Rejected',
        comment: statusComment
      },
      {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Заявка отклонена'
          })
          setModalType(null)
          setStatusComment('')
        },
        onError: (error) => {
          notification.error({
            title: 'Ошибка',
            description: `Не удалось отклонить заявку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
          })
        }
      }
    )
  }

  const handleDelete = () => {
    if (!eventDetails) return

    deleteMutation.mutate(eventDetails.application_id, {
      onSuccess: () => {
        notification.success({
          title: 'Успешно',
          description: 'Заявка удалена'
        })
        setModalType(null)
        handleClose()
      },
      onError: (error) => {
        notification.error({
          title: 'Ошибка',
          description: `Не удалось удалить заявку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
        })
      }
    })
  }

  const handleChangeStatus = () => {
    if (!eventDetails || !selectedStatusId) return

    changeStatusMutation.mutate(
      {
        id: eventDetails.application_id,
        status: selectedStatusId,
        comment: statusComment
      },
      {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Статус заявки изменен'
          })
          setModalType(null)
          setStatusComment('')
          setSelectedStatusId('')
        },
        onError: (error) => {
          notification.error({
            title: 'Ошибка',
            description: `Не удалось изменить статус заявки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
          })
        }
      }
    )
  }

  const handleComplete = () => {
    if (!eventDetails) return

    changeStatusMutation.mutate(
      {
        id: eventDetails.application_id,
        status: 'Registered',
        comment: statusComment
      },
      {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Заявка отмечена как выполненная'
          })
          setModalType(null)
          setStatusComment('')
        },
        onError: (error) => {
          notification.error({
            title: 'Ошибка',
            description: `Не удалось отметить заявку как выполненную: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
          })
        }
      }
    )
  }

  const getHeaderActions = (): SidebarAction[] => {
    if (!eventDetails) return []

    const actions: SidebarAction[] = []

    if (isAdmin && eventDetails.status.type === ApplicationStatusType.Confirmation) {
      actions.push(
        {
          label: 'Подтвердить',
          onClick: () => openModal('approve'),
          variant: 'secondary',
          icon: <Check />
        },
        {
          label: 'Отклонить',
          onClick: () => openModal('reject'),
          variant: 'secondary',
          icon: <Close />
        },
        {
          label: 'Редактировать',
          onClick: () => openModal('edit'),
          variant: 'secondary',
          icon: <Edit />
        }
      )
    } else if (isAdmin && eventDetails.status.type === ApplicationStatusType.Processed) {
      actions.push(
        {
          label: 'Отметить как выполненную',
          onClick: () => openModal('complete'),
          variant: 'primary'
        },
        {
          label: 'Изменить статус',
          onClick: () => openModal('changeStatus'),
          variant: 'secondary',
          icon: <Autorenew />
        },
        {
          onClick: () => openModal('edit'),
          variant: 'secondary',
          icon: <Edit />
        }
      )
    } else if (!isAdmin && eventDetails.status.type === ApplicationStatusType.Confirmation) {
      actions.push({
        label: 'Удалить',
        onClick: () => openModal('delete'),
        variant: 'secondary',
        icon: <Delete />
      })
    }

    return actions
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case StatusType.Confirmation:
        return { text: StatusTypeLabels[StatusType.Confirmation], variant: 'default' as const }
      case StatusType.Approvement:
        return { text: StatusTypeLabels[StatusType.Approvement], variant: 'warning' as const }
      case StatusType.Rejected:
        return { text: StatusTypeLabels[StatusType.Rejected], variant: 'error' as const }
      case StatusType.Registered:
        return { text: StatusTypeLabels[StatusType.Registered], variant: 'success' as const }
      case StatusType.Processed:
        return { text: StatusTypeLabels[StatusType.Processed], variant: 'system' as const }
      default:
        return { text: status, variant: 'default' as const }
    }
  }

  const formatDate = (date: string): string => {
    if (!date) return 'Не указана'
    return new Date(date).toLocaleDateString('ru-RU')
  }

  if (!event) {
    return null
  }

  const eventData = eventDetails || event
  const { text: statusText, variant: statusVariant } = getStatusInfo(eventData.status.type)

  const headerActions = getHeaderActions()

  return (
    <>
      <Sidebar
        open={open}
        onClose={handleClose}
        title={eventData.course.course_name}
        description={`${CourseTypeLabels[eventData.course.course_type]}, ${CourseFormatLabels[eventData.course.course_format]}`}
        badge={{ text: statusText, variant: statusVariant }}
        headerActions={headerActions}
        footerActions={[
          {
            label: 'Закрыть',
            onClick: handleClose,
            variant: 'secondary'
          }
        ]}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="medium" label="Загрузка данных..." />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">
            <Typography variant="b3Regular">
              Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.
            </Typography>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {eventDetails?.comment && (
              <div className="flex gap-5">
                <span
                  className={clsx(
                    'border border-l-4',
                    getCommentColorVariant(eventData.status.type)
                  )}
                ></span>
                <div className="flex flex-col gap-3 py-4">
                  <Typography variant="b3Semibold" className="">
                    Комментарий
                  </Typography>
                  <Typography variant="b3Regular" className="whitespace-pre-wrap">
                    {eventDetails.comment}
                  </Typography>
                </div>
              </div>
            )}
            <div>
              <Typography variant="b3Semibold" className="mb-2">
                Основная информация
              </Typography>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <span className="text-mono-700 w-32">Тип:</span>
                  <span>{CourseTypeLabels[eventData.course.course_type]}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-mono-700 w-32">Формат:</span>
                  <Tag>{CourseFormatLabels[eventData.course.course_format]}</Tag>
                </div>
                <div className="flex gap-2">
                  <span className="text-mono-700 w-32">Направление:</span>
                  <Tag>{eventData.course.course_track}</Tag>
                </div>
                <div className="flex gap-2">
                  <span className="text-mono-700 w-32">Период:</span>
                  <span>
                    {formatDate(eventData.course.course_startDate)} -{' '}
                    {formatDate(eventData.course.course_endDate)}
                  </span>
                </div>
                {eventData.course.course_trainingCenter && (
                  <div className="flex gap-2">
                    <span className="text-mono-700 w-32">Учебный центр:</span>
                    <span>{eventData.course.course_trainingCenter}</span>
                  </div>
                )}
                {eventData.course.course_link && (
                  <div className="flex gap-2">
                    <span className="text-mono-700 w-32">Место/ссылка:</span>
                    <span>{eventData.course.course_link}</span>
                  </div>
                )}
                {eventData.course.course_price && (
                  <div className="flex gap-2">
                    <span className="text-mono-700 w-32">Стоимость:</span>
                    <span>{eventData.course.course_price} ₽</span>
                  </div>
                )}
              </div>
            </div>

            {eventData.course.course_description && (
              <div>
                <Typography variant="b3Semibold" className="mb-2">
                  Описание
                </Typography>
                <Typography variant="b3Regular" className="whitespace-pre-wrap">
                  {eventData.course.course_description}
                </Typography>
              </div>
            )}

            {eventData.course.course_educationGoal && (
              <div>
                <Typography variant="b3Semibold" className="mb-2">
                  Цель обучения
                </Typography>
                <Typography variant="b3Regular">{eventData.course.course_educationGoal}</Typography>
              </div>
            )}

            {eventData.course.course_learner && (
              <div>
                <Typography variant="b3Semibold" className="mb-2">
                  Участник
                </Typography>
                <div className="flex flex-col gap-1">
                  <Typography variant="b3Regular">
                    {eventData.course.course_learner.surname} {eventData.course.course_learner.name}{' '}
                    {eventData.course.course_learner.patronymic}
                  </Typography>
                  {eventData.course.course_learner.position && (
                    <Typography variant="b4Regular" className="text-mono-700">
                      {eventData.course.course_learner.position},{' '}
                      {eventData.course.course_learner.department}
                    </Typography>
                  )}
                </div>
              </div>
            )}

            {eventDetails?.approvers && eventDetails.approvers.length > 0 && (
              <div>
                <Typography variant="b3Semibold" className="mb-2">
                  Согласующие
                </Typography>
                <div className="flex flex-col gap-3">
                  {eventDetails.approvers.map((approver, index) => (
                    <div key={index} className="p-3 bg-mono-100 rounded-md">
                      <Typography variant="b3Regular">
                        {approver.surname} {approver.name} {approver.patronymic}
                      </Typography>
                      {approver.position && (
                        <Typography variant="b4Regular" className="text-mono-700">
                          {approver.position}, {approver.department}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {eventDetails?.author && (
              <div>
                <Typography variant="b3Semibold" className="mb-2">
                  Автор заявки
                </Typography>
                <div className="flex flex-col gap-1">
                  <Typography variant="b3Regular">
                    {eventDetails.author.surname} {eventDetails.author.name}{' '}
                    {eventDetails.author.patronymic}
                  </Typography>
                  {eventDetails.author.position && (
                    <Typography variant="b4Regular" className="text-mono-700">
                      {eventDetails.author.position}, {eventDetails.author.department}
                    </Typography>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Sidebar>

      {modalType === 'edit' && (
        <Modal
          isOpen={true}
          onClose={() => setModalType(null)}
          title="Редактирование заявки"
          actions={
            <>
              <Button variant="secondary" onClick={() => setModalType(null)}>
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateSubmit}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Spinner size="small" variant="white" className="mr-2" />
                    <span>Сохранение...</span>
                  </>
                ) : (
                  'Сохранить'
                )}
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Control.Input
              label="Название"
              value={formValues.name || ''}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
            />

            <Control.Select
              label="Тип"
              value={formValues.type || ''}
              onChange={(value) => handleFormChange('type', value)}
              options={Object.entries(CourseTypeLabels).map(([value, label]) => ({ value, label }))}
              required
            />

            <Control.Select
              label="Направление"
              value={formValues.track || ''}
              onChange={(value) => handleFormChange('track', value)}
              options={[
                { value: 'Hard Skills', label: 'Hard Skills' },
                { value: 'Soft Skills', label: 'Soft Skills' },
                { value: 'Management Skills', label: 'Management Skills' }
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
              label="Учебный центр"
              value={formValues.trainingCenter || ''}
              onChange={(e) => handleFormChange('trainingCenter', e.target.value)}
            />

            <Control.Input
              label="Место проведения или ссылка"
              value={formValues.link || ''}
              onChange={(e) => handleFormChange('link', e.target.value)}
            />

            <Control.DateInput
              label="Дата начала"
              value={formValues.startDate ? new Date(formValues.startDate) : null}
              onChange={(date) => date && handleFormChange('startDate', date.toISOString())}
            />

            <Control.DateInput
              label="Дата окончания"
              value={formValues.endDate ? new Date(formValues.endDate) : null}
              onChange={(date) => date && handleFormChange('endDate', date.toISOString())}
            />

            <Control.Input
              label="Стоимость"
              value={formValues.price?.toString() || ''}
              onChange={(e) => handleFormChange('price', e.target.value)}
              type="number"
            />
          </div>

          <div className="mt-6">
            <Control.Textarea
              label="Описание"
              value={formValues.description || ''}
              onChange={(e) => handleFormChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="mt-6">
            <Control.Textarea
              label="Цель обучения"
              value={formValues.educationGoal || ''}
              onChange={(e) => handleFormChange('educationGoal', e.target.value)}
              rows={3}
            />
          </div>
        </Modal>
      )}

      {modalType === 'approve' && (
        <Modal
          isOpen={true}
          onClose={() => setModalType(null)}
          title="Подтверждение заявки"
          actions={
            <>
              <Button variant="secondary" onClick={() => setModalType(null)}>
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleApprove}
                disabled={changeStatusMutation.isPending}
              >
                {changeStatusMutation.isPending ? (
                  <>
                    <Spinner size="small" variant="white" className="mr-2" />
                    <span>Подтверждение...</span>
                  </>
                ) : (
                  'Подтвердить'
                )}
              </Button>
            </>
          }
        >
          <Typography variant="b3Regular" className="mb-4">
            Вы действительно хотите подтвердить эту заявку?
          </Typography>
          <Control.Textarea
            label="Комментарий (опционально)"
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            rows={3}
          />
        </Modal>
      )}

      {modalType === 'reject' && (
        <Modal
          isOpen={true}
          onClose={() => setModalType(null)}
          title="Отклонение заявки"
          actions={
            <>
              <Button variant="secondary" onClick={() => setModalType(null)}>
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleReject}
                disabled={changeStatusMutation.isPending || !statusComment}
              >
                {changeStatusMutation.isPending ? (
                  <>
                    <Spinner size="small" variant="white" className="mr-2" />
                    <span>Отклонение...</span>
                  </>
                ) : (
                  'Отклонить'
                )}
              </Button>
            </>
          }
        >
          <Typography variant="b3Regular" className="mb-4">
            Вы действительно хотите отклонить эту заявку? Пожалуйста, укажите причину.
          </Typography>
          <Control.Textarea
            label="Причина отклонения"
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            rows={3}
            required
            error={!statusComment ? 'Необходимо указать причину отклонения' : undefined}
          />
        </Modal>
      )}

      {modalType === 'delete' && (
        <MiniModal
          isOpen={true}
          onClose={() => setModalType(null)}
          title="Удаление заявки"
          description="Вы действительно хотите удалить эту заявку? Это действие нельзя отменить."
          buttons={[
            <Button key="cancel" variant="secondary" onClick={() => setModalType(null)} fullWidth>
              Отмена
            </Button>,
            <Button
              key="delete"
              variant="primary"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              fullWidth
            >
              {deleteMutation.isPending ? (
                <>
                  <Spinner size="small" variant="white" className="mr-2" />
                  <span>Удаление...</span>
                </>
              ) : (
                'Удалить'
              )}
            </Button>
          ]}
        />
      )}

      {modalType === 'changeStatus' && (
        <Modal
          isOpen={true}
          onClose={() => setModalType(null)}
          title="Изменение статуса"
          actions={
            <>
              <Button variant="secondary" onClick={() => setModalType(null)}>
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleChangeStatus}
                disabled={changeStatusMutation.isPending || !selectedStatusId}
              >
                {changeStatusMutation.isPending ? (
                  <>
                    <Spinner size="small" variant="white" className="mr-2" />
                    <span>Изменение...</span>
                  </>
                ) : (
                  'Изменить статус'
                )}
              </Button>
            </>
          }
        >
          <Typography variant="b3Regular" className="mb-4">
            Выберите новый статус для заявки:
          </Typography>
          <Control.Select
            label="Статус"
            value={selectedStatusId}
            onChange={setSelectedStatusId}
            options={filteredStatuses.map((status: CustomStatus) => ({
              value: status.id,
              label: status.name
            }))}
            required
            error={!selectedStatusId ? 'Необходимо выбрать статус' : undefined}
          />
          <Control.Textarea
            label="Комментарий (опционально)"
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            rows={3}
            className="mt-4"
          />
        </Modal>
      )}

      {modalType === 'complete' && (
        <Modal
          isOpen={true}
          onClose={() => setModalType(null)}
          title="Отметка о выполнении"
          actions={
            <>
              <Button variant="secondary" onClick={() => setModalType(null)}>
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleComplete}
                disabled={changeStatusMutation.isPending}
              >
                {changeStatusMutation.isPending ? (
                  <>
                    <Spinner size="small" variant="white" className="mr-2" />
                    <span>Выполнение...</span>
                  </>
                ) : (
                  'Отметить как выполненную'
                )}
              </Button>
            </>
          }
        >
          <Typography variant="b3Regular" className="mb-4">
            Вы действительно хотите отметить эту заявку как выполненную?
          </Typography>
          <Control.Textarea
            label="Комментарий (опционально)"
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            rows={3}
          />
        </Modal>
      )}
    </>
  )
}

export default EventsSidebar
