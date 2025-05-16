import axios from 'axios'
import { API_URL } from '@/shared/config'
import { Event, EventDetails } from '../model/types'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

/**
 * Задержка для имитации запросов к серверу
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Мок-данные для списка мероприятий
 */
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Эффективная коммуникация в команде',
    description:
      'Курс направлен на развитие навыков эффективного взаимодействия в команде и улучшение коммуникационных процессов между сотрудниками различных отделов.',
    type: 'course',
    format: 'mixed',
    category: 'soft-skills',
    status: 'approved',
    startDate: '2025-05-10',
    endDate: '2025-05-11',
    createdAt: '2025-04-01T10:30:00Z',
    updatedAt: '2025-04-02T14:15:00Z',
    employee: 'Иванов И.И.'
  },
  {
    id: '2',
    title: 'Введение в Node.js и React',
    description:
      'Практический курс по современной веб-разработке с использованием технологий Node.js и React. Создание полноценного приложения от начала до конца.',
    type: 'course',
    format: 'online',
    category: 'hard-skills',
    status: 'pending',
    startDate: '2025-05-15',
    endDate: '2025-06-15',
    createdAt: '2025-04-05T09:20:00Z',
    updatedAt: '2025-04-05T09:20:00Z',
    employee: 'Петров П.П.'
  },
  {
    id: '3',
    title: 'Международная конференция по Machine Learning',
    description:
      'Ежегодная международная конференция, посвященная последним достижениям в области машинного обучения и искусственного интеллекта.',
    type: 'conference',
    format: 'offline',
    category: 'hard-skills',
    status: 'completed',
    startDate: '2025-03-01',
    endDate: '2025-03-03',
    createdAt: '2025-01-10T11:45:00Z',
    updatedAt: '2025-03-05T16:30:00Z',
    employee: 'Сидорова Е.В.'
  },
  {
    id: '4',
    title: 'Вебинар: Управление удаленными командами',
    description:
      'Практические советы и инструменты для эффективного управления распределенными командами в условиях удаленной работы.',
    type: 'webinar',
    format: 'online',
    category: 'management',
    status: 'approved',
    startDate: '2025-05-20',
    endDate: '2025-05-20',
    createdAt: '2025-04-10T13:00:00Z',
    updatedAt: '2025-04-12T09:15:00Z',
    employee: 'Козлов А.С.'
  },
  {
    id: '5',
    title: 'Тренинг: Управление проектами по методологии Agile',
    description:
      'Интенсивный трехдневный тренинг по применению гибких методологий в управлении проектами различной сложности.',
    type: 'training',
    format: 'offline',
    category: 'management',
    status: 'rejected',
    startDate: '2025-06-01',
    endDate: '2025-06-03',
    createdAt: '2025-04-15T10:00:00Z',
    updatedAt: '2025-04-17T14:20:00Z',
    employee: 'Смирнова О.Д.'
  },
  {
    id: '6',
    title: 'Вебинар: Docker и Kubernetes для начинающих',
    description:
      'Введение в контейнеризацию и оркестрацию с использованием Docker и Kubernetes. Основы работы и практические примеры.',
    type: 'webinar',
    format: 'online',
    category: 'hard-skills',
    status: 'pending',
    startDate: '2025-05-25',
    endDate: '2025-05-25',
    createdAt: '2025-04-18T11:30:00Z',
    updatedAt: '2025-04-18T11:30:00Z',
    employee: 'Николаев Д.А.'
  },
  {
    id: '7',
    title: 'Курс: Основы UI/UX дизайна',
    description:
      'Базовый курс по проектированию интерфейсов и пользовательского опыта. Принципы, инструменты и лучшие практики.',
    type: 'course',
    format: 'mixed',
    category: 'hard-skills',
    status: 'approved',
    startDate: '2025-06-10',
    endDate: '2025-07-10',
    createdAt: '2025-04-20T09:45:00Z',
    updatedAt: '2025-04-22T13:10:00Z',
    employee: 'Морозова А.И.'
  },
  {
    id: '8',
    title: 'Тренинг: Эмоциональный интеллект в бизнесе',
    description:
      'Развитие навыков эмоционального интеллекта для повышения эффективности в деловых отношениях и улучшения коммуникации в команде.',
    type: 'training',
    format: 'offline',
    category: 'soft-skills',
    status: 'completed',
    startDate: '2025-04-10',
    endDate: '2025-04-11',
    createdAt: '2025-03-01T14:20:00Z',
    updatedAt: '2025-04-15T10:30:00Z',
    employee: 'Кузнецов И.П.'
  },
  {
    id: '9',
    title: 'Конференция: DevOps Days 2025',
    description:
      'Ежегодная конференция для специалистов DevOps. Обмен опытом, новые инструменты и методологии, практические кейсы.',
    type: 'conference',
    format: 'mixed',
    category: 'hard-skills',
    status: 'pending',
    startDate: '2025-07-01',
    endDate: '2025-07-02',
    createdAt: '2025-04-25T15:00:00Z',
    updatedAt: '2025-04-25T15:00:00Z',
    employee: 'Соколов М.В.'
  },
  {
    id: '10',
    title: 'Курс: Стратегический менеджмент',
    description:
      'Углубленный курс для руководителей по стратегическому планированию и развитию бизнеса в современных условиях.',
    type: 'course',
    format: 'online',
    category: 'management',
    status: 'approved',
    startDate: '2025-06-15',
    endDate: '2025-08-15',
    createdAt: '2025-04-28T10:15:00Z',
    updatedAt: '2025-04-30T11:20:00Z',
    employee: 'Лебедева Е.С.'
  }
]

