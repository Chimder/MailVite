import React from 'react'
import { useParams } from 'react-router-dom'

import { useGmailSession } from '@/components/auth/google/query'
import Gmail from '@/components/Gmail'

export default function Google() {
  const param = useParams()

  const { data: googleSession } = useGmailSession()
  const gmailAccount = googleSession?.find(acc => acc?.email === param.mail)

  return (
    <section className="overflow-y-hidden">
      {gmailAccount && <Gmail accountData={gmailAccount} />}
    </section>
  )
}
