import React, { useState } from 'react'
import { formatTempDate } from '@/shared/lib/data-format'
import { useQuery } from '@tanstack/react-query'
import { LogOut, RotateCw, Tally1 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { deleteTempMail, getMessageBody, getTempMessages } from './auth/temp/options'
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

  if (isPending) {
    return <Spinner />
  }

  return (
    <div className="grid h-[100vh] grid-cols-5 bg-background pt-[6.8vh]">
      <section className="col-span-2 flex flex-col items-center justify-start pl-[12vw] ">
        <div className="my-2 flex w-full items-center justify-evenly">
          <Button className="cursor-pointer hover:scale-110">{accountData.email}</Button>
          <div className="cursor-pointer hover:scale-110">
            <CopyMail mail={accountData.email} />
          </div>
          <RotateCw
            onClick={() => refetch()}
            className={`cursor-pointer hover:scale-110${isFetching ? 'animate-spin' : ''}`}
          />
          <LogOut
            className="cursor-pointer hover:scale-110"
            onClick={() => deleteMail(accountData.email)}
          />
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
                      <div className="pr-1 text-sm">{formatTempDate(mess.createdAt)}</div>
                    </div>
                    <div className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm">
                      {mess.subject}
                    </div>
                    <div className="line-clamp-2 w-full text-sm">{mess.intro}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="col-span-3 flex w-full flex-col items-center justify-center  overflow-x-hidden ">
        {messBody && (
          <iframe
            key={messBody.id}
            className="flex h-full w-full flex-col items-center justify-center overflow-x-hidden font-sans"
            srcDoc={messBody.html[0]}
          />
        )}
      </section>
    </div>
  )
}
