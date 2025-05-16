import { Button } from '@/shared/ui/button'
import { notification } from '@/shared/lib/notification'

const TestNotificationPage = () => {
  const showSuccessNotification = () => {
    notification.success({
      title: 'Операция выполнена успешно',
      description: 'Все данные были сохранены'
    })
  }

  const showErrorNotification = () => {
    notification.error({
      title: 'Ошибка',
      description: 'Не удалось загрузить данные. Пожалуйста, попробуйте еще раз.'
    })
  }

  const showInfoNotification = () => {
    notification.info({
      title: 'Внимание',
      description: 'Ваша сессия истечет через 5 минут. Сохраните все данные.'
    })
  }

  const showBaseNotification = () => {
    notification.base({
      title: 'Уведомление системы',
      description: 'Система будет обновлена в 22:00'
    })
  }

  const showActionNotification = () => {
    notification.success({
      title: 'Операция выполнена успешно',
      description: 'Все данные были сохранены',
      action: (
        <Button
          variant="third"
          size="small"
          className="text-b4-regular px-5"
          onClick={() => console.log('Подробнее')}
        >
          Подробнее
        </Button>
      )
    })
  }

  const showOverflowAnimation = () => {
    notification.dismissAll()

    setTimeout(() => {
      notification.success({
        title: 'Короткое уведомление',
        id: 'short'
      })
    }, 100)

    setTimeout(() => {
      notification.info({
        title: 'Среднее по размеру уведомление',
        description: 'С небольшим описанием',
        id: 'medium'
      })
    }, 400)

    setTimeout(() => {
      notification.error({
        title: 'Последнее уведомление - будет вытеснено',
        description: 'Это уведомление должно исчезнуть с анимацией при переполнении',
        id: 'long'
      })
    }, 700)

    setTimeout(() => {
      notification.base({
        title: 'Новое уведомление',
        description: 'Это уведомление должно вытеснить последнее с анимацией',
        id: 'new'
      })
    }, 2000)
  }

  const closeAllNotifications = () => {
    notification.dismissAll()
  }

  return (
    <div className="p-6 space-y-8 bg-mono-100 min-h-screen">
      <h1 className="text-h1 text-mono-950">Демонстрация компонента Notification</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-h2 mb-4">Типы уведомлений</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={showSuccessNotification} variant="primary">
              Успех (зеленое)
            </Button>

            <Button onClick={showErrorNotification} variant="primary">
              Ошибка (красное)
            </Button>

            <Button onClick={showInfoNotification} variant="primary">
              Информация (синее)
            </Button>

            <Button onClick={showBaseNotification} variant="primary">
              Базовое (черное)
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-h2 mb-4">Уведомление с действием</h2>
          <Button onClick={showActionNotification} variant="primary">
            Показать с кнопкой
          </Button>
        </div>

        <div>
          <h2 className="text-h2 mb-4">Демонстрация анимации переполнения</h2>
          <Button onClick={showOverflowAnimation} variant="primary">
            Показать анимацию переполнения
          </Button>
          <p className="text-b4-regular mt-2 text-mono-700">
            Наглядно демонстрирует, как последнее уведомление исчезает с анимацией при добавлении
            четвертого уведомления.
          </p>
        </div>

        <div>
          <h2 className="text-h2 mb-4">Закрыть все уведомления</h2>
          <Button onClick={closeAllNotifications} variant="secondary">
            Закрыть все
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TestNotificationPage
