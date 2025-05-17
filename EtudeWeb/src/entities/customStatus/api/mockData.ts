import { CustomStatus, StatusType } from '@/shared/types'

export const MOCK_CUSTOM_STATUSES: CustomStatus[] = [
  {
    id: '1',
    name: 'Ожидает подтверждения',
    type: StatusType.Confirmation,
    description: 'Статус присваивается, когда заявка ожидает подтверждения от руководителя',
    isProtected: true
  },
  {
    id: '2',
    name: 'В процессе согласования',
    type: StatusType.Approvement,
    description: 'Статус присваивается во время прохождения согласования различными отделами',
    isProtected: true
  },
  {
    id: '3',
    name: 'Требует дополнительной информации',
    type: StatusType.Processed,
    description: 'Статус присваивается, когда для принятия решения требуется доп. информация',
    isProtected: true
  },
  {
    id: '4',
    name: 'Предварительно одобрено',
    type: StatusType.Registered,
    description: 'Статус присваивается после первичного одобрения, но до финального решения',
    isProtected: true
  },
  {
    id: '5',
    name: 'Отложено',
    type: StatusType.Rejected,
    description: 'Статус присваивается, когда рассмотрение заявки временно приостановлено',
    isProtected: true
  },
  {
    id: '6',
    name: 'Кастом 1',
    type: StatusType.Processed,
    description: 'Статус присваивается, когда для принятия решения требуется доп. информация',
    isProtected: false
  },
  {
    id: '7',
    name: 'Кастом 2',
    type: StatusType.Processed,
    description: 'Статус присваивается, когда для принятия решения требуется доп. информация',
    isProtected: false
  },
]

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
