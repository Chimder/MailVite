'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
// import Link from 'next/link'
// import { useParams } from 'next/navigation'
import { CirclePlus } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { getGmailSession } from './auth/google/options'
import { GoogleAccount } from './auth/google/types'
import { getTempSession } from './auth/temp/options'
import { TempAccount } from './auth/temp/types'
import { ThemeToggle } from './ui/themeToggle'

type Props = {
  googleSession: GoogleAccount[] | null
  tempSession: TempAccount[] | null
}
export const MainLayout = () => {
  const { data: googleSession } = useQuery({
    queryKey: ['google'],
    queryFn: () => getGmailSession(),
  })
  // const { data: tempSession } = useQuery({
  //   queryKey: ['temp'],
  //   queryFn: () => getTempSession(),
  // })

  const path = useParams()
  // let params = useParams()
  // console.log('Param', params)

  // const mail = decodeURIComponent(path?.email as string)
  // const limit = (googleSession?.length || 0) + (tempSession?.length || 0) === 6

  return (
    <nav className="nav_bar_container nav_color dark:nav_color_dark ">
      <div className="z-100 flex w-full justify-evenly">
        {googleSession?.map((email, i) => (
          <Link
            className={`${path.mail == email.email ? 'nav_icon_active' : 'nav_icon'}`}
            to={`/google/${email.email}`}
            key={email.providerAccountId}
          >
            <img className="h-10 w-10 rounded-full" src={email.picture} alt="" />
          </Link>
        ))}
        {/*    {tempSession?.map((email, i) => (
          <Link
            className={`${mail == email.email ? 'nav_icon_active' : 'nav_icon'}`}
            href={`/temp/${email.email}`}
            key={email.email}
          >
            <img className="h-10 w-10 rounded-full" src="/Logo/MailTm_Logo.webp" alt="" />
          </Link>
        ))}

        {!limit && (
          <Link href="/">
            <CirclePlus className="h-10 w-10"></CirclePlus>
          </Link>
        )}
        <ThemeToggle /> */}
      </div>
    </nav>
  )
}
