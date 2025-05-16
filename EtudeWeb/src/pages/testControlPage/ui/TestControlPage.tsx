import React, { useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Person, Email, Phone, Lock } from '@mui/icons-material'

export const TestControlPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [emailValue, setEmailValue] = useState<string>('')
  const [passwordValue, setPasswordValue] = useState<string>('')
  const [numberValue, setNumberValue] = useState<number>(0)
  const [textareaValue, setTextareaValue] = useState<string>('')
  const [selectValue, setSelectValue] = useState<string>('')
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([])
  const [dateValue, setDateValue] = useState<Date | null>(null)
  const [phoneValue, setPhoneValue] = useState<string>('')

  const selectOptions = [
    { value: 'option1', label: 'Опция 1', description: 'Описание опции 1' },
    { value: 'option2', label: 'Опция 2', description: 'Описание опции 2' },
    { value: 'option3', label: 'Опция 3', description: 'Описание опции 3' },
    { value: 'option4', label: 'Опция 4', description: 'Описание опции 4' },
    { value: 'option5', label: 'Опция 5', description: 'Описание опции 5' }
  ]

  const cityOptions = [
    { value: 'moscow', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'novosibirsk', label: 'Новосибирск' },
    { value: 'ekaterinburg', label: 'Екатеринбург' },
    { value: 'kazan', label: 'Казань' },
    { value: 'chelyabinsk', label: 'Челябинск' },
    { value: 'omsk', label: 'Омск' },
    { value: 'rostov', label: 'Ростов-на-Дону' }
  ]

  const skillOptions = [
    { value: 'js', label: 'JavaScript', description: 'Описание опции 5', disabled: true },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'node', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' }
  ]

  const emailHint = (
    <div>
      <p>Формат: username@example.com</p>
      <p>Используйте действующий адрес электронной почты</p>
    </div>
  )

  const handleClearAll = () => {
    setInputValue('')
    setEmailValue('')
    setPasswordValue('')
    setNumberValue(0)
    setTextareaValue('')
    setSelectValue('')
    setMultiSelectValue([])
    setDateValue(null)
    setPhoneValue('')
  }

  return (
    <div className="p-8 bg-mono-50 min-h-screen">
      <h1 className="text-h1 mb-8">Демонстрация компонентов формы</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-h2 mb-6">Регистрационная форма</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Имя пользователя */}
          <Control.Input
            label="Имя пользователя"
            placeholder="Введите ваше имя"
            required
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            leftIcon={<Person />}
            hint="Ваше полное имя"
          />

          {/* Email */}
          <Control.Input
            label="Email"
            placeholder="example@mail.com"
            required
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            leftIcon={<Email />}
            hint={emailHint}
            error={
              emailValue && !emailValue.includes('@') ? 'Некорректный формат email' : undefined
            }
          />

          {/* Телефон */}
          <Control.Input
            label="Телефон"
            placeholder="+7 (999) 123-45-67"
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            leftIcon={<Phone />}
            hint="Номер телефона для связи"
          />

          {/* Пароль */}
          <Control.Input
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            required
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            leftIcon={<Lock />}
            hint="Минимум 8 символов, должен содержать цифры и буквы"
            error={
              passwordValue && passwordValue.length < 8
                ? 'Пароль должен содержать не менее 8 символов'
                : undefined
            }
          />

          {/* Возраст */}
          <Control.InputNumber
            label="Возраст"
            placeholder="Введите ваш возраст"
            min={18}
            max={100}
            value={numberValue.toString()}
            onChange={(e) => setNumberValue(Number(e.target.value))}
            hint="Вам должно быть не менее 18 лет"
          />

          {/* Город */}
          <Control.Select
            label="Город"
            placeholder="Выберите город"
            options={cityOptions}
            value={selectValue}
            onChange={setSelectValue}
            required
            hint="Город вашего проживания"
          />

          {/* Дата рождения */}
          <Control.DateInput
            label="Дата рождения"
            placeholder="Выберите дату"
            value={dateValue}
            onChange={setDateValue}
            required
            hint="Дата вашего рождения"
          />

          {/* Навыки */}
          <Control.MultiSelect
            label="Навыки"
            placeholder="Выберите навыки"
            options={skillOptions}
            value={multiSelectValue}
            onChange={setMultiSelectValue}
            hint="Выберите один или несколько навыков"
          />

          {/* О себе */}
          <div className="md:col-span-2">
            <Control.Textarea
              label="О себе"
              placeholder="Расскажите о себе"
              rows={4}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              hint="Краткое описание вашего опыта и увлечений"
            />
          </div>
        </div>

        {/* Кнопки формы */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            className="px-4 py-2 bg-mono-200 rounded hover:bg-mono-300 transition-colors"
            onClick={handleClearAll}
          >
            Сбросить
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Отправить
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-h2 mb-6">Состояния контролов</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Стандартное состояние */}
          <div>
            <h3 className="text-h2-regular mb-4">Стандартное</h3>
            <Control.Input label="Стандартное поле" placeholder="Введите текст" />
          </div>

          {/* Заполненное состояние */}
          <div>
            <h3 className="text-h2-regular mb-4">Заполненное</h3>
            <Control.Input label="Заполненное поле" value="Пример текста" onChange={() => {}} />
          </div>

          {/* Состояние ошибки */}
          <div>
            <h3 className="text-h2-regular mb-4">Ошибка</h3>
            <Control.Input
              label="Поле с ошибкой"
              value="Некорректные данные"
              onChange={() => {}}
              error="Сообщение об ошибке"
            />
          </div>

          {/* Отключенное состояние */}
          <div>
            <h3 className="text-h2-regular mb-4">Отключенное</h3>
            <Control.Input
              label="Отключенное поле"
              value="Недоступно для редактирования"
              onChange={() => {}}
              disabled
            />
          </div>

          {/* Обязательное поле */}
          <div>
            <h3 className="text-h2-regular mb-4">Обязательное поле</h3>
            <Control.Input label="Обязательное поле" placeholder="Введите текст" required />
          </div>

          {/* Обязательное заполненное */}
          <div>
            <h3 className="text-h2-regular mb-4">Обязательное заполненное</h3>
            <Control.Input
              label="Обязательное поле"
              value="Заполненный текст"
              onChange={() => {}}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-h2 mb-6">Типы полей ввода</h2>

          <div className="flex flex-col gap-6">
            <Control.Input label="Текстовое поле" placeholder="Введите текст" />

            <Control.InputNumber label="Числовое поле" placeholder="Введите число" />

            <Control.Input label="Поле пароля" placeholder="Введите пароль" type="password" />

            <Control.Input label="Email" placeholder="example@mail.com" type="email" />

            <Control.Input label="Телефон" placeholder="+7 (999) 123-45-67" type="tel" />

            <Control.Textarea label="Многострочное поле" placeholder="Введите текст" rows={3} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-h2 mb-6">Выпадающие списки и дата</h2>

          <div className="flex flex-col gap-6">
            <Control.Select
              label="Выпадающий список"
              placeholder="Выберите опцию"
              options={selectOptions}
              value={selectValue}
              onChange={setSelectValue}
            />

            <Control.MultiSelect
              label="Мультивыбор"
              placeholder="Выберите опции"
              options={selectOptions}
              value={multiSelectValue}
              onChange={setMultiSelectValue}
            />

            <Control.DateInput
              label="Выбор даты"
              placeholder="Выберите дату"
              value={dateValue}
              onChange={setDateValue}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestControlPage
