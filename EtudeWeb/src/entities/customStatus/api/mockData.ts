import { CustomStatus, StatusType } from '@/shared/types'

export const MOCK_CUSTOM_STATUSES: CustomStatus[] = [
  {
    id: '1',
    name: 'Ожидает подтверждения',
    type: StatusType.Confirmation,
    description: 'Статус присваивается, когда заявка ожидает подтверждения от руководителя'
  },
  {
    id: '2',
    name: 'В процессе согласования',
    type: StatusType.Approvement,
    description: 'Статус присваивается во время прохождения согласования различными отделами'
  },
  {
    id: '3',
    name: 'Требует дополнительной информации',
    type: StatusType.Processed,
    description: 'Статус присваивается, когда для принятия решения требуется доп. информация'
  },
  {
    id: '4',
    name: 'Предварительно одобрено',
    type: StatusType.Processed,
    description: 'Статус присваивается после первичного одобрения, но до финального решения'
  },
  {
    id: '5',
    name: 'Отложено',
    type: StatusType.Rejected,
    description: 'Статус присваивается, когда рассмотрение заявки временно приостановлено'
  }
]

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
