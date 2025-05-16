import { Typography } from '@/shared/ui/typography'
import { typography } from '@/shared/ui/typography/typography'

export const TestTypographyPage = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-h1 mb-8">Типографика проекта</h1>

      <section>
        <h2 className="text-h2 mb-4">Заголовки (Headings)</h2>
        <div className="space-y-4 border p-4 rounded-md">
          <Typography variant="h1">H1 - 32px Semibold (32/100)</Typography>
          <Typography variant="h2">H2 - 24px Semibold (24/140)</Typography>
          <Typography variant="h2Regular">H2 - 24px Regular (24/140)</Typography>
        </div>
      </section>

      <section>
        <h2 className="text-h2 mb-4">Основной текст (Body)</h2>
        <div className="space-y-4 border p-4 rounded-md">
          <div>
            <Typography variant="b1">B1 - 20px Medium (20/130)</Typography>
            <div className="mt-1 text-mono-800">
              Примеры использования: крупные блоки текста, заголовки секций
            </div>
          </div>

          <div>
            <Typography variant="b2">B2 - 18px Medium (18/130)</Typography>
            <Typography variant="b2Regular">B2 - 18px Regular (18/130)</Typography>
            <div className="mt-1 text-mono-800">
              Примеры использования: подзаголовки, важные блоки информации
            </div>
          </div>

          <div>
            <Typography variant="b3Semibold">B3 - 16px Semibold (16/130)</Typography>
            <Typography variant="b3">B3 - 16px Medium (16/130)</Typography>
            <Typography variant="b3Regular">B3 - 16px Regular (16/130)</Typography>
            <div className="mt-1 text-mono-800">
              Примеры использования: основной текст интерфейса, кнопки
            </div>
          </div>

          <div>
            <Typography variant="b4Semibold">B4 - 14px Semibold (14/130)</Typography>
            <Typography variant="b4">B4 - 14px Medium (14/130)</Typography>
            <Typography variant="b4Regular">B4 - 14px Regular (14/130)</Typography>
            <Typography variant="b4Light">B4 - 14px Light (14/130)</Typography>
            <div className="mt-1 text-mono-800">
              Примеры использования: вспомогательный текст, подписи, метки
            </div>
          </div>

          <div>
            <Typography variant="b5">B5 - 12px Regular (12/130)</Typography>
            <div className="mt-1 text-mono-800">
              Примеры использования: мелкий текст, сноски, копирайты
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-h2 mb-4">Применение вместе с другими стилями</h2>
        <div className="space-y-4 border p-4 rounded-md">
          <p className={`${typography.b3Regular} text-red-500`}>Красный текст в стиле B3 Regular</p>

          <p className={`${typography.b4} font-bold text-blue-500`}>
            Синий текст в стиле B4 Medium с дополнительным жирным начертанием
          </p>

          <div className={`${typography.b2} p-4 bg-mono-100 rounded-md`}>
            Текст в блоке с фоном и отступами
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-h2 mb-4">Использование как компоненты</h2>
        <div className="space-y-4 border p-4 rounded-md">
          <Typography variant="h2" as="h3" className="text-purple-600">
            Заголовок H2 как элемент h3 с фиолетовым цветом
          </Typography>

          <Typography variant="b3Regular" as="p" className="italic">
            Параграф в стиле B3 Regular с курсивом
          </Typography>

          <Typography variant="b4Semibold" as="span" className="bg-yellow-100 px-2 py-1 rounded">
            Выделенный текст
          </Typography>
        </div>
      </section>
    </div>
  )
}
