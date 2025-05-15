import {
  Competency,
  PastEvent,
  ApplicationStatusType,
  CourseFormat,
  CourseTrack,
  CourseType
} from '@/shared/types'

/**
 * Мок-данные для компетенций
 */
export const MOCK_COMPETENCIES: Competency[] = [
  {
    id: '1',
    name: 'JavaScript'
  },
  {
    id: '2',
    name: 'React'
  },
  {
    id: '3',
    name: 'Node.js'
  },
  {
    id: '4',
    name: 'TypeScript'
  },
  {
    id: '5',
    name: 'HTML/CSS'
  },
  {
    id: '6',
    name: 'SQL'
  },
  {
    id: '7',
    name: 'Git'
  },
  {
    id: '8',
    name: 'Управление командой'
  }
]

/**
 * Мок-данные для прошедших мероприятий
 */
export const MOCK_PAST_EVENTS: PastEvent[] = [
  {
    application_id: '1',
    created_at: '2024-01-10T12:00:00Z',
    status: {
      name: 'Завершено',
      type: ApplicationStatusType.Registered
    },
    course: {
      course_id: '101',
      course_name: 'JavaScript для продвинутых разработчиков',
      course_description:
        'Углубленный курс по JavaScript с изучением продвинутых концепций и паттернов программирования',
      course_type: CourseType.Course,
      course_track: CourseTrack.HardSkills,
      course_format: CourseFormat.Online,
      course_trainingCenter: 'Учебный центр "ТехноМир"',
      course_startDate: '2024-01-15T00:00:00Z',
      course_endDate: '2024-02-15T00:00:00Z',
      course_link: 'https://example.com/js-advanced',
      course_price: 15000,
      course_educationGoal: 'Повышение квалификации в области JavaScript',
      course_learner: {
        id: '1',
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        position: 'Старший разработчик',
        department: 'IT-отдел',
        isLeader: false
      }
    }
  },
  {
    application_id: '2',
    created_at: '2024-02-05T10:30:00Z',
    status: {
      name: 'Отклонено',
      type: ApplicationStatusType.Rejected
    },
    course: {
      course_id: '102',
      course_name: 'Конференция DevOps Days 2024',
      course_description:
        'Международная конференция, посвященная практикам DevOps и инструментам непрерывной интеграции/доставки',
      course_type: CourseType.Conference,
      course_track: CourseTrack.HardSkills,
      course_format: CourseFormat.Offline,
      course_trainingCenter: 'Экспоцентр',
      course_startDate: '2024-03-01T00:00:00Z',
      course_endDate: '2024-03-03T00:00:00Z',
      course_link: 'Москва, Краснопресненская наб., 14',
      course_price: 35000,
      course_educationGoal: 'Знакомство с последними тенденциями в области DevOps',
      course_learner: {
        id: '1',
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        position: 'Старший разработчик',
        department: 'IT-отдел',
        isLeader: false
      }
    }
  },
  {
    application_id: '3',
    created_at: '2024-03-15T09:45:00Z',
    status: {
      name: 'Одобрено',
      type: ApplicationStatusType.Approvement
    },
    course: {
      course_id: '103',
      course_name: 'Тренинг по soft-skills: Эффективная коммуникация',
      course_description:
        'Интенсивный тренинг по развитию навыков эффективной коммуникации в профессиональной среде',
      course_type: CourseType.Workshop,
      course_track: CourseTrack.SoftSkills,
      course_format: CourseFormat.Online,
      course_trainingCenter: 'Центр развития персонала "Импульс"',
      course_startDate: '2024-04-10T00:00:00Z',
      course_endDate: '2024-04-11T00:00:00Z',
      course_link: 'https://example.com/communication-training',
      course_price: 8000,
      course_educationGoal: 'Улучшение навыков коммуникации и работы в команде',
      course_learner: {
        id: '1',
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        position: 'Старший разработчик',
        department: 'IT-отдел',
        isLeader: false
      }
    }
  }
]

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
