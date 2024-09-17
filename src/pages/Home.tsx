import Icon from '@/shared/assets/Icon'
import { GoogleLoginURL } from '@/shared/lib/constants'
import { Button, Card, Skeleton, TextArea } from '@radix-ui/themes'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { useGmailSession } from '@/hooks/google'
import { useTempSession } from '@/hooks/temp'
import { regTempEmailAccount } from '@/components/auth/temp/options'

import s from './homex.module.scss'

export default function Home() {
  const { data: googleSession } = useGmailSession()
  const { data: tempSession } = useTempSession()

  // const path = useParams()
  const limit = (googleSession?.length || 0) + (tempSession?.length || 0) === 6
  return (
    <section className={s.section}>
      <div className={s.cardWrap}>
        <div className={s.cardTitle}>
          <h1>Manage your mail</h1>
          <h2>Connect to Gmail or Temp mail</h2>
          {limit && <span>Limit 6 mail</span>}
        </div>
        <div className={s.cardContentWrap}>
          <div className={s.cardContent}>
            <Link
              className={clsx(s.googleButt, limit && s.limit)}
              to={GoogleLoginURL}
            >
              <Icon.GoogleSvg disabled={limit} />
              <div>Google</div>
            </Link>

            <Button
              onClick={() => regTempEmailAccount()}
              className={clsx(s.tempButt, limit && s.limit)}
              disabled={limit}
            >
              <Icon.TempSvg />
            </Button>
          </div>
        </div>
        <div className="footer"></div>
      </div>
    </section>
  )
}
