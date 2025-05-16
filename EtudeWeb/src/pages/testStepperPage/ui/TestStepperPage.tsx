import { Stepper } from '@/shared/ui/stepper'
import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Control } from '@/shared/ui/controls'

const TestStepperPage = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { label: 'Основная информация' },
    { label: 'Содержание курса' },
    { label: 'Настройки доступа' },
    { label: 'Просмотр и публикация' }
  ]

  const [formData, setFormData] = useState({
    basicInfo: {
      title: '',
      description: '',
      category: '',
      image: null
    },

    content: {
      modules: [{ title: '', description: '', lessons: [] }]
    },

    accessSettings: {
      isPublic: true,
      price: '',
      startDate: null,
      endDate: null
    }
  })

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
  }

  const handlePrev = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  const handleInputChange = (step: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const validateStepCompletion = () => {
    switch (activeStep) {
      case 0:
        return !!formData.basicInfo.title && !!formData.basicInfo.category
      case 1:
        return (
          formData.content.modules.length > 0 && formData.content.modules.every((m) => !!m.title)
        )
      case 2:
        return !formData.accessSettings.isPublic ? !!formData.accessSettings.price : true
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-h2 text-mono-950">Основная информация о курсе</h2>
            <p className="text-b3-regular text-mono-700">
              Укажите основную информацию о курсе, которая будет видна студентам.
            </p>

            <Control.Input
              label="Название курса"
              placeholder="Введите название курса"
              required
              value={formData.basicInfo.title}
              onChange={(e) => handleInputChange('basicInfo', 'title', e.target.value)}
            />

            <Control.Textarea
              label="Описание курса"
              placeholder="Опишите, что студенты узнают в вашем курсе"
              value={formData.basicInfo.description}
              onChange={(e) => handleInputChange('basicInfo', 'description', e.target.value)}
              rows={4}
            />

            <Control.Select
              label="Категория курса"
              placeholder="Выберите категорию"
              required
              options={[
                { value: 'programming', label: 'Программирование' },
                { value: 'design', label: 'Дизайн' },
                { value: 'marketing', label: 'Маркетинг' },
                { value: 'business', label: 'Бизнес' }
              ]}
              value={formData.basicInfo.category}
              onChange={(value) => handleInputChange('basicInfo', 'category', value)}
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-h2 text-mono-950">Содержание курса</h2>
            <p className="text-b3-regular text-mono-700">
              Создайте модули и уроки для вашего курса.
            </p>

            {formData.content.modules.map((module, index) => (
              <div key={index} className="p-4 border border-mono-300 rounded-lg space-y-4">
                <Control.Input
                  label={`Название модуля ${index + 1}`}
                  placeholder="Введите название модуля"
                  required
                  value={module.title}
                  onChange={(e) => {
                    const updatedModules = [...formData.content.modules]
                    updatedModules[index].title = e.target.value
                    handleInputChange('content', 'modules', updatedModules)
                  }}
                />

                <Control.Textarea
                  label="Описание модуля"
                  placeholder="Опишите, что включено в модуль"
                  value={module.description}
                  onChange={(e) => {
                    const updatedModules = [...formData.content.modules]
                    updatedModules[index].description = e.target.value
                    handleInputChange('content', 'modules', updatedModules)
                  }}
                  rows={2}
                />
              </div>
            ))}

            <Button
              variant="secondary"
              onClick={() => {
                const updatedModules = [
                  ...formData.content.modules,
                  { title: '', description: '', lessons: [] }
                ]
                handleInputChange('content', 'modules', updatedModules)
              }}
            >
              Добавить модуль
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-h2 text-mono-950">Настройки доступа</h2>
            <p className="text-b3-regular text-mono-700">
              Настройте, кто и когда может получить доступ к вашему курсу.
            </p>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-b3-regular">Доступ к курсу:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.accessSettings.isPublic}
                    onChange={() => handleInputChange('accessSettings', 'isPublic', true)}
                  />
                  <span>Бесплатный</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!formData.accessSettings.isPublic}
                    onChange={() => handleInputChange('accessSettings', 'isPublic', false)}
                  />
                  <span>Платный</span>
                </label>
              </div>
            </div>

            {!formData.accessSettings.isPublic && (
              <Control.Input
                label="Стоимость курса (₽)"
                placeholder="Введите стоимость"
                type="number"
                required
                value={formData.accessSettings.price}
                onChange={(e) => handleInputChange('accessSettings', 'price', e.target.value)}
              />
            )}

            <div className="flex gap-4">
              <Control.DateInput
                label="Дата начала курса"
                placeholder="Выберите дату"
                value={formData.accessSettings.startDate}
                onChange={(date) => handleInputChange('accessSettings', 'startDate', date)}
              />

              <Control.DateInput
                label="Дата окончания курса"
                placeholder="Выберите дату"
                value={formData.accessSettings.endDate}
                onChange={(date) => handleInputChange('accessSettings', 'endDate', date)}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-h2 text-mono-950">Просмотр и публикация</h2>
            <p className="text-b3-regular text-mono-700">
              Проверьте информацию о курсе перед публикацией.
            </p>

            <div className="p-6 border border-mono-300 rounded-lg space-y-4">
              <h3 className="text-b2 font-semibold">
                {formData.basicInfo.title || 'Название курса не указано'}
              </h3>
              <p className="text-b4-regular text-mono-700">
                {formData.basicInfo.description || 'Описание курса не указано'}
              </p>

              <div className="flex gap-4 text-b4-regular">
                <span>
                  Категория:{' '}
                  {formData.basicInfo.category
                    ? {
                        programming: 'Программирование',
                        design: 'Дизайн',
                        marketing: 'Маркетинг',
                        business: 'Бизнес'
                      }[formData.basicInfo.category]
                    : 'Не указана'}
                </span>

                <span>
                  Доступ:{' '}
                  {formData.accessSettings.isPublic
                    ? 'Бесплатный'
                    : `Платный (${formData.accessSettings.price || 0} ₽)`}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-b3-semibold">Модули курса:</h4>
                <ul className="list-disc pl-5 mt-2">
                  {formData.content.modules.map((module, index) => (
                    <li key={index}>{module.title || `Модуль ${index + 1} (без названия)`}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Button variant="primary" onClick={() => alert('Курс успешно опубликован!')}>
              Опубликовать курс
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <Stepper steps={steps} activeStep={activeStep} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderStepContent()}

        <div className="flex justify-between mt-8">
          <Button variant="secondary" onClick={handlePrev} disabled={activeStep === 0}>
            Назад
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button variant="primary" onClick={handleNext} disabled={!validateStepCompletion()}>
              Продолжить
            </Button>
          ) : (
            <Button variant="primary" onClick={() => alert('Курс успешно опубликован!')}>
              Опубликовать
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestStepperPage
