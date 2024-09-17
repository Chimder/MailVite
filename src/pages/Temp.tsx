import { useParams } from 'react-router-dom'

import { useTempSession } from '@/hooks/temp'
import TempMail from '@/components/Temp/TempMail'

export default function Temp() {
  const param = useParams()
  const { data: googleSession } = useTempSession()
  const tempAccount = googleSession?.find(acc => acc?.email === param.mail)

  return (
    <section className="overflow-y-hidden">
      {tempAccount && <TempMail accountData={tempAccount} />}
    </section>
  )
}