/**
 * Мок-данные для детальной информации о мероприятиях
 */
const MOCK_EVENT_DETAILS: Record<string, EventDetails> = {
  '1': {
    ...MOCK_EVENTS[0],
    location: 'Учебный центр "Перспектива", аудитория 301',
    participants: [
      {
        id: '101',
        name: 'Иванов Иван Иванович',
        position: 'Старший разработчик',
        department: 'Разработка'
      },
      { id: '102', name: 'Петрова Анна Сергеевна', position: 'Дизайнер', department: 'Дизайн' },
      {
        id: '103',
        name: 'Сидоров Петр Алексеевич',
        position: 'Менеджер проекта',
        department: 'Управление проектами'
      }
    ],
    approvers: [
      {
        id: '201',
        name: 'Николаев Андрей Владимирович',
        position: 'Руководитель отдела',
        approved: true,
        approvedAt: '2025-04-02T12:30:00Z'
      },
      {
        id: '202',
        name: 'Козлова Мария Дмитриевна',
        position: 'HR-директор',
        approved: true,
        approvedAt: '2025-04-02T14:00:00Z'
      }
    ],
    cost: '25000',
    goal: 'Улучшение коммуникации в команде и повышение эффективности взаимодействия между отделами',
    comments: 'Курс рекомендован HR-отделом как часть программы развития сотрудников',
    documents: [
      {
        id: 'd1',
        name: 'Программа курса.pdf',
        url: '/documents/program.pdf',
        type: 'application/pdf'
      },
      {
        id: 'd2',
        name: 'Заявка на обучение.docx',
        url: '/documents/application.docx',
        type: 'application/msword'
      }
    ]
  },
  '2': {
    ...MOCK_EVENTS[1],
    location: 'Онлайн-платформа CodeSchool',
    participants: [
      {
        id: '104',
        name: 'Петров Петр Петрович',
        position: 'Младший разработчик',
        department: 'Разработка'
      }
    ],
    approvers: [
      {
        id: '203',
        name: 'Смирнов Алексей Петрович',
        position: 'Технический директор',
        approved: false
      },
      {
        id: '204',
        name: 'Иванова Екатерина Ивановна',
        position: 'Руководитель отдела разработки',
        approved: false
      }
    ],
    cost: '45000',
    goal: 'Освоение современных веб-технологий для улучшения качества разрабатываемых продуктов',
    documents: [
      {
        id: 'd3',
        name: 'Программа обучения.pdf',
        url: '/documents/program_nodejs.pdf',
        type: 'application/pdf'
      }
    ]
  },
  '3': {
    ...MOCK_EVENTS[2],
    location: 'Конференц-центр "Megatek", Москва',
    participants: [
      {
        id: '105',
        name: 'Сидорова Елена Викторовна',
        position: 'Ведущий аналитик данных',
        department: 'Аналитика'
      }
    ],
    approvers: [
      {
        id: '205',
        name: 'Кузнецов Игорь Владимирович',
        position: 'Директор по развитию',
        approved: true,
        approvedAt: '2025-01-15T09:45:00Z'
      },
      {
        id: '206',
        name: 'Морозова Светлана Алексеевна',
        position: 'Финансовый директор',
        approved: true,
        approvedAt: '2025-01-16T11:20:00Z'
      }
    ],
    cost: '120000',
    goal: 'Изучение последних тенденций в области машинного обучения и установление полезных контактов',
    comments:
      'Участие одобрено с условием обязательного проведения внутреннего семинара по итогам конференции',
    documents: [
      {
        id: 'd4',
        name: 'Программа конференции.pdf',
        url: '/documents/conference_program.pdf',
        type: 'application/pdf'
      },
      {
        id: 'd5',
        name: 'Отчет о посещении.docx',
        url: '/documents/report.docx',
        type: 'application/msword'
      },
      {
        id: 'd6',
        name: 'Презентация по итогам.pptx',
        url: '/documents/presentation.pptx',
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      }
    ]
  }
}

