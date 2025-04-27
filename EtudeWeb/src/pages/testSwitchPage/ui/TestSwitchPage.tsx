import { useState } from 'react'
import {
  GridViewOutlined,
  ViewListOutlined,
  CalendarTodayOutlined,
  TableChartOutlined,
  FormatListBulletedOutlined,
  AppsOutlined,
  DashboardOutlined
} from '@mui/icons-material';
import { Switch } from '@/shared/ui/switch';
import { Typography } from '@/shared/ui/typography';

const TestSwitchPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [calendarView, setCalendarView] = useState('month');
  const [displayMode, setDisplayMode] = useState('list');
  const [textOnlyMode, setTextOnlyMode] = useState('new');
  const [iconOnlyMode, setIconOnlyMode] = useState('apps');

  return (
    <div className="p-8 flex flex-col gap-8">
      <Typography variant="h1" className="mb-6">Примеры компонента Switch</Typography>

      {/* Пример 1: Medium с иконками и текстом */}
      <div className="flex flex-col gap-4">
        <Typography variant="h2">Medium с иконками и текстом</Typography>
        <div className="flex items-center gap-4">
          <Switch
            options={[
              { id: 'grid', icon: <GridViewOutlined />, label: 'Сетка' },
              { id: 'list', icon: <ViewListOutlined />, label: 'Список' }
            ]}
            value={viewMode}
            onChange={setViewMode}
            size="medium"
          />
          <Typography variant="b3Regular">
            Выбрано: {viewMode === 'grid' ? 'Сетка' : 'Список'}
          </Typography>
        </div>
      </div>

      {/* Пример 2: Small с иконками и текстом */}
      <div className="flex flex-col gap-4">
        <Typography variant="h2">Small с иконками и текстом</Typography>
        <div className="flex items-center gap-4">
          <Switch
            options={[
              { id: 'day', icon: <GridViewOutlined />, label: 'День' },
              { id: 'week', icon: <GridViewOutlined />, label: 'Неделя' },
              { id: 'month', icon: <GridViewOutlined />, label: 'Месяц' }
            ]}
            value={calendarView}
            onChange={setCalendarView}
            size="small"
          />
          <Typography variant="b3Regular">
            Выбрано: {calendarView}
          </Typography>
        </div>
      </div>

      {/* Пример 3: Medium с несколькими опциями */}
      <div className="flex flex-col gap-4">
        <Typography variant="h2">Medium с несколькими опциями</Typography>
        <div className="flex items-center gap-4">
          <Switch
            options={[
              { id: 'table', icon: <TableChartOutlined />, label: 'Таблица' },
              { id: 'list', icon: <FormatListBulletedOutlined />, label: 'Список' },
              { id: 'calendar', icon: <CalendarTodayOutlined />, label: 'Календарь' }
            ]}
            value={displayMode}
            onChange={setDisplayMode}
            size="medium"
          />
          <Typography variant="b3Regular">
            Выбрано: {displayMode}
          </Typography>
        </div>
      </div>

      {/* Пример 4: Только текст */}
      <div className="flex flex-col gap-4">
        <Typography variant="h2">Только текст</Typography>
        <div className="flex items-center gap-4">
          <Switch
            options={[
              { id: 'new', label: 'Новые' },
              { id: 'in-progress', label: 'В работе' },
              { id: 'completed', label: 'Завершенные' }
            ]}
            value={textOnlyMode}
            onChange={setTextOnlyMode}
            size="medium"
          />
          <Typography variant="b3Regular">
            Выбрано: {textOnlyMode}
          </Typography>
        </div>
      </div>

      {/* Пример 5: Только иконки */}
      <div className="flex flex-col gap-4">
        <Typography variant="h2">Только иконки</Typography>
        <div className="flex items-center gap-4">
          <Switch
            options={[
              { id: 'apps', icon: <AppsOutlined /> },
              { id: 'list', icon: <ViewListOutlined /> },
              { id: 'dashboard', icon: <DashboardOutlined /> }
            ]}
            value={iconOnlyMode}
            onChange={setIconOnlyMode}
            size="small"
          />
          <Typography variant="b3Regular">
            Выбрано: {iconOnlyMode}
          </Typography>
        </div>
      </div>

      {/* Пример 6: Отключенные опции */}
      <div className="flex flex-col gap-4">
        <Typography variant="h2">С отключенными опциями</Typography>
        <div className="flex items-center gap-4">
          <Switch
            options={[
              { id: 'grid', icon: <GridViewOutlined />, label: 'Сетка' },
              { id: 'list', icon: <ViewListOutlined />, label: 'Список', disabled: true },
              { id: 'calendar', icon: <CalendarTodayOutlined />, label: 'Календарь' }
            ]}
            value="grid"
            onChange={() => {}}
            size="medium"
          />
        </div>
      </div>
    </div>
  );
};

export default TestSwitchPage;