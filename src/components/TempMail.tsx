import React, { useEffect, useState } from 'react'
import { formatTempDate } from '@/shared/lib/data-format'
import { useQuery } from '@tanstack/react-query'
import { LogOut, RotateCw, Tally1 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import {
  deleteTempMail,
  getMessageBody,
  getTempMessages,
} from './auth/temp/options'
import { resetTempSession } from './auth/temp/query'
import { HydraMember, TempAccount } from './auth/temp/types'
import CopyMail from './copy'
import Spinner from './spiner'
import { Button } from './ui/button'

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
    <div className="grid h-[100vh] grid-cols-5 bg-background pt-[6.8vh] lg:grid-cols-1">
      <section
        className={`col-span-2 flex flex-col items-center justify-start pl-[12vw] 2xl:pl-[6vw] xl:pl-0 lg:col-span-1 ${messageId && 'lg:hidden'}`}
      >
        <div className="my-2 flex w-full items-center  justify-evenly xl:flex-col">
          <Button className="xl:mb-1 xl:w-full">{accountData.email}</Button>
          <div className="flex w-full  items-center justify-evenly">
            <div className="cursor-pointer hover:scale-110">
              <CopyMail mail={accountData.email} />
            </div>
            <RotateCw
              onClick={() => refetch()}
              className={`cursor-pointer hover:scale-110 ${isFetching ? 'animate-spin' : ''}`}
            />
            <LogOut
              className="cursor-pointer hover:scale-110"
              onClick={() => deleteMail(accountData?.email)}
            />
          </div>
        </div>
        <div className="m-0 flex h-[87vh] w-full flex-col items-center justify-start overflow-x-hidden overflow-y-scroll p-0">
          {mess &&
            mess?.['hydra:member']?.map((mess: HydraMember) => (
              <div
                key={mess.id}
                className={`ml-0 flex w-full cursor-pointer justify-center !pl-0 hover:bg-slate-500/25 ${messageId == mess.id ? 'bg-slate-500/25' : ''}`}
                onClick={() => setMessBody(mess.id)}
              >
                <div className="flex w-full items-center justify-start divide-y divide-dashed divide-blue-200">
                  <Tally1 className="h-6 w-6 pr-1 text-orange-500" />
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="flex text-base">{mess.from.name}</div>
                      <div className="pr-1 text-sm">
                        {formatTempDate(mess.createdAt)}
                      </div>
                    </div>
                    <div className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm">
                      {mess.subject}
                    </div>
                    <div className="line-clamp-2 w-full text-sm">
                      {mess.intro}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section
        className={`relative col-span-3 flex w-full flex-col items-center justify-center overflow-x-hidden
        overflow-y-hidden xl:col-span-3 ${messageId ? 'lg:col-span-1' : 'lg:hidden'}`}
      >
        <div className="relative lg:py-4">
          {messBody && (
            <div
              className="hidden lg:col-span-4 lg:flex lg:w-full lg:flex-col lg:items-center
              lg:justify-center lg:overflow-x-hidden lg:overflow-y-hidden"
            >
              <Button
                className="w-[60vw]"
                onClick={() => setMessBody(undefined)}
              >
                Назад
              </Button>
            </div>
          )}
        </div>
        <div className=" h-full max-h-screen w-full overflow-auto">
          {messBody && (
            <iframe
              key={messBody.id}
              className="flex h-full w-full flex-col items-center justify-center overflow-x-hidden font-sans"
              srcDoc={messBody.html[0]}
            />
          )}
        </div>
      </section>
    </div>
  )
}
