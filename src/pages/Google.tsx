import React from 'react'
import { useParams } from 'react-router-dom'

import { useGmailSession } from '@/hooks/google'
import Gmail from '@/components/Google/Gmail'

export default function Google() {
  const param = useParams()

  const { data: googleSession } = useGmailSession()
  const gmailAccount = googleSession?.find(acc => acc?.email === param.mail)

  return (
    <section >
      {gmailAccount && <Gmail accountData={gmailAccount} />}
    </section>
  )
}
