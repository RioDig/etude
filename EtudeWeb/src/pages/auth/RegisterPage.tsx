import React from 'react'
import { Typography } from '@/shared/ui/typography'
import { RegisterForm } from '@/features/auth/ui/RegisterForm'
import { Link } from 'react-router-dom'

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-mono-50">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <Typography variant="h1" className="mb-2">
            Регистрация
          </Typography>
          <Typography variant="b3Regular" className="text-mono-700">
            Создайте новую учетную запись
          </Typography>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center">
          <Typography variant="b4Regular" className="text-mono-600">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Войти
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}
