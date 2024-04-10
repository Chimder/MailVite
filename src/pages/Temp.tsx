import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { getTempSession } from '@/components/auth/temp/options'
import { useTempSession } from '@/components/auth/temp/query'
import TempMail from '@/components/TempMail'

export default function Temp() {
  const param = useParams()
  const { data: googleSession } = useTempSession()
  // const { data: googleSession } = useQuery({
  //   queryKey: ['temp'],
  //   queryFn: () => getTempSession(),
  // })
  const tempAccount = googleSession?.find(acc => acc?.email === param.mail)

  return (
    <section className="overflow-y-hidden">
      {tempAccount && <TempMail accountData={tempAccount} />}
    </section>
  )
}
