import { Button } from '@/shared/ui/button/Button'
import { Typography } from '@/shared/ui/typography'
import { useState } from 'react'

import { Fullscreen, ArrowForward } from '@mui/icons-material'

const TestButtonPage = () => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'size' | 'state' | 'variant' | 'icon' | 'link'
  >('all')

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab)
  }

  const renderTabs = () => {
    const tabs = [
      { id: 'all', label: 'Все варианты' },
      { id: 'size', label: 'Размеры' },
      { id: 'variant', label: 'Варианты' },
      { id: 'state', label: 'Состояния' },
      { id: 'icon', label: 'С иконками' },
      { id: 'link', label: 'Ссылки' }
    ] as const

    return (
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 border rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-mono-800 hover:bg-mono-100'
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  const renderAllVariants = () => {
    return (
      <div className="space-y-12">
        <div>
          <Typography variant="h2" className="mb-4">
            Все варианты кнопок
          </Typography>
          <Typography variant="b3Regular" className="mb-6">
            Полная демонстрация всех вариантов кнопок согласно дизайн-системе
          </Typography>

          {renderSizes()}
          {renderVariants()}
          {renderStates()}
          {renderIconButtons()}
          {renderLinkButtons()}
        </div>
      </div>
    )
  }

  const renderSizes = () => {
    return (
      <div className="space-y-8 mb-12">
        <Typography variant="h2" as="h2" className={activeTab !== 'all' ? 'mb-4' : ''}>
          Размеры кнопок
        </Typography>

        {activeTab !== 'all' && (
          <Typography variant="b3Regular" className="mb-6">
            Кнопки имеют три стандартных размера: large (52px), medium (40px) и small (36px)
          </Typography>
        )}

        <div className="space-y-10">
          {/* Large - 52px */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              Large - 52px (text-b2)
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="large">
                Button
              </Button>
              <Button variant="secondary" size="large">
                Button
              </Button>
              <Button variant="third" size="large">
                Button
              </Button>
            </div>
          </div>

          {/* Medium - 40px */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              Medium - 40px (text-b3)
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="medium">
                Button
              </Button>
              <Button variant="secondary" size="medium">
                Button
              </Button>
              <Button variant="third" size="medium">
                Button
              </Button>
            </div>
          </div>

          {/* Small - 36px */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              Small - 36px (text-b4)
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="small">
                Button
              </Button>
              <Button variant="secondary" size="small">
                Button
              </Button>
              <Button variant="third" size="small">
                Button
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderVariants = () => {
    return (
      <div className="space-y-8 mb-12">
        <Typography variant="h2" as="h2" className={activeTab !== 'all' ? 'mb-4' : ''}>
          Варианты кнопок
        </Typography>

        {activeTab !== 'all' && (
          <Typography variant="b3Regular" className="mb-6">
            Кнопки имеют три варианта: primary (синяя), secondary (белая с рамкой) и third (белая
            без рамки)
          </Typography>
        )}

        <div className="space-y-10">
          {/* Primary */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              Primary
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="large">
                Button
              </Button>
              <Button variant="primary" size="medium">
                Button
              </Button>
              <Button variant="primary" size="small">
                Button
              </Button>
            </div>
          </div>

          {/* Secondary */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              Secondary
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary" size="large">
                Button
              </Button>
              <Button variant="secondary" size="medium">
                Button
              </Button>
              <Button variant="secondary" size="small">
                Button
              </Button>
            </div>
          </div>

          {/* Third */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              Third
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="third" size="large">
                Button
              </Button>
              <Button variant="third" size="medium">
                Button
              </Button>
              <Button variant="third" size="small">
                Button
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStates = () => {
    return (
      <div className="space-y-8 mb-12">
        <Typography variant="h2" as="h2" className={activeTab !== 'all' ? 'mb-4' : ''}>
          Состояния кнопок
        </Typography>

        {activeTab !== 'all' && (
          <Typography variant="b3Regular" className="mb-6">
            Кнопки имеют пять состояний: default, hover, pressed (active), focus и disabled
          </Typography>
        )}

        <div className="space-y-6">
          {/* Default */}
          <div className="p-4 border rounded-md">
            <Typography variant="b3Semibold" className="mb-4">
              Default
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="medium">
                Button
              </Button>
              <Button variant="secondary" size="medium">
                Button
              </Button>
              <Button variant="third" size="medium">
                Button
              </Button>
            </div>
          </div>

          {/* Hover - для демонстрации придется использовать стили напрямую */}
          <div className="p-4 border rounded-md">
            <Typography variant="b3Semibold" className="mb-4">
              Hover (симуляция)
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-blue-600 text-white rounded-md border border-blue-600 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
              <div className="bg-white text-mono-900 rounded-md border border-mono-900 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
              <div className="bg-mono-200 text-mono-900 rounded-md border border-mono-200 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
            </div>
          </div>

          {/* Pressed (Active) - для демонстрации придется использовать стили напрямую */}
          <div className="p-4 border rounded-md">
            <Typography variant="b3Semibold" className="mb-4">
              Pressed / Active (симуляция)
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-blue-700 text-white rounded-md border border-blue-700 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
              <div className="bg-white text-mono-950 rounded-md border border-mono-950 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
              <div className="bg-mono-300 text-mono-900 rounded-md border border-mono-300 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
            </div>
          </div>

          {/* Focus - для демонстрации придется использовать стили напрямую */}
          <div className="p-4 border rounded-md">
            <Typography variant="b3Semibold" className="mb-4">
              Focus (симуляция)
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-blue-400 text-white rounded-md border border-purple-600 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
              <div className="bg-white text-mono-950 rounded-md border border-purple-600 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
              <div className="bg-white text-mono-900 rounded-md border border-purple-600 inline-flex items-center justify-center h-[40px] px-4 py-2 text-b3">
                Button
              </div>
            </div>
          </div>

          {/* Disabled */}
          <div className="p-4 border rounded-md">
            <Typography variant="b3Semibold" className="mb-4">
              Disabled
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="medium" disabled>
                Button
              </Button>
              <Button variant="secondary" size="medium" disabled>
                Button
              </Button>
              <Button variant="third" size="medium" disabled>
                Button
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Button as="a" href="#" variant="third" size="medium" disabled>
                Link
              </Button>
            </div>
            <div className="text-mono-700 text-b4 mt-2">
              <Typography variant="b4Semibold" className="mb-1">
                Disabled состояния согласно макету:
              </Typography>
              <ul className="list-disc pl-5">
                <li>Primary: bg Mono/200, text Mono/500</li>
                <li>Secondary: bg white, border Mono/400, text Mono/400</li>
                <li>Third: bg transparent, border transparent, text Mono/400</li>
                <li>Link: text Mono/500</li>
              </ul>
            </div>
          </div>

          {/* Интерактивный пример */}
          <div className="p-4 border rounded-md bg-mono-50">
            <Typography variant="b3Semibold" className="mb-4">
              Интерактивный пример (наведите, нажмите, сфокусируйтесь)
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="medium">
                Навести / Нажать
              </Button>
              <Button variant="secondary" size="medium">
                Навести / Нажать
              </Button>
              <Button variant="third" size="medium">
                Навести / Нажать
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderIconButtons = () => {
    return (
      <div className="space-y-8 mb-12">
        <Typography variant="h2" as="h2" className={activeTab !== 'all' ? 'mb-4' : ''}>
          Кнопки с иконками
        </Typography>

        {activeTab !== 'all' && (
          <Typography variant="b3Regular" className="mb-6">
            Кнопки могут содержать иконки слева, справа или с обеих сторон
          </Typography>
        )}

        <div className="space-y-10">
          {/* Иконка слева */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              С иконкой слева
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="large" leftIcon={<Fullscreen />}>
                Button
              </Button>
              <Button variant="secondary" size="medium" leftIcon={<Fullscreen />}>
                Button
              </Button>
              <Button variant="third" size="small" leftIcon={<Fullscreen />}>
                Button
              </Button>
            </div>
          </div>

          {/* Иконка справа */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              С иконкой справа
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="large" rightIcon={<ArrowForward />}>
                Button
              </Button>
              <Button variant="secondary" size="medium" rightIcon={<ArrowForward />}>
                Button
              </Button>
              <Button variant="third" size="small" rightIcon={<ArrowForward />}>
                Button
              </Button>
            </div>
          </div>

          {/* Иконки с обеих сторон */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              С иконками с обеих сторон
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="large"
                leftIcon={<Fullscreen />}
                rightIcon={<ArrowForward />}
              >
                Button
              </Button>
              <Button
                variant="secondary"
                size="medium"
                leftIcon={<Fullscreen />}
                rightIcon={<ArrowForward />}
              >
                Button
              </Button>
              <Button
                variant="third"
                size="small"
                leftIcon={<Fullscreen />}
                rightIcon={<ArrowForward />}
              >
                Button
              </Button>
            </div>
          </div>

          {/* Размеры иконок */}
          <div className="p-4 border border-mono-200 rounded-md">
            <Typography variant="b3Semibold" className="mb-4">
              Размеры иконок
            </Typography>
            <div className="space-y-2">
              <Typography variant="b4Regular">• large (52px) - иконка 28px</Typography>
              <Typography variant="b4Regular">• medium (40px) - иконка 24px</Typography>
              <Typography variant="b4Regular">• small (36px) - иконка 20px</Typography>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderLinkButtons = () => {
    return (
      <div className="space-y-8 mb-12">
        <Typography variant="h2" as="h2" className={activeTab !== 'all' ? 'mb-4' : ''}>
          Кнопки-ссылки
        </Typography>

        {activeTab !== 'all' && (
          <Typography variant="b3Regular" className="mb-6">
            Кнопки могут быть реализованы как HTML-ссылки (a) или React Router ссылки (Link)
          </Typography>
        )}

        <div className="space-y-10">
          {/* HTML-ссылки (as="a") */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              HTML-ссылки (as="a")
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button as="a" href="#" variant="primary" size="medium">
                Link
              </Button>
              <Button as="a" href="#" variant="secondary" size="medium">
                Link
              </Button>
              <Button as="a" href="#" variant="third" size="medium">
                Link
              </Button>
              <Button as="a" href="#" variant="third" size="medium" rightIcon={<ArrowForward />}>
                Link
              </Button>
            </div>
          </div>

          {/* React Router ссылки (as="link") */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              React Router ссылки (as="link")
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button as="link" to="#" variant="primary" size="medium">
                Link
              </Button>
              <Button as="link" to="#" variant="secondary" size="medium">
                Link
              </Button>
              <Button as="link" to="#" variant="third" size="medium">
                Link
              </Button>
              <Button as="link" to="#" variant="third" size="medium" rightIcon={<ArrowForward />}>
                Link
              </Button>
            </div>
          </div>

          {/* Отключенные ссылки */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              Отключенные ссылки
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button as="a" href="#" disabled variant="primary" size="medium">
                Disabled Link
              </Button>
              <Button as="link" to="#" disabled variant="secondary" size="medium">
                Disabled Link
              </Button>
              <Button
                as="a"
                href="#"
                disabled
                variant="third"
                size="medium"
                rightIcon={<ArrowForward />}
              >
                Disabled Link
              </Button>
            </div>
          </div>

          {/* Link типа third (Рекомендуется для ссылок) */}
          <div className="p-4 border border-mono-200 rounded-md">
            <Typography variant="b3Semibold" className="mb-4">
              Third вариант для ссылок (рекомендуется)
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button as="a" href="#" variant="third" size="medium">
                Third Link
              </Button>
              <Button as="a" href="#" variant="third" size="medium" rightIcon={<ArrowForward />}>
                Third Link
              </Button>
              <div className="block text-b4 text-mono-800 mt-2">
                Ссылки третьего типа (third) при наведении и нажатии получают подчеркивание
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAdvancedExamples = () => {
    if (activeTab !== 'all') return null

    return (
      <div className="space-y-8 mt-10 pt-10 border-t">
        <Typography variant="h2" as="h2" className="mb-6">
          Дополнительные примеры
        </Typography>

        <div className="space-y-10">
          {/* Fluid width */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              На всю ширину (fullWidth)
            </Typography>
            <div className="space-y-4 max-w-md">
              <Button variant="primary" size="large" fullWidth>
                Full Width Button
              </Button>
              <Button variant="secondary" size="medium" fullWidth>
                Full Width Button
              </Button>
              <Button variant="third" size="small" fullWidth>
                Full Width Button
              </Button>
            </div>
          </div>

          {/* В темной теме (имитация) */}
          <div className="p-6 bg-mono-950 rounded-md">
            <Typography variant="b3Semibold" className="mb-4 text-white">
              На темном фоне
            </Typography>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="medium">
                Button
              </Button>
              <Button variant="secondary" size="medium">
                Button
              </Button>
              <Button variant="third" size="medium">
                Button
              </Button>
            </div>
          </div>

          {/* В контексте формы */}
          <div>
            <Typography variant="b3Semibold" className="mb-4">
              В контексте формы
            </Typography>
            <div className="p-6 border rounded-md max-w-md">
              <form className="space-y-4">
                <div>
                  <label className="block text-b4 text-mono-800 mb-2">Имя пользователя</label>
                  <input type="text" className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-b4 text-mono-800 mb-2">Email</label>
                  <input type="email" className="w-full p-2 border rounded-md" />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="secondary" size="medium" type="button">
                    Отмена
                  </Button>
                  <Button variant="primary" size="medium" type="submit">
                    Сохранить
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Typography variant="h1" className="mb-2">
        Button Component
      </Typography>
      <Typography variant="b2Regular" className="mb-8 text-mono-800">
        Компонент кнопки для управления действиями в интерфейсе
      </Typography>

      {renderTabs()}

      {activeTab === 'all' && renderAllVariants()}
      {activeTab === 'size' && renderSizes()}
      {activeTab === 'variant' && renderVariants()}
      {activeTab === 'state' && renderStates()}
      {activeTab === 'icon' && renderIconButtons()}
      {activeTab === 'link' && renderLinkButtons()}

      {renderAdvancedExamples()}
    </div>
  )
}

export default TestButtonPage
