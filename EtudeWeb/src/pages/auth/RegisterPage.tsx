// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react'
import { Typography } from '@/shared/ui/typography'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import NamedLogo from '@/shared/assets/images/logo/logo-with-name.svg'
import { Spinner } from '@/shared/ui/spinner'
import { API_URL } from '@/shared/config'

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSoloRedirect = () => {
    setIsLoading(true)

    const redirectUrl = encodeURIComponent(`${window.location.origin}/`)
    window.location.href = `${API_URL}/auth/login?redirectAfterLogin=${redirectUrl}`
  }

  return (
    <div className="flex min-h-screen bg-blue-700">
      <div className="m-auto w-full max-w-md p-12 bg-white rounded-lg shadow-md">
        <img src={NamedLogo} alt="Логотип" className="mb-8 mx-auto" />

        <div className="text-center mb-10">
          <Typography variant="h1" className="mb-2">
            Регистрация
          </Typography>
          <Typography variant="b3Regular" className="text-mono-700">
            Регистрация осуществляется путем авторизации во внутренней системе документооборота
            «Соло»
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onClick={handleSoloRedirect}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="small" variant="white" className="mr-2" />
                <span>Переход в Соло...</span>
              </>
            ) : (
              'Перейти в Соло'
            )}
          </Button>
        </div>

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
