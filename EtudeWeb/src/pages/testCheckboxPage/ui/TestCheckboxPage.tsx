import { Checkbox } from '@/shared/ui/checkbox'
import { Typography } from '@/shared/ui/typography'
import { useState } from 'react'

const TestCheckboxPage = () => {
  const [checkedDefault, setCheckedDefault] = useState(false)
  const [checkedSelected, setCheckedSelected] = useState(true)

  return (
    <div className="p-8 space-y-8 bg-white">
      <Typography variant="h1">Состояния Checkbox</Typography>

      <div className="space-y-4">
        <Typography variant="h2">Базовые состояния</Typography>
        <div className="flex items-center space-x-4">
          <Checkbox label="Default" />
          <Checkbox label="Default с Hint" hint="Это подсказка" />
        </div>

        <div className="flex items-center space-x-4">
          <Checkbox label="Hover" />
          <Checkbox label="Hover с Hint" hint="Это подсказка" />
        </div>

        <div className="flex items-center space-x-4">
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled с Hint" disabled hint="Это подсказка" />
        </div>

        <div className="flex items-center space-x-4">
          <Checkbox label="Disabled Selected" disabled checked />
          <Checkbox label="Disabled Selected с Hint" disabled checked hint="Это подсказка" />
        </div>

        <div className="flex items-center space-x-4">
          <Checkbox label="Selected" checked />
          <Checkbox label="Selected с Hint" checked hint="Это подсказка" />
        </div>

        <div className="flex items-center space-x-4">
          <Checkbox label="Selected Hover" checked />
          <Checkbox label="Selected Hover с Hint" checked hint="Это подсказка" />
        </div>
      </div>

      <div className="space-y-4">
        <Typography variant="h2">Интерактивные примеры</Typography>
        <div className="flex items-center space-x-4">
          <Checkbox
            label="Можно нажать"
            checked={checkedDefault}
            onChange={() => setCheckedDefault(!checkedDefault)}
          />
          <Checkbox
            label="С подсказкой"
            hint="Дополнительная информация"
            checked={checkedSelected}
            onChange={() => setCheckedSelected(!checkedSelected)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Typography variant="h2">Форма с чекбоксами</Typography>
        <div className="border p-4 rounded-md space-y-3">
          <div className="border-b pb-2 mb-4">
            <Typography variant="b3Semibold">Настройки приватности</Typography>
          </div>

          <Checkbox
            label="Разрешить отслеживание активности"
            hint="Мы используем эти данные для улучшения сервиса"
            checked={checkedDefault}
            onChange={() => setCheckedDefault(!checkedDefault)}
          />

          <Checkbox
            label="Участвовать в программе улучшения продукта"
            checked={checkedSelected}
            onChange={() => setCheckedSelected(!checkedSelected)}
          />

          <Checkbox
            label="Отправлять анонимные отчеты об ошибках"
            disabled
            checked
            hint="Эта опция обязательна для использования сервиса"
          />

          <div className="pt-4 mt-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestCheckboxPage
