import { CirclePlus } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useGmailSession } from '../../hooks/google'
import { useTempSession } from '../../hooks/temp'
import { ThemeToggle } from '../ui/themeToggle'

export const MainLayout = () => {
  const { data: googleSession } = useGmailSession()
  const { data: tempSession } = useTempSession()

  const path = useParams()
  const limit = (googleSession?.length || 0) + (tempSession?.length || 0) === 6

  return (
    <nav className="nav_bar_container nav_color dark:nav_color_dark ">
      <div className="z-100 flex w-full justify-evenly">
        {googleSession?.map((email, i) => (
          <Link
            className={`${path.mail == email.email ? 'nav_icon_active' : 'nav_icon'}`}
            to={`/google/${email.email}`}
            key={email.providerAccountId}
          >
            <img
              className="h-10 w-10 rounded-full"
              src={email.picture}
              alt=""
            />
          </Link>
        ))}
        {tempSession?.map((email, i) => (
          <Link
            className={`${path.mail == email.email ? 'nav_icon_active' : 'nav_icon'}`}
            to={`/temp/${email.email}`}
            key={email.email}
          >
            <img
              className="h-10 w-10 rounded-full"
              src="/Logo/MailTm_Logo.webp"
              alt=""
            />
          </Link>
        ))}

        {!limit && (
          <Link to="/">
            <CirclePlus className="h-10 w-10"></CirclePlus>
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  )
}