/**
 * Фильтрация мок-данных по заданным параметрам
 */
const filterEvents = (events: Event[], params?: Record<string, any>): Event[] => {
  if (!params || Object.keys(params).length === 0) {
    return events
  }

  return events.filter((event) => {
    for (const [key, value] of Object.entries(params)) {
      if (value && event[key as keyof Event] !== value) {
        return false
      }
    }
    return true
  })
}

/**
 * API для работы с мероприятиями
 */
export const eventApi = {
  /**
   * Получение списка всех мероприятий с возможностью фильтрации
   * @param params Параметры фильтрации
   */
  getEvents: async (params?: Record<string, any>): Promise<Event[]> => {
    try {
      // const { data } = await api.get<Event[]>('/application', { params });
      // return data;

      await delay(1000)
      return filterEvents(MOCK_EVENTS, params)
    } catch (error) {
      console.error('Ошибка при получении списка мероприятий:', error)
      throw error
    }
  },

  /**
   * Получение детальной информации о мероприятии по ID
   * @param id Идентификатор мероприятия
   */
  getEventById: async (id: string): Promise<EventDetails> => {
    try {
      // const { data } = await api.get<EventDetails>(`/application/${id}`);
      // return data;

      await delay(800)

      if (MOCK_EVENT_DETAILS[id]) {
        return MOCK_EVENT_DETAILS[id]
      }

      const event = MOCK_EVENTS.find((e) => e.id === id)
      if (!event) {
        throw new Error(`Мероприятие с ID ${id} не найдено`)
      }

      return {
        ...event,
        location: undefined,
        participants: [],
        approvers: [],
        cost: undefined,
        goal: undefined,
        comments: undefined,
        documents: []
      }
    } catch (error) {
      console.error(`Ошибка при получении информации о мероприятии с ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Создание нового мероприятия
   * @param event Данные мероприятия для создания
   */
  createEvent: async (event: Partial<Event>): Promise<Event> => {
    try {
      // const { data } = await api.post<Event>('/application', event);
      // return data;

      await delay(1500)

      const newEvent: Event = {
        id: `${Math.floor(Math.random() * 1000)}`,
        title: event.title || 'Новое мероприятие',
        description: event.description,
        type: event.type || 'course',
        format: event.format || 'online',
        category: event.category || 'hard-skills',
        status: 'pending',
        startDate: event.startDate || new Date().toISOString(),
        endDate: event.endDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        employee: event.employee
      }

      MOCK_EVENTS.push(newEvent)

      return newEvent
    } catch (error) {
      console.error('Ошибка при создании мероприятия:', error)
      throw error
    }
  },

  /**
   * Обновление существующего мероприятия
   * @param id Идентификатор мероприятия
   * @param event Данные мероприятия для обновления
   */
  updateEvent: async (id: string, event: Partial<Event>): Promise<Event> => {
    try {
      // const { data } = await api.put<Event>(`/application/${id}`, event);
      // return data;

      await delay(1200)

      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === id)
      if (eventIndex === -1) {
        throw new Error(`Мероприятие с ID ${id} не найдено`)
      }

      const updatedEvent: Event = {
        ...MOCK_EVENTS[eventIndex],
        ...event,
        updatedAt: new Date().toISOString()
      }

      MOCK_EVENTS[eventIndex] = updatedEvent

      if (MOCK_EVENT_DETAILS[id]) {
        MOCK_EVENT_DETAILS[id] = {
          ...MOCK_EVENT_DETAILS[id],
          ...event,
          updatedAt: new Date().toISOString()
        }
      }

      return updatedEvent
    } catch (error) {
      console.error(`Ошибка при обновлении мероприятия с ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Удаление мероприятия
   * @param id Идентификатор мероприятия
   */
  deleteEvent: async (id: string): Promise<void> => {
    try {
      // await api.delete(`/application/${id}`);

      await delay(800)

      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === id)
      if (eventIndex === -1) {
        throw new Error(`Мероприятие с ID ${id} не найдено`)
      }

      MOCK_EVENTS.splice(eventIndex, 1)

      if (MOCK_EVENT_DETAILS[id]) {
        delete MOCK_EVENT_DETAILS[id]
      }
    } catch (error) {
      console.error(`Ошибка при удалении мероприятия с ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Согласование мероприятия
   * @param id Идентификатор мероприятия
   */
  approveEvent: async (id: string): Promise<Event> => {
    try {
      // const { data } = await api.post<Event>(`/application/${id}/approve`);
      // return data;

      await delay(1000)

      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === id)
      if (eventIndex === -1) {
        throw new Error(`Мероприятие с ID ${id} не найдено`)
      }

      const updatedEvent: Event = {
        ...MOCK_EVENTS[eventIndex],
        status: 'approved',
        updatedAt: new Date().toISOString()
      }

      MOCK_EVENTS[eventIndex] = updatedEvent

      if (MOCK_EVENT_DETAILS[id]) {
        const updatedDetails = { ...MOCK_EVENT_DETAILS[id] }

        updatedDetails.status = 'approved'
        updatedDetails.updatedAt = new Date().toISOString()

        if (updatedDetails.approvers) {
          updatedDetails.approvers = updatedDetails.approvers.map((approver) => ({
            ...approver,
            approved: true,
            approvedAt: approver.approvedAt || new Date().toISOString()
          }))
        }

        MOCK_EVENT_DETAILS[id] = updatedDetails
      }

      return updatedEvent
    } catch (error) {
      console.error(`Ошибка при согласовании мероприятия с ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Отклонение мероприятия
   * @param id Идентификатор мероприятия
   * @param reason Причина отклонения
   */
  rejectEvent: async (id: string, reason: string): Promise<Event> => {
    try {
      // const { data } = await api.post<Event>(`/application/${id}/reject`, { reason });
      // return data;

      await delay(1000)

      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === id)
      if (eventIndex === -1) {
        throw new Error(`Мероприятие с ID ${id} не найдено`)
      }

      const updatedEvent: Event = {
        ...MOCK_EVENTS[eventIndex],
        status: 'rejected',
        updatedAt: new Date().toISOString()
      }

      MOCK_EVENTS[eventIndex] = updatedEvent

      if (MOCK_EVENT_DETAILS[id]) {
        const updatedDetails = { ...MOCK_EVENT_DETAILS[id] }

        updatedDetails.status = 'rejected'
        updatedDetails.updatedAt = new Date().toISOString()

        updatedDetails.comments = updatedDetails.comments
          ? `${updatedDetails.comments}\n\nПричина отклонения: ${reason}`
          : `Причина отклонения: ${reason}`

        MOCK_EVENT_DETAILS[id] = updatedDetails
      }

      return updatedEvent
    } catch (error) {
      console.error(`Ошибка при отклонении мероприятия с ID ${id}:`, error)
      throw error
    }
  }
}
