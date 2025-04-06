import { useState } from 'react'
import { Modal } from '@/shared/ui/modal'
import { MiniModal } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { Typography } from '@/shared/ui/typography'
import { Info } from '@mui/icons-material'

const TestModalPage = () => {
  // Состояния для обычных модальных окон
  const [isBasicModalOpen, setBasicModalOpen] = useState(false)
  const [isModalWithActionsOpen, setModalWithActionsOpen] = useState(false)
  const [isModalWithLinkOpen, setModalWithLinkOpen] = useState(false)
  const [isModalWithAllOpen, setModalWithAllOpen] = useState(false)

  // Состояния для минимодальных окон
  const [isMiniModalBasicOpen, setMiniModalBasicOpen] = useState(false)
  const [isMiniModalOneButtonOpen, setMiniModalOneButtonOpen] = useState(false)
  const [isMiniModalTwoButtonsOpen, setMiniModalTwoButtonsOpen] = useState(false)
  const [isMiniModalCustomIconOpen, setMiniModalCustomIconOpen] = useState(false)

  return (
    <>
      <div className="p-8">
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>
        <Typography variant="h1" className="mb-10">
          Примеры модальных окон
        </Typography>

        {/* Секция с обычными модальными окнами */}
        <div className="mb-16">
          <Typography variant="h2" className="mb-6">
            Modal
          </Typography>

          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setBasicModalOpen(true)}>Базовое модальное окно</Button>

            <Button onClick={() => setModalWithActionsOpen(true)}>С кнопками действий</Button>

            <Button onClick={() => setModalWithLinkOpen(true)}>С кнопкой-ссылкой</Button>

            <Button onClick={() => setModalWithAllOpen(true)}>Со всеми элементами</Button>
          </div>

          {/* Базовое модальное окно */}
          <Modal
            isOpen={isBasicModalOpen}
            onClose={() => setBasicModalOpen(false)}
            title="Базовое модальное окно"
          >
            <div className="max-w-[600px]">
              <p className="text-b3-regular mb-4">
                Это пример базового модального окна без дополнительных действий в подвале.
              </p>
              <p className="text-b3-regular">
                Модальное окно имеет заголовок, кнопку закрытия и содержимое. При открытии
                модального окна остальной контент затемняется с помощью полупрозрачного фона.
              </p>
            </div>
          </Modal>

          {/* Модальное окно с кнопками действий */}
          <Modal
            isOpen={isModalWithActionsOpen}
            onClose={() => setModalWithActionsOpen(false)}
            title="Модальное окно с кнопками действий"
            actions={
              <>
                <Button variant="secondary" onClick={() => setModalWithActionsOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={() => setModalWithActionsOpen(false)}>Подтвердить</Button>
              </>
            }
          >
            <div className="max-w-[600px]">
              <p className="text-b3-regular">
                Это пример модального окна с кнопками действий в нижней части. Кнопки действий
                размещаются в правой части подвала модального окна.
              </p>
            </div>
          </Modal>

          {/* Модальное окно с кнопкой-ссылкой */}
          <Modal
            isOpen={isModalWithLinkOpen}
            onClose={() => setModalWithLinkOpen(false)}
            title="Модальное окно с кнопкой-ссылкой"
            linkAction={{
              label: 'Перейти на страницу',
              to: '#',
              onClick: () => {
                alert('Клик по ссылке')
                setModalWithLinkOpen(false)
              }
            }}
          >
            <div className="max-w-[600px]">
              <p className="text-b3-regular">
                Это пример модального окна с кнопкой-ссылкой в нижней части. Кнопка-ссылка
                размещается в левой части подвала модального окна.
              </p>
            </div>
          </Modal>

          {/* Модальное окно со всеми элементами */}
          <Modal
            isOpen={isModalWithAllOpen}
            onClose={() => setModalWithAllOpen(false)}
            title="Модальное окно со всеми элементами"
            linkAction={{
              label: 'Подробнее',
              to: '#',
              onClick: () => alert('Клик по ссылке')
            }}
            actions={
              <>
                <Button variant="secondary" onClick={() => setModalWithAllOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={() => setModalWithAllOpen(false)}>Подтвердить</Button>
              </>
            }
          >
            <div className="text-left">
              <p className="text-b3-regular mb-4">
                Это пример модального окна со всеми элементами: заголовком, кнопкой закрытия,
                содержимым, кнопкой-ссылкой и кнопками действий.
              </p>
              <p className="text-b3-regular">
                Такое модальное окно может использоваться для сложных форм или важных действий,
                требующих подтверждения пользователя.
              </p>
            </div>
          </Modal>
        </div>

        {/* Секция с минимодальными окнами */}
        <div>
          <Typography variant="h2" className="mb-6">
            MiniModal
          </Typography>

          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setMiniModalBasicOpen(true)}>Базовое минимодальное окно</Button>

            <Button onClick={() => setMiniModalOneButtonOpen(true)}>С одной кнопкой</Button>

            <Button onClick={() => setMiniModalTwoButtonsOpen(true)}>С двумя кнопками</Button>

            <Button onClick={() => setMiniModalCustomIconOpen(true)}>С другой иконкой</Button>
          </div>

          {/* Базовое минимодальное окно */}
          <MiniModal
            isOpen={isMiniModalBasicOpen}
            onClose={() => setMiniModalBasicOpen(false)}
            title="Базовое минимодальное окно"
            description="Минимодальное окно с описанием, но без кнопок действий."
            buttons={[<Button onClick={() => setMiniModalBasicOpen(false)}>Закрыть</Button>]}
          />

          {/* Минимодальное окно с одной кнопкой */}
          <MiniModal
            isOpen={isMiniModalOneButtonOpen}
            onClose={() => setMiniModalOneButtonOpen(false)}
            title="Подтверждение удаления"
            description="Вы действительно хотите удалить этот элемент? Это действие нельзя отменить."
            buttons={[<Button onClick={() => setMiniModalOneButtonOpen(false)}>Удалить</Button>]}
          />

          {/* Минимодальное окно с двумя кнопками */}
          <MiniModal
            isOpen={isMiniModalTwoButtonsOpen}
            onClose={() => setMiniModalTwoButtonsOpen(false)}
            title="Подтверждение действия"
            description="Вы действительно хотите выполнить это действие? После подтверждения действие нельзя будет отменить."
            buttons={[
              <Button fullWidth onClick={() => setMiniModalTwoButtonsOpen(false)}>
                Подтвердить
              </Button>,
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setMiniModalTwoButtonsOpen(false)}
              >
                Отмена
              </Button>
            ]}
          />

          {/* Минимодальное окно с другой иконкой */}
          <MiniModal
            isOpen={isMiniModalCustomIconOpen}
            onClose={() => setMiniModalCustomIconOpen(false)}
            title="Информационное сообщение"
            description="Это информационное сообщение для пользователя с другой иконкой."
            icon={<Info />}
            buttons={[<Button onClick={() => setMiniModalCustomIconOpen(false)}>Понятно</Button>]}
          />
        </div>
      </div>
    </>
  )
}

export default TestModalPage
