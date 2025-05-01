// src/features/auth/ui/LoginForm.tsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/entities/session'
import { useNavigate, useLocation } from 'react-router-dom'
import { Control } from '@/shared/ui/controls'
import { Button } from '@/shared/ui/button'
import { notification } from '@/shared/lib/notification'
import { Spinner } from '@/shared/ui/spinner'
import { Typography } from '@/shared/ui/typography'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isError, setIsError] = useState(false)

  // Получаем перенаправление из query-параметров
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      notification.error({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все поля'
      })
      return
    }

    try {
      // Используем await для ожидания завершения логина
      await login({ email, password })

      // Показываем уведомление об успешной авторизации
      notification.success({
        title: 'Успешно',
        description: 'Вы успешно вошли в систему'
      })

      // После успешной авторизации редиректим на страницу, с которой пришли
      navigate(from, { replace: true })
    } catch (error) {
      setIsError(true)
      // Ошибки уже обрабатываются в хуке useAuth, но можем добавить дополнительную логику
      console.error('Ошибка при авторизации:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Control.Input
        label="Email"
        placeholder="Введите почту"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setIsError(false)
        }}
        required
        disabled={isLoading}
        variant={isError ? 'error' : 'default'}
      />

      <Control.Input
        label="Пароль"
        placeholder="Введите пароль"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          setIsError(false)
        }}
        required
        disabled={isLoading}
        variant={isError ? 'error' : 'default'}
      />

      {Boolean(isError) && (
        <Typography variant="b3Regular" className="text-red-500 text-center !mt-10">
          Неправильные почта или пароль
        </Typography>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={isLoading} className="!mt-10">
        {isLoading ? (
          <>
            <Spinner size="small" variant="white" className="mr-2" />
            <span className="leading-none">Вход...</span>
          </>
        ) : (
          'Войти'
        )}
      </Button>
    </form>
  )
}
