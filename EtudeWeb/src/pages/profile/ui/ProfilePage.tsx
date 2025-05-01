import { Typography } from '@/shared/ui/typography'
import Logo from '@/shared/assets/images/logo/logo.svg'
import { Button } from '@/shared/ui/button'
import { Add, Person } from '@mui/icons-material'

export const ProfilePage = () => {
  return (
    <div className="container mx-auto p-8 flex flex-col gap-12 rounded-[16px] bg-white text-center items-center h-full justify-center">
      <img src={Logo} alt={'logo'} height={64} width={64} />
      <div className="flex flex-col gap-6">
        <Typography variant={'h1'} className={'text-center'}>
          Добро пожаловать в Etude!
        </Typography>
        <Typography variant={'h2Regular'} className="mb-4 text-mono-800 max-w-[850px]">
          Здесь вы можете отправить заявление на прохождение обучения, посещения конференций или на
          любое другое мероприятие. А также отслеживать будущие и текущие ваши мероприятия
        </Typography>
      </div>
      <div className="flex gap-6">
        <Button to={'/applications/new'} size="large" leftIcon={<Add />}>
          Новое заявление
        </Button>
        <Button to={'/profile'} size="large" variant="secondary" leftIcon={<Person />}>
          Перейти в профиль
        </Button>
      </div>
    </div>
  )
}

export default ProfilePage
