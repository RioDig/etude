import React from 'react'
import { Typography } from '@/shared/ui/typography'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { Link } from 'react-router-dom'

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-mono-50">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <Typography variant="h1" className="mb-2">
            Вход в систему
          </Typography>
          <Typography variant="b3Regular" className="text-mono-700">
            Введите свои учетные данные для входа
          </Typography>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <Typography variant="b4Regular" className="text-mono-600">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Зарегистрироваться
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}
