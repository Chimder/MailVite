import clsx from 'clsx'
import { CirclePlus } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useGmailSession } from '../../hooks/google'
import { useTempSession } from '../../hooks/temp'
import s from './main.module.css'

export const MainLayout = () => {
  const { data: googleSession } = useGmailSession()
  const { data: tempSession } = useTempSession()

  const path = useParams()
  const limit = (googleSession?.length || 0) + (tempSession?.length || 0) === 6

  return (
    <nav className={clsx(s.Container, s.navColor)}>
      <div className={s.main}>
        {googleSession?.map((email, i) => (
          <Link
            className={clsx(s.navIcon, path.mail == email.email && s.active)}
            to={`/google/${email.email}`}
            key={email.providerAccountId}
          >
            <img src={email.picture} alt="" />
          </Link>
        ))}
        {tempSession?.map((email, i) => (
          <Link
            className={clsx(s.navIcon, path.mail == email.email && s.active)}
            to={`/temp/${email.email}`}
            key={email.email}
          >
            <img src="/Logo/MailTm_Logo.webp" alt="" />
          </Link>
        ))}

        {!limit && (
          <Link className={s.themeButt} to="/">
            <CirclePlus ></CirclePlus>
          </Link>
        )}
        {/* <ThemeToggle /> */}
      </div>
    </nav>
  )
}
