import { useEffect, useState } from 'react'
import { Button } from '@radix-ui/themes'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { LogOut, RotateCw, Tally1, Tally2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useInView } from 'react-intersection-observer'
import { useNavigate, useParams } from 'react-router-dom'

import { resetGmailSession } from '../../hooks/google'
import {
  deleteGoogleMail,
  getMessagesAndContent,
  markAsRead,
} from '../auth/google/options'
import { GoogleAccount, mailDatas } from '../auth/google/types'
import CopyMail from '../copy'
import Spinner from '../ui/spiner'
import s from './gmailx.module.scss'

type Props = {
  accountData: GoogleAccount
}

export default function Gmail({ accountData }: Props) {
  console.log('AC', accountData)
  const navigate = useNavigate()
  const params = useParams()
  const [selectedMessage, setSelectedMessage] =
    useState<Partial<mailDatas> | null>()
  const [mailDatas, setMailDatas] = useState<mailDatas[]>([])

  const fetchMessPages = async ({ pageParam }: { pageParam?: number }) => {
    const response: any = await getMessagesAndContent(
      accountData?.accessToken,
      accountData?.refreshToken,
      pageParam,
    )
    return response
  }

  const {
    data: mailData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [`${accountData.email}`],
    queryFn: fetchMessPages,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.nextPageToken) {
        return undefined
      }
      return lastPage.nextPageToken
    },
    initialPageParam: 1,
    enabled: !!accountData,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  useEffect(() => {
    if (mailData) {
      const messages = mailData.pages.flatMap(page => page?.messagesData)
      setMailDatas(messages)
    }
  }, [mailData])

  useEffect(() => {
    setSelectedMessage(null)
  }, [params.mail])

  const { mutate } = useMutation({
    mutationKey: ['read'],
    mutationFn: ({ messId }: { messId: string }) =>
      markAsRead(accountData?.accessToken, accountData?.refreshToken, messId),
    onSuccess: (data, variables) => {
      const updatedMailDatas = mailDatas.map(mess =>
        mess?.messageId === variables.messId
          ? { ...mess, isUnread: false }
          : mess,
      )
      setMailDatas(updatedMailDatas)
    },
  })

  const chooseMessage = (data: Partial<mailDatas>) => {
    mutate({ messId: data?.messageId })
    setSelectedMessage(data)
  }

  const { ref, inView } = useInView()
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView])

  const deleteMail = async (email: string) => {
    toast.success('Success Delete', { position: 'top-left' })
    await deleteGoogleMail(email)
    resetGmailSession()
    navigate('/')
  }
  if (isPending) {
    return <Spinner />
  }

  return (
    <div className={s.gmailContainer}>
      <section className={clsx(s.leftPanel, selectedMessage && s.messageId)}>
        <div className={s.navTemp}>
          <Button className={s.mailButt}>{accountData.email}</Button>
          <div className={s.panel}>
            <div className={s.copy}>
              <CopyMail mail={accountData.email} />
            </div>
            <RotateCw
              onClick={() => refetch()}
              className={clsx(
                s.cursor,
                isFetching && !isFetchingNextPage && s.fetch,
              )}
            />
            <LogOut
              className={s.cursor}
              onClick={() => deleteMail(accountData?.email)}
            />
          </div>
        </div>
        <div className={s.messageList}>
          {mailDatas &&
            mailDatas?.map((mess, i) => (
              <div
                ref={ref}
                key={`${mess.snippet} + ${i}`}
                className={clsx(
                  s.messageWrap,
                  selectedMessage?.messageId == mess?.messageId && s.select,
                )}
                onClick={() => chooseMessage(mess)}
              >
                <div className={s.message}>
                  <div>
                    {mess?.isUnread ? (
                      <Tally2 className={s.notReadIcon} />
                    ) : (
                      <Tally1 className={s.readIcon} />
                    )}
                  </div>
                  <div className={s.messageInfoWrap}>
                    <div className={s.messageInfo}>
                      <div className={s.name}>{mess?.from}</div>
                      <div className={s.time}>{mess?.date}</div>
                    </div>
                    <div className={s.sub}>{mess?.subject}</div>
                    <div className={s.info}>{mess?.snippet}</div>
                  </div>
                </div>
              </div>
            ))}
          <div>
            {isFetchingNextPage && <RotateCw className={s.isFetchSpin} />}
          </div>
        </div>
      </section>

      <section className={clsx(s.rightPanel, selectedMessage && s.active)}>
        <div className={s.bodyWrap}>
          {selectedMessage && (
            <div className={s.backButt}>
              <Button onClick={() => setSelectedMessage(null)}>Back</Button>
            </div>
          )}
        </div>
        <div className={s.bodyData}>
          {selectedMessage?.bodyData &&
          /<[a-z][\s\S]*>/i.test(selectedMessage?.bodyData) ? (
            <iframe srcDoc={selectedMessage?.bodyData} />
          ) : (
            <div className={s.notBodyData} key={selectedMessage?.bodyData}>
              {selectedMessage?.bodyData}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
