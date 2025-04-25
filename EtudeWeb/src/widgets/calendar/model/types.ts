// src/widgets/calendar/model/types.ts

// Режимы отображения календаря
export type CalendarViewMode = 'month' | 'week' | 'half-year';

// Статусы карточек/событий
export type CardStatus = 'pending' | 'approved' | 'rejected' | 'completed';

// Тип для тегов на карточке
export interface CalendarCardTag {
  id: string;
  label: string;
}

// Формат обучения
export type TrainingFormat = 'offline' | 'online' | 'mixed';

// Категория обучения
export type TrainingCategory = 'hard-skills' | 'soft-skills' | 'management';

// Тип обучения
export type TrainingType = 'course' | 'conference' | 'webinar' | 'training';

// Основная модель карточки/события в календаре
export interface CalendarCard {
  id: string;
  title: string;
  status: CardStatus;
  startDate: Date;
  endDate: Date;
  description: string;
  employee: string;
  format: TrainingFormat;
  category: TrainingCategory;
  type: TrainingType;
}

// Пропсы для основного компонента календаря
export interface CalendarProps {
  cards: CalendarCard[];
  initialViewMode?: CalendarViewMode;
  initialDate?: Date;
  className?: string;
  onCardClick?: (card: CalendarCard) => void;
  onDateChange?: (date: Date) => void;
  onViewModeChange?: (mode: CalendarViewMode) => void;
}

// Пропсы для контейнера календаря
export interface CalendarContainerProps {
  cards: CalendarCard[];
  onAddCard?: () => void;
  initialViewMode?: CalendarViewMode;
  initialDate?: Date;
  className?: string;
  onCardClick?: (card: CalendarCard) => void;
}

// Внутренние типы для компонентов (могут быть приватными если нужно)
export interface DistributedCard {
  card: CalendarCard;
  startCol: number;
  endCol: number;
}

// Вспомогательный тип для результата алгоритма распределения карточек
export interface CardDistributionResult {
  distributedCards: Array<DistributedCard[]>;
  maxRows: number;
}