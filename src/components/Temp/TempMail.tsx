import { useEffect, useState } from 'react'
import { formatTempDate } from '@/shared/lib/data-format'
import { Button } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { LogOut, RotateCw, Tally1 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import { resetTempSession } from '@/hooks/temp'

import {
  deleteTempMail,
  getMessageBody,
  getTempMessages,
} from '../auth/temp/options'
import { HydraMember, TempAccount } from '../auth/temp/types'
import CopyMail from '../copy'
import Spinner from '../ui/spiner'
import s from './tempx.module.scss'

type Props = {
  accountData: TempAccount
}

export default function TempMail({ accountData }: Props) {
  const navigate = useNavigate()
  const params = useParams()
  const [messageId, setMessBody] = useState<string | undefined>()

  const { data: messBody, isPending: pendingMessBody } = useQuery({
    queryKey: ['tempQuery', messageId],
    queryFn: () => getMessageBody(accountData.accessToken, messageId),
    refetchOnWindowFocus: false,
    enabled: !!messageId,
    retry: 0,
  })

  const {
    data: mess,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['tempInfinty', accountData.email],
    queryFn: () => getTempMessages(accountData.accessToken, '1'),
    refetchOnWindowFocus: false,
    enabled: !!accountData.email,
    retry: 0,
  })

  const deleteMail = async (email: string) => {
    toast.success('Success Delete', { position: 'top-left' })
    await deleteTempMail(email)
    resetTempSession()
    navigate('/')
  }
  useEffect(() => {
    setMessBody(undefined)
  }, [params.mail])

  if (isPending) {
    return <Spinner />
  }

  return (
    <div className={s.mainWrap}>
      <section className={clsx(s.navTempWrap, messageId && s.messageId)}>
        <div className={s.navTemp}>
          <Button className={s.mailButt}>{accountData.email}</Button>
          <div className={s.panel}>
            <div className={s.cursor}>
              <CopyMail mail={accountData.email} />
            </div>
            <RotateCw
              onClick={() => refetch()}
              className={clsx(s.cursor, isFetching && s.fetch)}
            />
            <LogOut
              className={s.cursor}
              onClick={() => deleteMail(accountData?.email)}
            />
          </div>
        </div>
        <div className={s.messageList}>
          {mess &&
            mess?.['hydra:member']?.map((mess: HydraMember) => (
              <div
                key={mess.id}
                className={clsx(
                  s.messageWrap,
                  messageId == mess.id && s.select,
                )}
                onClick={() => setMessBody(mess.id)}
              >
                <div className={s.message}>
                  <Tally1 className={s.readIcon} />
                  <div className={s.messageInfoWrap}>
                    <div className={s.messageInfo}>
                      <div className={s.name}>{mess.from.name}</div>
                      <div className={s.time}>
                        {formatTempDate(mess.createdAt)}
                      </div>
                    </div>
                    <div className={s.sub}>{mess.subject}</div>
                    <div className={s.info}>{mess.intro}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className={clsx(s.tempMailWrap, messageId && s.active)}>
        <div className={s.tempMail}>
          {messBody && (
            <div className={s.backButt}>
              <Button onClick={() => setMessBody(undefined)}>Back</Button>
            </div>
          )}
        </div>
        <div className={s.tempBody}>
          {messBody && <iframe key={messBody.id} srcDoc={messBody.html[0]} />}
        </div>
      </section>
    </div>
  )
}
