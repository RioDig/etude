import {
  Application,
  ApplicationDetail,
  ApplicationStatus,
  ApplicationStatusType, StatusType
} from '@/shared/types'
import { CourseType, CourseTrack, CourseFormat } from '@/shared/types/course'
import { StatusTypeLabels } from '@/shared/labels/statusType.ts'

/**
 * Задержка для имитации запросов к серверу
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Моковые данные для статусов заявок
 */
export const MOCK_STATUSES: ApplicationStatus[] = [
  { name: 'На согласовании', type: ApplicationStatusType.Confirmation },
  { name: 'Отклонено', type: ApplicationStatusType.Rejected },
  { name: 'Согласовано', type: ApplicationStatusType.Approvement },
  { name: 'В процессе оформления', type: ApplicationStatusType.Processed },
  { name: 'Выполнено', type: ApplicationStatusType.Registered }
]

/**
 * Моковые данные для списка заявок
 */
export const MOCK_APPLICATIONS: Application[] = [
  {
    application_id: '1',
    created_at: '2025-05-10T14:30:00Z',
    status: { name: StatusTypeLabels[StatusType.Confirmation], type: StatusType.Confirmation },
    course: {
      course_id: '101',
      course_name: 'JavaScript для начинающих',
      course_description: 'Базовый курс по JavaScript для начинающих разработчиков',
      course_type: CourseType.Course,
      course_track: CourseTrack.HardSkills,
      course_format: CourseFormat.Online,
      course_trainingCenter: 'ТехноУчебка',
      course_startDate: '2025-06-01T00:00:00Z',
      course_endDate: '2025-07-15T00:00:00Z',
      course_link: 'https://technolearn.example/js-basics',
      course_price: 15000,
      course_educationGoal: 'Изучение основ JavaScript для разработки веб-приложений',
      course_learner: {
        id: '1',
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        position: 'Младший разработчик',
        department: 'Отдел разработки',
        isLeader: false
      }
    }
  },
  {
    application_id: '2',
    created_at: '2025-04-15T10:45:00Z',
    status: { name: StatusTypeLabels[StatusType.Approvement], type: StatusType.Approvement },
    course: {
      course_id: '102',
      course_name: 'Эффективные коммуникации',
      course_description: 'Тренинг по развитию коммуникативных навыков',
      course_type: CourseType.Workshop,
      course_track: CourseTrack.SoftSkills,
      course_format: CourseFormat.Offline,
      course_trainingCenter: 'ЦентрРазвития',
      course_startDate: '2025-05-20T00:00:00Z',
      course_endDate: '2025-05-22T00:00:00Z',
      course_link: 'Москва, ул. Академика Королева, 12',
      course_price: 8000,
      course_educationGoal: 'Улучшение навыков коммуникации в команде',
      course_learner: {
        id: '1',
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        position: 'Младший разработчик',
        department: 'Отдел разработки',
        isLeader: false
      }
    }
  },
  {
    application_id: '3',
    created_at: '2025-03-05T14:45:00Z',
    status: { name: StatusTypeLabels[StatusType.Rejected], type: StatusType.Rejected },
    course: {
      course_id: '103',
      course_name: 'DevOps Конференция 2025',
      course_description: 'Ежегодная конференция по DevOps практикам',
      course_type: CourseType.Conference,
      course_track: CourseTrack.HardSkills,
      course_format: CourseFormat.Offline,
      course_trainingCenter: 'ИТ-Форум',
      course_startDate: '2025-09-15T00:00:00Z',
      course_endDate: '2025-09-17T00:00:00Z',
      course_link: 'Санкт-Петербург, КЦ "Экспофорум"',
      course_price: 35000,
      course_educationGoal: 'Получение новых знаний в области DevOps',
      course_learner: {
        id: '2',
        name: 'Петр',
        surname: 'Петров',
        patronymic: 'Петрович',
        position: 'DevOps-инженер',
        department: 'Отдел инфраструктуры',
        isLeader: false
      }
    }
  },
  {
    application_id: '4',
    created_at: '2025-05-01T11:30:00Z',
    status: { name: StatusTypeLabels[StatusType.Processed], type: StatusType.Processed },
    course: {
      course_id: '104',
      course_name: 'React Advanced',
      course_description: 'Углубленный курс по React с изучением продвинутых концепций',
      course_type: CourseType.Course,
      course_track: CourseTrack.HardSkills,
      course_format: CourseFormat.Online,
      course_trainingCenter: 'React Masters',
      course_startDate: '2025-06-15T00:00:00Z',
      course_endDate: '2025-07-15T00:00:00Z',
      course_link: 'https://reactmasters.example/advanced',
      course_price: 20000,
      course_educationGoal: 'Освоение продвинутых концепций React',
      course_learner: {
        id: '3',
        name: 'Елена',
        surname: 'Сидорова',
        patronymic: 'Викторовна',
        position: 'Frontend-разработчик',
        department: 'Отдел веб-разработки',
        isLeader: false
      }
    }
  },
  {
    application_id: '5',
    created_at: '2025-02-20T09:15:00Z',
    status: { name: StatusTypeLabels[StatusType.Registered], type: StatusType.Registered },
    course: {
      course_id: '105',
      course_name: 'Project Management Professional (PMP)',
      course_description: 'Подготовка к сертификации PMP',
      course_type: CourseType.Certification,
      course_track: CourseTrack.ManagementSkills,
      course_format: CourseFormat.Online,
      course_trainingCenter: 'PMI Center',
      course_startDate: '2025-03-10T00:00:00Z',
      course_endDate: '2025-04-10T00:00:00Z',
      course_link: 'https://pmi-center.example/pmp',
      course_price: 45000,
      course_educationGoal: 'Получение сертификации PMP для улучшения карьерных перспектив',
      course_learner: {
        id: '4',
        name: 'Алексей',
        surname: 'Николаев',
        patronymic: 'Дмитриевич',
        position: 'Менеджер проектов',
        department: 'Проектный офис',
        isLeader: true
      }
    }
  }
]

