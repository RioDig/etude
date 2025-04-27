import React from 'react'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-mono-50 p-4">
      <div className="text-center max-w-lg">
        <Typography variant="h1" className="text-red-600 mb-4">
          403
        </Typography>
        <Typography variant="h2" className="mb-6">
          Доступ запрещен
        </Typography>
        <Typography variant="b3Regular" className="mb-8 text-mono-700">
          У вас нет прав доступа к запрашиваемой странице. Пожалуйста, свяжитесь с администратором
          или вернитесь на главную страницу.
        </Typography>
        <Button as="link" to="/" variant="primary">
          Вернуться на главную
        </Button>
      </div>
    </div>
  )
}
