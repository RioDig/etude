import Tag from "@/shared/ui/tag/Tag";
import { Hint } from "@/shared/ui/hint";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useState } from "react";
import { HintPosition } from '@/shared/ui/hint/Hint'


const TestHintPage = () => {
  const [activePosition, setActivePosition] = useState<HintPosition>('default');

  const positions = [
    { id: 'default', label: 'По умолчанию' },
    { id: 'top-left', label: 'Слева сверху' },
    { id: 'top-right', label: 'Справа сверху' },
    { id: 'bottom-left', label: 'Слева снизу' },
    { id: 'bottom-right', label: 'Справа снизу' },
    { id: 'left', label: 'Слева' },
    { id: 'right', label: 'Справа' },
    { id: 'bottom', label: 'Снизу' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Typography variant="h1" className="mb-4">Компонент Hint</Typography>
      <Typography variant="b2Regular" className="mb-8">
        Hint (подсказка) отображает дополнительную информацию при наведении на элемент.
        Подсказка появляется с задержкой 100мс и исчезает с такой же задержкой при уходе курсора.
      </Typography>

      {/* Выбор позиции подсказки */}
      <div className="mb-8">
        <Typography variant="h2" className="mb-4">Позиционирование</Typography>
        <Typography variant="b3Regular" className="mb-4">
          По умолчанию Hint отображается в правом нижнем углу от курсора.
          При приближении к границам экрана позиция меняется автоматически.
          Можно также задать фиксированную позицию.
        </Typography>

        <div className="flex flex-wrap gap-2 mb-6">
          {positions.map(pos => (
            <button
              key={pos.id}
              className={`px-4 py-2 border rounded-md transition-colors ${
                activePosition === pos.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-mono-800 hover:bg-mono-100'
              }`}
              onClick={() => setActivePosition(pos.id as HintPosition)}
            >
              {pos.label}
            </button>
          ))}
        </div>

        <div className="border rounded-md p-12 flex justify-center items-center bg-mono-50 mb-8">
          <Hint
            content="Эта подсказка может располагаться в разных местах в зависимости от выбранной позиции"
            position={activePosition === 'default' ? undefined : activePosition}
            label="Позиционирование"
          >
            <Button variant="primary" size="medium">
              Наведите на меня
            </Button>
          </Hint>
        </div>
      </div>

      {/* Примеры с разными вариантами содержимого */}
      <Typography variant="h2" className="mb-4">Варианты содержимого</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Базовый пример */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">Базовый вариант</Typography>
          <div className="flex justify-center">
            <Hint content="Это простая подсказка только с основным текстом">
              <Button variant="secondary" size="medium">Базовый Hint</Button>
            </Hint>
          </div>
        </div>

        {/* С тегом (меткой) */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">С тегом-меткой</Typography>
          <div className="flex justify-center">
            <Hint
              label="Информация"
              content="Подсказка с тегом-меткой вверху"
            >
              <Button variant="secondary" size="medium">Hint с тегом</Button>
            </Hint>
          </div>
        </div>

        {/* С несколькими тегами */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">С несколькими тегами</Typography>
          <div className="flex justify-center">
            <Hint
              label={["Важно", "Новое", <Tag key="custom" className="bg-blue-100 border-blue-300">Специально</Tag>]}
              content="Подсказка может содержать несколько тегов с отступом 8px между ними."
            >
              <Button variant="secondary" size="medium">Hint с несколькими тегами</Button>
            </Hint>
          </div>
        </div>

        {/* С описанием */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">С описанием</Typography>
          <div className="flex justify-center">
            <Hint
              content="Основной текст подсказки"
              description="Дополнительное описание отображается серым цветом. Оно может содержать более подробную информацию."
            >
              <Button variant="secondary" size="medium">Hint с описанием</Button>
            </Hint>
          </div>
        </div>

        {/* С действиями */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">С действиями</Typography>
          <div className="flex justify-center">
            <Hint
              content="Подсказка может содержать кнопки действий"
              actions={
                <Button variant="primary" size="small">Действие</Button>
              }
            >
              <Button variant="secondary" size="medium">Hint с действием</Button>
            </Hint>
          </div>
        </div>

        {/* Полный пример */}
        <div className="border rounded-md p-6 md:col-span-2">
          <Typography variant="b3Semibold" className="mb-3">Полный пример</Typography>
          <div className="flex justify-center">
            <Hint
              label="Важная информация"
              content="Подсказка может содержать все элементы одновременно: тег-метку, основной текст, описание и действия."
              description="Это дополнительное описание содержит вспомогательную информацию. Текст описания отображается серым цветом."
              actions={
                <div className="flex gap-2">
                  <Button variant="primary" size="small">Принять</Button>
                  <Button variant="secondary" size="small">Отмена</Button>
                </div>
              }
            >
              <Button variant="primary" size="medium">Полный пример</Button>
            </Hint>
          </div>
        </div>
      </div>

      {/* Примеры использования для разных элементов */}
      <Typography variant="h2" className="mb-4">Варианты использования</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Для иконки */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">Для иконки</Typography>
          <div className="flex justify-center">
            <Hint content="Подсказка для иконки">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer">
                i
              </div>
            </Hint>
          </div>
        </div>

        {/* Для текстового элемента */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">Для текста</Typography>
          <div className="flex justify-center">
            <Hint content="Подсказка для текста">
              <span className="text-blue-500 underline cursor-pointer">
                Наведите на этот текст
              </span>
            </Hint>
          </div>
        </div>

        {/* Для отключенных элементов */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">Для отключенных элементов</Typography>
          <div className="flex justify-center">
            <Hint
              content="Эта функция недоступна в текущей версии"
              description="Обновите приложение для получения доступа к этой функции"
            >
              <Button variant="primary" size="medium" disabled>
                Отключенная кнопка
              </Button>
            </Hint>
          </div>
        </div>

        {/* Для элементов без текста */}
        <div className="border rounded-md p-6">
          <Typography variant="b3Semibold" className="mb-3">Для элементов без текста</Typography>
          <div className="flex justify-center">
            <Hint content="Кнопка без текста">
              <button
                className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center text-white"
                aria-label="Кнопка без текста"
              >
                +
              </button>
            </Hint>
          </div>
        </div>
      </div>

      {/* Примеры компонента Tag */}
      <Typography variant="h2" className="mb-4">Компонент Tag</Typography>
      <Typography variant="b3Regular" className="mb-4">
        Компонент Tag используется в Hint в качестве метки, но также может быть использован самостоятельно.
      </Typography>

      <div className="border rounded-md p-6 mb-8">
        <Typography variant="b3Semibold" className="mb-3">Варианты Tag</Typography>
        <div className="flex flex-wrap gap-3">
          <Tag size="medium">Medium Tag (26px)</Tag>
          <Tag size="small">Small Tag (22px)</Tag>
          <Tag className="bg-blue-100 border-blue-300">Кастомный Tag</Tag>
        </div>
      </div>
    </div>
  );
};

export default TestHintPage;