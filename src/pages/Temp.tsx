import React from 'react'
import { useParams } from 'react-router-dom'

import TempMail from '@/components/TempMail'
import { getTempSession } from '@/app/(auth)/temp/_auth/options'

export default function Temp() {
  const param = useParams()
  console.log('TEMPPRAM', param)
  // const mail = decodeURIComponent(params?.email)
  // const session = await getTempSession();
  // const tempAccount = session?.find((acc) => acc?.email === mail);

  // if (!tempAccount) {
  //   return <>gmail Not Found</>;
  // }

  return (
    <section className="overflow-y-hidden">
      {/* {tempAccount && <TempMail accountData={tempAccount} />} */}
    </section>
  )
}
