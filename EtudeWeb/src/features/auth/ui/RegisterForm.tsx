import React, { useState } from 'react'
import { useAuth } from '@/entities/session'
import { useNavigate } from 'react-router-dom'
import { Control } from '@/shared/ui/controls'
import { Button } from '@/shared/ui/button'
import { notification } from '@/shared/lib/notification'

export const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const { register, isLoading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName || !email || !password) {
      notification.error({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля'
      })
      return
    }

    if (password !== passwordConfirm) {
      notification.error({
        title: 'Ошибка',
        description: 'Пароли не совпадают'
      })
      return
    }

    try {
      await register({
        firstName,
        lastName,
        email,
        password
      })

      notification.success({
        title: 'Успешная регистрация',
        description: 'Вы успешно зарегистрированы и авторизованы'
      })

      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Control.Input
        label="Имя"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        disabled={isLoading}
      />

      <Control.Input
        label="Фамилия"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        disabled={isLoading}
      />

      <Control.Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <Control.Input
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <Control.Input
        label="Подтверждение пароля"
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        required
        disabled={isLoading}
        error={error ?? undefined}
      />

      <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  )
}
