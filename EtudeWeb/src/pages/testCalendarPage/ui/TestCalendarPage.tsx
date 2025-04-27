// src/pages/testCalendarPage/ui/TestCalendarPage.tsx
import React, { useState } from 'react'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Tag } from '@/shared/ui/tag'
import { notification } from '@/shared/lib/notification'
import { Sidebar } from '@/widgets/sidebar'
import { CalendarCard, CalendarContainer } from '@/widgets/calendar'

// Вспомогательная функция для создания даты
const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day)
}

// Функция для создания случайной карточки курса
const createRandomCard = (id: string): CalendarCard => {
  // Случайные статусы
  const statuses: Array<'pending' | 'approved' | 'rejected' | 'completed'> = [
    'pending',
    'approved',
    'rejected',
    'completed'
  ]

  // Случайные форматы обучения
  const formats: Array<'offline' | 'online' | 'mixed'> = ['offline', 'online', 'mixed']

  // Случайные категории
  const categories: Array<'hard-skills' | 'soft-skills' | 'management'> = [
    'hard-skills',
    'soft-skills',
    'management'
  ]

  // Случайные типы
  const types: Array<'course' | 'conference' | 'webinar' | 'training'> = [
    'course',
    'conference',
    'webinar',
    'training'
  ]

  // Случайные названия курсов
  const titles = [
    'UX/UI дизайн для начинающих',
    'Продвинутый JavaScript',
    'Python для анализа данных',
    'Управление IT-проектами',
    'DevOps практики',
    'Soft Skills для IT-специалистов',
    'React для фронтенд-разработчиков',
    'Основы информационной безопасности',
    'Машинное обучение',
    'Базы данных и SQL'
  ]

  // Случайные имена сотрудников
  const employees = [
    'Иванов Иван',
    'Петров Петр',
    'Сидорова Анна',
    'Козлов Дмитрий',
    'Смирнова Екатерина',
    'Новиков Алексей',
    'Морозов Владимир'
  ]

  // Генерируем случайную дату начала и конца (январь-март 2025)
  const startMonth = Math.floor(Math.random() * 3) + 1 // 1-3 (январь-март)
  const startDay = Math.floor(Math.random() * 28) + 1 // 1-28
  const duration = Math.floor(Math.random() * 14) + 1 // 1-14 дней

  const startDate = createDate(2025, startMonth, startDay)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + duration)

  return {
    id,
    title: titles[Math.floor(Math.random() * titles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    startDate,
    endDate,
    description: `Обучающий курс для развития навыков специалистов. Длительность: ${duration} дней.`,
    employee: employees[Math.floor(Math.random() * employees.length)],
    format: formats[Math.floor(Math.random() * formats.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)]
  }
}

// Моковые данные для демонстрации
const mockCards: CalendarCard[] = [
  {
    id: '1',
    title: 'UX/UI-дизайнер Plus',
    status: 'approved',
    startDate: createDate(2025, 1, 1),
    endDate: createDate(2025, 2, 5),
    description:
      'Курс для продвинутых UI/UX дизайнеров, включающий современные тренды и инструменты',
    employee: 'Иванов Иван',
    format: 'online',
    category: 'hard-skills',
    type: 'course'
  },
  {
    id: '2',
    title: 'Системный аналитик. Как пережить проектирование системы',
    status: 'approved',
    startDate: createDate(2025, 1, 1),
    endDate: createDate(2025, 1, 31),
    description: 'Интенсивный курс по системному анализу с практическими заданиями',
    employee: 'Петров Петр',
    format: 'mixed',
    category: 'hard-skills',
    type: 'webinar'
  },
  {
    id: '3',
    title: 'Основы работы с Figma',
    status: 'pending',
    startDate: createDate(2025, 1, 8),
    endDate: createDate(2025, 1, 12),
    description: 'Базовые навыки работы с Figma, создание прототипов и дизайн-систем',
    employee: 'Сидорова Анна',
    format: 'online',
    category: 'hard-skills',
    type: 'course'
  },
  {
    id: '4',
    title: 'Пользовательские исследования',
    status: 'rejected',
    startDate: createDate(2025, 1, 15),
    endDate: createDate(2025, 1, 19),
    description: 'Методы проведения пользовательских исследований и анализа полученных данных',
    employee: 'Козлов Дмитрий',
    format: 'offline',
    category: 'hard-skills',
    type: 'training'
  },
  {
    id: '5',
    title: 'Эффективные коммуникации',
    status: 'completed',
    startDate: createDate(2025, 1, 1),
    endDate: createDate(2025, 1, 11),
    description: 'Развитие навыков эффективного общения в команде и с клиентами',
    employee: 'Смирнова Екатерина',
    format: 'offline',
    category: 'soft-skills',
    type: 'training'
  },
  {
    id: '6',
    title: 'Аналитик с 0 до PRO',
    status: 'pending',
    startDate: createDate(2025, 1, 1),
    endDate: createDate(2025, 1, 7),
    description: 'Полный курс обучения профессии аналитика с нуля до профессионального уровня',
    employee: 'Новиков Алексей',
    format: 'online',
    category: 'hard-skills',
    type: 'course'
  },
  {
    id: '7',
    title: 'Управление IT-командой',
    status: 'approved',
    startDate: createDate(2025, 1, 20),
    endDate: createDate(2025, 1, 25),
    description: 'Стратегии эффективного управления командой разработчиков и дизайнеров',
    employee: 'Морозов Владимир',
    format: 'mixed',
    category: 'management',
    type: 'conference'
  },
  {
    id: '8',
    title: 'Адаптивный веб-дизайн',
    status: 'rejected',
    startDate: createDate(2025, 1, 10),
    endDate: createDate(2025, 1, 30),
    description: 'Создание адаптивных интерфейсов для различных устройств и разрешений экрана',
    employee: 'Соколова Мария',
    format: 'online',
    category: 'hard-skills',
    type: 'course'
  },
  {
    id: '9',
    title: 'Product Management',
    status: 'pending',
    startDate: createDate(2025, 2, 1),
    endDate: createDate(2025, 2, 15),
    description: 'Основы управления продуктом, работа с требованиями и разработка стратегии',
    employee: 'Васильев Николай',
    format: 'mixed',
    category: 'management',
    type: 'course'
  },
  {
    id: '10',
    title: 'Публичные выступления',
    status: 'approved',
    startDate: createDate(2025, 1, 5),
    endDate: createDate(2025, 1, 5),
    description: 'Навыки эффективных выступлений перед аудиторией, подготовка презентаций',
    employee: 'Королева Анастасия',
    format: 'offline',
    category: 'soft-skills',
    type: 'training'
  }
]

export const TestCalendarPage: React.FC = () => {
  const [cards, setCards] = useState<CalendarCard[]>(mockCards)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CalendarCard | null>(null)

  // Функция для добавления нового случайного курса
  const handleAddCard = () => {
    setIsSidebarOpen(true)
    setSelectedCard(null)
  }

  // Функция для создания нового курса
  const handleCreateCourse = () => {
    const newId = `card-${cards.length + 1}`
    const newCard = createRandomCard(newId)

    setCards((prevCards) => [...prevCards, newCard])
    setIsSidebarOpen(false)

    notification.success({
      title: 'Курс добавлен',
      description: `Курс "${newCard.title}" успешно добавлен в календарь`
    })
  }

  // Обработчик клика по карточке
  const handleCardClick = (card: CalendarCard) => {
    setSelectedCard(card)
    setIsSidebarOpen(true)
  }

  // Генерация нескольких случайных курсов
  const handleGenerateRandomCards = () => {
    const newCards: CalendarCard[] = []
    const count = 5 // Количество генерируемых карточек

    for (let i = 0; i < count; i++) {
      const newId = `random-${cards.length + i + 1}`
      newCards.push(createRandomCard(newId))
    }

    setCards((prevCards) => [...prevCards, ...newCards])

    notification.success({
      title: 'Курсы добавлены',
      description: `${count} случайных курсов успешно добавлены в календарь`
    })
  }

  // Сброс к начальным данным
  const handleResetCards = () => {
    setCards(mockCards)

    notification.info({
      title: 'Сброс календаря',
      description: 'Календарь сброшен к исходным данным'
    })
  }

  // Удаление всех курсов для демонстрации пустого состояния
  const handleRemoveAllCards = () => {
    setCards([])

    notification.info({
      title: 'Курсы удалены',
      description: 'Все курсы удалены для демонстрации пустого состояния'
    })
  }

  // Формирование контента сайдбара на основе выбранной карточки или режима добавления
  const renderSidebarContent = () => {
    if (selectedCard) {
      // Сайдбар с информацией о карточке
      return (
        <>
          <div className="mb-6">
            <Typography variant="b3Semibold" className="mb-2">
              Период обучения:
            </Typography>
            <Typography variant="b3Regular">
              {selectedCard.startDate.toLocaleDateString()} -{' '}
              {selectedCard.endDate.toLocaleDateString()}
            </Typography>
          </div>

          <div className="mb-6">
            <Typography variant="b3Semibold" className="mb-2">
              Описание:
            </Typography>
            <Typography variant="b3Regular">{selectedCard.description}</Typography>
          </div>

          <div className="mb-6">
            <Typography variant="b3Semibold" className="mb-2">
              Сотрудник:
            </Typography>
            <Typography variant="b3Regular">{selectedCard.employee}</Typography>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Tag>
              {selectedCard.format === 'online'
                ? 'Дистанционный'
                : selectedCard.format === 'offline'
                  ? 'Очный'
                  : 'Смешанный'}
            </Tag>
            <Tag>
              {selectedCard.category === 'hard-skills'
                ? 'Hard Skills'
                : selectedCard.category === 'soft-skills'
                  ? 'Soft Skills'
                  : 'Management'}
            </Tag>
            <Tag>
              {selectedCard.type === 'course'
                ? 'Курс'
                : selectedCard.type === 'webinar'
                  ? 'Вебинар'
                  : selectedCard.type === 'conference'
                    ? 'Конференция'
                    : 'Тренинг'}
            </Tag>
          </div>
        </>
      )
    } else {
      // Сайдбар с формой добавления нового курса
      return (
        <div className="text-center my-10">
          <Typography variant="b3Regular" className="mb-4">
            Эта демо-версия позволяет добавлять только случайно сгенерированные курсы.
          </Typography>

          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <Tag>Hard Skills</Tag>
            <Tag>Soft Skills</Tag>
            <Tag>Management</Tag>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Tag>Курс</Tag>
            <Tag>Вебинар</Tag>
            <Tag>Конференция</Tag>
            <Tag>Тренинг</Tag>
          </div>
        </div>
      )
    }
  }

  // Формирование заголовка и футера сайдбара на основе выбранной карточки
  const getSidebarProps = () => {
    if (selectedCard) {
      return {
        title: selectedCard.title,
        description: `Статус: ${
          selectedCard.status === 'approved'
            ? 'Согласовано'
            : selectedCard.status === 'pending'
              ? 'На согласовании'
              : selectedCard.status === 'rejected'
                ? 'Отклонено'
                : 'Пройдено'
        }`,
        badge: {
          text:
            selectedCard.status === 'approved'
              ? 'Согласовано'
              : selectedCard.status === 'pending'
                ? 'На согласовании'
                : selectedCard.status === 'rejected'
                  ? 'Отклонено'
                  : 'Пройдено',
        variant:
            selectedCard.status === 'approved'
              ? 'success'
              : selectedCard.status === 'pending'
                ? 'warning'
                : selectedCard.status === 'rejected'
                  ? 'error'
                  : 'default'
        },
        footerActions: [
          {
            label: 'Закрыть',
            onClick: () => {
              setIsSidebarOpen(false)
              setSelectedCard(null)
            },
            variant: 'third'
          },
          {
            label: 'Редактировать',
            onClick: () => {
              notification.info({
                title: 'Редактирование',
                description: 'Функция редактирования пока не реализована'
              })
            }
          }
        ]
      }
    } else {
      return {
        title: 'Добавление нового курса',
        description: 'Заполните форму для добавления курса в календарь',
        badge: { text: 'Новый курс', variant: 'success' },
        footerActions: [
          {
            label: 'Отмена',
            onClick: () => setIsSidebarOpen(false),
            variant: 'third'
          },
          {
            label: 'Добавить случайный курс',
            onClick: handleCreateCourse,
            variant: 'primary'
          }
        ]
      }
    }
  }

  const sidebarProps = getSidebarProps()

  // @ts-ignore
  return (
    <div className="p-6 bg-mono-50 min-h-screen">
      <Typography variant="h1" className="mb-6">
        Демонстрация компонента Calendar с фильтрами
      </Typography>

      <div className="mb-6">
        <Typography variant="b3Regular">
          Календарь событий обучения с фильтрами и двумя режимами отображения: месяц и неделя. Вы
          можете фильтровать курсы по статусу, формату, категории и типу, а также переключаться
          между представлениями.
        </Typography>
      </div>

      {/* Панель управления */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button variant="primary" onClick={handleAddCard}>
          Добавить курс
        </Button>

        <Button variant="secondary" onClick={handleGenerateRandomCards}>
          Сгенерировать 5 случайных курсов
        </Button>

        <Button variant="third" onClick={handleResetCards}>
          Сбросить к исходным данным
        </Button>

        <Button variant="third" onClick={handleRemoveAllCards}>
          Удалить все курсы
        </Button>
      </div>

      {/* Контейнер с календарем */}
      <div className="mb-8">
        <CalendarContainer
          cards={cards}
          onAddCard={handleAddCard}
          onCardClick={handleCardClick}
          initialViewMode="month"
          initialDate={new Date(2025, 0, 15)} // 15 января 2025
          pageId="test-calendar"
        />
      </div>

      {/* Информация о компоненте */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Typography variant="h2" className="mb-4">
          Особенности реализации с фильтрами
        </Typography>

        <div className="space-y-4 text-b4-regular">
          <p>
            <strong>Фильтрация данных:</strong> Компонент поддерживает фильтрацию по различным
            параметрам: статус, формат, категория и тип обучения.
          </p>

          <p>
            <strong>EmptyMessage:</strong> Когда нет данных для отображения в выбранном периоде или
            при применении фильтров, отображается сообщение о пустом состоянии.
          </p>

          <p>
            <strong>Режимы отображения:</strong> Фильтры не влияют на выбор между представлениями
            неделя/месяц, которые можно переключать независимо.
          </p>

          <p>
            <strong>Сохранение состояния фильтров:</strong> Состояние фильтров сохраняется между
            навигациями по календарю для удобства использования.
          </p>

          <p>
            <strong>Адаптивный дизайн:</strong> Фильтры и элементы управления адаптируются к разным
            размерам экрана, сохраняя доступность на мобильных устройствах.
          </p>
        </div>
      </div>

      {/* Сайдбар для добавления нового курса или просмотра информации */}
      <Sidebar
        open={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false)
          setSelectedCard(null)
        }}
        title={sidebarProps.title}
        description={sidebarProps.description}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        badge={sidebarProps.badge}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        footerActions={sidebarProps.footerActions}
      >
        {renderSidebarContent()}
      </Sidebar>
    </div>
  )
}

export default TestCalendarPage
