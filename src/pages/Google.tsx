import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { getGmailSession } from '@/components/auth/google/options'
import Gmail from '@/components/Gmail'

export default function Google() {
  const param = useParams()

  const { data: googleSession } = useQuery({
    queryKey: ['google'],
    queryFn: () => getGmailSession(),
  })
  const gmailAccount = googleSession?.find(acc => acc?.email === param.mail)

  if (!gmailAccount) {
    return <>gmail Not Found</>
  }

  return (
    <section className="overflow-y-hidden">
      {gmailAccount && <Gmail accountData={gmailAccount} />}
    </section>
  )
}
