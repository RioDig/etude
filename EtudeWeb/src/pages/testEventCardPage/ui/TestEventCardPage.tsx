import React, { useState } from 'react'
import { EventCard } from '@/shared/ui/eventCard'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'

// Моковые данные для демонстрации
const mockEvents = [
  {
    id: "event-1",
    tags: [
      { id: "conference", label: "Конференция" },
      { id: "offline", label: "Очно" },
      { id: "soft-skills", label: "Soft skills" }
    ],
    title: "Эффективная коммуникация в команде",
    description: "Курс направлен на развитие навыков эффективного взаимодействия в команде. Курс направлен на развитие навыков эффективного взаимодействия в команде.",
    startDate: "2025-02-14",
    endDate: "2025-02-16",
    detailsUrl: "/events/event-1"
  },
  {
    id: "event-2",
    tags: [
      { id: "workshop", label: "Воркшоп" },
      { id: "online", label: "Онлайн" },
      { id: "tech", label: "Technical" }
    ],
    title: "Основы React разработки",
    description: "Интенсивный курс по основам React, от базовых концепций до продвинутых паттернов.",
    startDate: "2025-03-01",
    endDate: "2025-03-15",
    detailsUrl: "/events/event-2"
  },
  {
    id: "event-3",
    tags: [
      { id: "lecture", label: "Лекция" },
      { id: "hybrid", label: "Гибрид" }
    ],
    title: "Архитектура современных приложений",
    description: "Обзор современных архитектурных подходов в разработке приложений, включая FSD, Clean Architecture и SOLID.",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    detailsUrl: "/events/event-3"
  }
];


const TestEventCardPage: React.FC = () => {
  // Состояние для отслеживания выбранного события
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Обработчик выбора события
  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(prevId => prevId === eventId ? null : eventId);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Typography variant="h1" className="mb-6">
        Демонстрация компонента EventCard
      </Typography>

      <div className="mb-8">
        <Typography variant="h2" className="mb-4">
          Варианты состояний
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Default состояние */}
          <div>
            <Typography variant="b3Semibold" className="mb-2">Default</Typography>
            <EventCard
              id="demo-default"
              tags={[{ id: "1", label: "Default" }]}
              title="Стандартное состояние"
              description="Это стандартное состояние компонента без взаимодействий."
              startDate="2025-01-01"
              endDate="2025-01-05"
              detailsUrl="/example"
            />
          </div>

          {/* Hover состояние (имитация) */}
          <div>
            <Typography variant="b3Semibold" className="mb-2">Hover (имитация)</Typography>
            <div className="border border-mono-600 bg-mono-50 p-6 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center justify-center rounded-[4px] border border-mono-950/20 bg-mono-950/5 min-h-[26px] py-1 px-2 text-b4-regular">
                  Hover
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-b2 text-mono-950 mb-2">Состояние при наведении</h3>
                <p className="text-b3-regular text-mono-800">Это имитация состояния при наведении курсора.</p>
              </div>

              <div className="flex items-center">
                <div className="flex items-center">
                  <span className="text-mono-800">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                      <path fill="currentColor" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
                    </svg>
                  </span>
                  <span className="ml-1.5 text-b3-regular text-mono-800">01.01.2025 – 05.01.2025</span>
                </div>

                <div className="ml-auto">
                  <button className="text-blue-500 text-b4 hover:text-blue-700 hover:underline transition duration-100 ease-out">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Selected состояние */}
          <div>
            <Typography variant="b3Semibold" className="mb-2">Selected</Typography>
            <EventCard
              id="demo-selected"
              tags={[{ id: "1", label: "Selected" }]}
              title="Выбранное состояние"
              description="Это состояние компонента, когда он выбран пользователем."
              startDate="2025-01-01"
              endDate="2025-01-05"
              detailsUrl="/example"
              isSelected={true}
            />
          </div>
        </div>
      </div>

      {/* Интерактивная демонстрация */}
      <div>
        <Typography variant="h2" className="mb-4">
          Интерактивная демонстрация
        </Typography>

        <Typography variant="b3Regular" className="mb-6">
          Нажмите на карточку, чтобы выбрать мероприятие. Нажмите еще раз, чтобы отменить выбор.
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mockEvents.map(event => (
            <EventCard
              key={event.id}
              id={event.id}
              tags={event.tags}
              title={event.title}
              description={event.description}
              startDate={event.startDate}
              endDate={event.endDate}
              detailsUrl={event.detailsUrl}
              isSelected={selectedEventId === event.id}
              onClick={() => handleEventSelect(event.id)}
            />
          ))}
        </div>

        {selectedEventId && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-8">
            <Typography variant="b3Semibold" className="mb-2">
              Выбрано мероприятие: {mockEvents.find(e => e.id === selectedEventId)?.title}
            </Typography>
            <Button
              variant="primary"
              onClick={() => setSelectedEventId(null)}
            >
              Очистить выбор
            </Button>
          </div>
        )}
      </div>

      {/* Код компонента */}
      <div>
        <Typography variant="h2" className="mb-4">
          Пример использования компонента
        </Typography>

        <pre className="bg-mono-100 p-4 rounded-md overflow-auto text-sm">
          {`import { EventCard } from '@/shared/ui/eventCard';

// В компоненте
const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

const handleEventSelect = (eventId: string) => {
  setSelectedEventId(prevId => prevId === eventId ? null : eventId);
};

return (
  <EventCard
    id="event-1"
    tags={[
      { id: "conference", label: "Конференция" },
      { id: "offline", label: "Очно" },
      { id: "soft-skills", label: "Soft skills" }
    ]}
    title="Эффективная коммуникация в команде"
    description="Курс направлен на развитие навыков эффективного взаимодействия в команде."
    startDate="2025-02-14"
    endDate="2025-02-16"
    detailsUrl="/events/event-1"
    isSelected={selectedEventId === "event-1"}
    onClick={() => handleEventSelect("event-1")}
  />
);`}
        </pre>
      </div>
    </div>
  );
};

export default TestEventCardPage;