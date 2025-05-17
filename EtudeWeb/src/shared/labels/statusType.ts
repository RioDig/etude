import { StatusType } from '@/shared/types'


export const StatusTypeLabels: Record<StatusType, string> = {
  [StatusType.Confirmation]: 'На подтверждении',
  [StatusType.Rejected]: 'Отклонено',
  [StatusType.Approvement]: 'На согласовании',
  [StatusType.Processed]: 'В обработке',
  [StatusType.Registered]: 'Выполнено'
}
