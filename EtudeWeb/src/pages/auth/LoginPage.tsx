import React from 'react'
import { Typography } from '@/shared/ui/typography'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { Link } from 'react-router-dom'
import NamedLogo from '@/shared/assets/images/logo/logo-with-name.svg'

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-blue-700">
      <div className="m-auto w-full max-w-md p-12 bg-white rounded-lg shadow-md">
        <img src={NamedLogo} alt={'Логотип'} className="justify-self-center mb-8" />

        <div className="text-center mb-10">
          <Typography variant="h1" className="mb-2">
            Вход в систему
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
