import { CourseType, CourseTrack, CourseFormat, Application, PastEvent } from '@/shared/types'

/**
 * Мок-данные для заявлений
 */
export const MOCK_APPLICATIONS: Application[] = [
  {
    application_id: '1',
    created_at: '2025-05-01T10:00:00Z',
    status: {
      name: 'На рассмотрении',
      type: 'Pending'
    },
    course: {
      course_id: '101',
      course_name: 'JavaScript для начинающих',
      course_description: 'Базовый курс по JavaScript для разработчиков',
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
        position: 'Старший разработчик',
        department: 'ИТ-отдел',
        isLeader: false
      }
    }
  },
  {
    application_id: '2',
    created_at: '2025-04-10T09:30:00Z',
    status: {
      name: 'Одобрено',
      type: 'Approved'
    },
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
        position: 'Старший разработчик',
        department: 'ИТ-отдел',
        isLeader: false
      }
    }
  },
  {
    application_id: '3',
    created_at: '2025-03-05T14:45:00Z',
    status: {
      name: 'Отклонено',
      type: 'Rejected'
    },
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
        id: '1',
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        position: 'Старший разработчик',
        department: 'ИТ-отдел',
        isLeader: false
      }
    }
  }
]

/**
 * Мок-данные для прошедших мероприятий
 */
export const MOCK_PAST_EVENTS: PastEvent[] = [
  {
    application_id: '4',
    created_at: '2025-01-10T12:00:00Z',
    status: {
      name: 'Завершено',
      type: 'Completed'
    },
    course: {
      course_id: '104',
      course_name: 'React Advanced',
      course_description: 'Углубленный курс по React с изучением продвинутых концепций',
      course_type: CourseType.Course,
      course_track: CourseTrack.HardSkills,
      course_format: CourseFormat.Online,
      course_trainingCenter: 'React Masters',
      course_startDate: '2025-02-15T00:00:00Z',
      course_endDate: '2025-03-15T00:00:00Z',
      course_link: 'https://reactmasters.example/advanced',
      course_price: 20000,
      course_educationGoal: 'Освоение продвинутых концепций React',
      course_learner: {
        id: '1',
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        position: 'Старший разработчик',
        department: 'ИТ-отдел',
        isLeader: false
      }
    }
  }
]

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
