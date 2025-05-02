import { Typography } from '@/shared/ui/typography'
import Logo from '@/shared/assets/images/logo/logo.svg'
import { Button } from '@/shared/ui/button'
import { Add, Person } from '@mui/icons-material'
import { Container } from '@/shared/ui/container'
import { User } from '@/entities/user'

export const ProfilePage = () => {

  const generateProfileSquare = (user: User) => {
    return (
      <div>
        {user.name[0]}{user.surname[0]}
      </div>
    )
  }

  return (
    // <div className="container mx-auto p-8 flex flex-col gap-12 rounded-[16px] bg-white text-center items-center h-full justify-center">
    //
    // </div>
    <Container className="max-h-[112px]">
      <div className=''>

      </div>
    </Container>
  )
}

export default ProfilePage