/**
 * Моковые данные для детальной информации о заявках
 */
export const MOCK_APPLICATION_DETAILS: Record<string, ApplicationDetail> = {
  '1': {
    ...MOCK_APPLICATIONS[0],
    comment: 'Заявка на обучение основам JavaScript',
    author: {
      id: '1',
      name: 'Иван',
      surname: 'Иванов',
      patronymic: 'Иванович',
      orgEmail: 'ivan.ivanov@example.com',
      role: 'user',
      position: 'Младший разработчик',
      department: 'Отдел разработки',
      isLeader: false
    },
    approvers: [
      {
        id: '10',
        name: 'Сергей',
        surname: 'Сергеев',
        patronymic: 'Сергеевич',
        orgEmail: 'sergey.sergeev@example.com',
        role: 'user',
        position: 'Руководитель отдела разработки',
        department: 'Отдел разработки',
        isLeader: true
      },
      {
        id: '11',
        name: 'Мария',
        surname: 'Петрова',
        patronymic: 'Ивановна',
        orgEmail: 'maria.petrova@example.com',
        role: 'admin',
        position: 'HR-менеджер',
        department: 'HR',
        isLeader: false
      }
    ]
  },
  '2': {
    ...MOCK_APPLICATIONS[1],
    comment: 'Тренинг по коммуникациям для улучшения работы в команде',
    author: {
      id: '1',
      name: 'Иван',
      surname: 'Иванов',
      patronymic: 'Иванович',
      orgEmail: 'ivan.ivanov@example.com',
      role: 'user',
      position: 'Младший разработчик',
      department: 'Отдел разработки',
      isLeader: false
    },
    approvers: [
      {
        id: '10',
        name: 'Сергей',
        surname: 'Сергеев',
        patronymic: 'Сергеевич',
        orgEmail: 'sergey.sergeev@example.com',
        role: 'user',
        position: 'Руководитель отдела разработки',
        department: 'Отдел разработки',
        isLeader: true
      },
      {
        id: '11',
        name: 'Мария',
        surname: 'Петрова',
        patronymic: 'Ивановна',
        orgEmail: 'maria.petrova@example.com',
        role: 'admin',
        position: 'HR-менеджер',
        department: 'HR',
        isLeader: false
      }
    ]
  },
  '3': {
    ...MOCK_APPLICATIONS[2],
    comment: 'Отклонено в связи с превышением бюджета на обучение',
    author: {
      id: '2',
      name: 'Петр',
      surname: 'Петров',
      patronymic: 'Петрович',
      orgEmail: 'petr.petrov@example.com',
      role: 'user',
      position: 'DevOps-инженер',
      department: 'Отдел инфраструктуры',
      isLeader: false
    },
    approvers: [
      {
        id: '12',
        name: 'Андрей',
        surname: 'Андреев',
        patronymic: 'Андреевич',
        orgEmail: 'andrey.andreev@example.com',
        role: 'user',
        position: 'Руководитель отдела инфраструктуры',
        department: 'Отдел инфраструктуры',
        isLeader: true
      },
      {
        id: '11',
        name: 'Мария',
        surname: 'Петрова',
        patronymic: 'Ивановна',
        orgEmail: 'maria.petrova@example.com',
        role: 'admin',
        position: 'HR-менеджер',
        department: 'HR',
        isLeader: false
      }
    ]
  }
}
