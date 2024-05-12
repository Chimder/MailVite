import React from 'react'
import { useParams } from 'react-router-dom'

import { useTempSession } from '@/components/auth/temp/query'
import TempMail from '@/components/TempMail'

export default function Temp() {
  const param = useParams()
  const { data: googleSession } = useTempSession()
  const tempAccount = googleSession?.find(acc => acc?.email === param.mail)
  console.log('tempppAcc', tempAccount)

  return (
    <section className="overflow-y-hidden">
      {tempAccount && <TempMail accountData={tempAccount} />}
    </section>
  )
}
