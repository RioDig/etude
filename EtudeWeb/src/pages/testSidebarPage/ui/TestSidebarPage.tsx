import React, { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Control } from '@/shared/ui/controls'
import { Tag } from '@/shared/ui/tag'
import { Checkbox } from '@/shared/ui/checkbox'
import { Sidebar, SidebarRow } from '@/widgets/sidebar'
import { notification } from '@/shared/lib/notification'

const TestSidebarPage: React.FC = () => {
  const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(false)
  const [isFormSidebarOpen, setIsFormSidebarOpen] = useState(false)
  const [customSidebarOpen, setCustomSidebarOpen] = useState(false)

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    course: '',
    agree: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, agree: e.target.checked }))
  }

  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      course: '',
      agree: false
    })
  }

  const handleSubmit = () => {
    if (!formState.name || !formState.email || !formState.course) {
      notification.error({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля'
      })
      return
    }

    if (!formState.agree) {
      notification.error({
        title: 'Ошибка',
        description: 'Необходимо согласиться с условиями'
      })
      return
    }

    notification.success({
      title: 'Успешно',
      description: 'Заявка отправлена'
    })

    setIsFormSidebarOpen(false)
    resetForm()
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-h1 mb-8">Демонстрация Sidebar</h1>

      <div className="mb-8 p-4 bg-mono-100 rounded-md">
        <h2 className="text-h2 mb-4">Особенности компонента:</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            Сайдбар <strong>не закрывается</strong> при клике по затемненной области
          </li>
          <li>Badge и кнопки действий располагаются на разных строках</li>
          <li>
            Если кнопки действий не помещаются, появляется кнопка с многоточием, которая{' '}
            <strong>всегда находится в одной строке</strong> с остальными кнопками
          </li>
          <li>
            Тело сайдбара имеет <strong>только вертикальный скролл</strong>, горизонтальный скролл
            отключен
          </li>
          <li>SidebarRow компонент адаптивный и корректно работает при разных размерах окна</li>
          <li>
            Адаптивное поведение - попробуйте изменить размер окна, чтобы увидеть, как меняется
            расположение кнопок
          </li>
        </ul>
      </div>

      <div className="flex gap-4 mb-16">
        <Button onClick={() => setIsInfoSidebarOpen(true)}>Открыть информационный сайдбар</Button>

        <Button onClick={() => setIsFormSidebarOpen(true)}>Открыть сайдбар с формой</Button>

        <Button
          onClick={() => {
            setCustomSidebarOpen(true)
          }}
          variant="third"
        >
          Сайдбар с двумя кнопками
        </Button>
      </div>

      <Sidebar
        open={isInfoSidebarOpen}
        onClose={() => setIsInfoSidebarOpen(false)}
        title="Информация о курсе"
        description="Подробная информация о выбранном курсе"
        badge={{ text: 'Актуально', variant: 'success' }}
        headerActions={[
          {
            label: 'Редактировать',
            onClick: () => {
              notification.info({
                title: 'Редактирование',
                description: 'Вы нажали кнопку редактирования'
              })
            }
          },
          {
            label: 'Поделиться',
            onClick: () => {
              notification.info({
                title: 'Поделиться',
                description: 'Вы нажали кнопку Поделиться'
              })
            }
          },
          {
            label: 'Скачать',
            onClick: () => {
              notification.info({
                title: 'Скачать',
                description: 'Вы нажали кнопку Скачать'
              })
            }
          },
          {
            label: 'Архивировать',
            onClick: () => {
              notification.info({
                title: 'Архивировать',
                description: 'Вы нажали кнопку Архивировать'
              })
            }
          },
          {
            label: 'Дублировать',
            onClick: () => {
              notification.info({
                title: 'Дублировать',
                description: 'Вы нажали кнопку Дублировать'
              })
            }
          }
        ]}
        footerActions={[
          {
            label: 'Закрыть',
            onClick: () => setIsInfoSidebarOpen(false),
            variant: 'third'
          },
          {
            label: 'Записаться на курс',
            onClick: () => {
              notification.success({
                title: 'Успешно',
                description: 'Вы успешно записались на курс'
              })
              setIsInfoSidebarOpen(false)
            }
          }
        ]}
      >
        <SidebarRow label="Название курса">Разработка веб-приложений на React</SidebarRow>

        <SidebarRow label="Направление">
          <Tag>Frontend</Tag>
        </SidebarRow>

        <SidebarRow label="Формат">Онлайн</SidebarRow>

        <SidebarRow label="Длительность">3 месяца</SidebarRow>

        <SidebarRow label="Сложность">
          <Tag>Средняя</Tag>
        </SidebarRow>

        <SidebarRow label="Преподаватель">Иванов Иван Иванович</SidebarRow>

        <SidebarRow label="Сайт курса">
          <Button as="link" to="https://example.com" variant="third">
            example.com
          </Button>
        </SidebarRow>

        <div className="mt-8">
          <h3 className="text-b2 font-medium mb-4">Описание курса</h3>
          <p className="text-b3-regular text-mono-800 mb-4">
            Этот курс предназначен для разработчиков, желающих освоить современные технологии
            фронтенд-разработки. Вы научитесь создавать интерактивные пользовательские интерфейсы с
            помощью React.
          </p>
          <p className="text-b3-regular text-mono-800 mb-4">
            В рамках курса вы изучите основные концепции React, работу с состоянием, хуки,
            маршрутизацию, управление состоянием с помощью Redux и многое другое.
          </p>
          <p className="text-b3-regular text-mono-800 mb-4">
            По окончании курса вы сможете самостоятельно разрабатывать современные веб-приложения,
            использующие лучшие практики и подходы.
          </p>

          <h3 className="text-b2 font-medium mb-4 mt-6">Программа курса</h3>
          <ol className="list-decimal ml-6 space-y-2 text-b3-regular text-mono-800">
            <li>Введение в React и основные концепции</li>
            <li>Компоненты, пропсы и состояние</li>
            <li>Хуки и функциональные компоненты</li>
            <li>Работа с формами и ввод данных</li>
            <li>Маршрутизация в React-приложениях</li>
            <li>Управление состоянием с Redux</li>
            <li>Асинхронные запросы и работа с API</li>
            <li>Тестирование React-компонентов</li>
            <li>Оптимизация производительности</li>
            <li>Развертывание React-приложений</li>
          </ol>

          <h3 className="text-b2 font-medium mb-4 mt-6">Требования к слушателям</h3>
          <ul className="list-disc ml-6 space-y-2 text-b3-regular text-mono-800">
            <li>Базовые знания HTML, CSS и JavaScript</li>
            <li>Понимание принципов функционального программирования</li>
            <li>Опыт работы с системой контроля версий Git</li>
            <li>Наличие компьютера с установленной средой разработки</li>
          </ul>

          <h3 className="text-b2 font-medium mb-4 mt-6">Результаты обучения</h3>
          <p className="text-b3-regular text-mono-800 mb-4">После прохождения курса вы сможете:</p>
          <ul className="list-disc ml-6 space-y-2 text-b3-regular text-mono-800">
            <li>Создавать полноценные React-приложения с нуля</li>
            <li>Эффективно управлять состоянием приложения</li>
            <li>Применять современные практики разработки</li>
            <li>Оптимизировать производительность React-компонентов</li>
            <li>Тестировать и отлаживать приложения</li>
            <li>Развертывать приложения в продакшн-среде</li>
          </ul>
        </div>
      </Sidebar>

      <Sidebar
        open={customSidebarOpen}
        onClose={() => setCustomSidebarOpen(false)}
        title="Сайдбар с двумя кнопками"
        description="Демонстрация сайдбара с малым количеством кнопок"
        headerActions={[
          {
            label: 'Первая кнопка',
            onClick: () => {
              notification.info({
                title: 'Действие',
                description: 'Вы нажали первую кнопку'
              })
            }
          },
          {
            label: 'Вторая кнопка',
            onClick: () => {
              notification.info({
                title: 'Действие',
                description: 'Вы нажали вторую кнопку'
              })
            }
          }
        ]}
        footerActions={[
          {
            label: 'Закрыть',
            onClick: () => setCustomSidebarOpen(false),
            variant: 'third'
          }
        ]}
      >
        <div className="text-b3-regular text-mono-800 mb-4">
          Этот сайдбар демонстрирует корректное отображение двух кнопок действий, которые должны
          отображаться рядом друг с другом без кнопки с многоточием, если они помещаются в доступное
          пространство.
        </div>

        <div className="text-b3-regular text-mono-800">
          Попробуйте уменьшить размер окна браузера, чтобы увидеть, как кнопки автоматически
          адаптируются. Кнопка с многоточием должна появиться только в том случае, если обе кнопки
          не помещаются одновременно.
        </div>
      </Sidebar>

      <Sidebar
        open={isFormSidebarOpen}
        onClose={() => {
          setIsFormSidebarOpen(false)
          resetForm()
        }}
        title="Запись на курс"
        description="Заполните форму для записи на курс"
        footerActions={[
          {
            label: 'Отменить',
            onClick: () => {
              setIsFormSidebarOpen(false)
              resetForm()
            },
            variant: 'third'
          },
          {
            label: 'Отправить заявку',
            onClick: handleSubmit
          }
        ]}
      >
        <form className="flex flex-col gap-6">
          <Control.Input
            label="ФИО"
            placeholder="Введите ваше полное имя"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            required
          />

          <Control.Input
            label="Email"
            placeholder="Введите ваш email"
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            required
          />

          <Control.Select
            label="Выберите курс"
            placeholder="Выберите курс из списка"
            // name="course"
            value={formState.course}
            onChange={(value) => setFormState((prev) => ({ ...prev, course: value }))}
            options={[
              { value: 'react', label: 'Разработка на React' },
              { value: 'node', label: 'Node.js для бэкенда' },
              { value: 'python', label: 'Python для Data Science' },
              { value: 'java', label: 'Java для Enterprise' }
            ]}
            required
          />

          <div className="mt-4">
            <Checkbox
              label="Я согласен с условиями обработки персональных данных"
              checked={formState.agree}
              onChange={handleCheckboxChange}
            />
          </div>
        </form>
      </Sidebar>
    </div>
  )
}

export default TestSidebarPage
