import { useEffect, useState } from 'react'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import parse from 'html-react-parser'
import { LogOut, RotateCw, Tally1, Tally2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useInView } from 'react-intersection-observer'
import { useNavigate, useParams } from 'react-router-dom'

import { deleteGoogleMail, getMessagesAndContent, markAsRead } from './auth/google/options'
import { resetGmailSession } from './auth/google/query'
import { GoogleAccount, mailDatas } from './auth/google/types'
import CopyMail from './copy'
import Spinner from './spiner'
import { Button } from './ui/button'

type Props = {
  accountData: GoogleAccount
}

export default function Gmail({ accountData }: Props) {
  const navigate = useNavigate()
  const params = useParams()
  const [selectedMessage, setSelectedMessage] = useState<any>()
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
      setMailDatas(mailData.pages.flatMap(page => page?.messagesData))
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
        mess?.messageId === variables.messId ? { ...mess, isUnread: false } : mess,
      )
      setMailDatas(updatedMailDatas)
    },
  })

  const chooseMessage = (data: Partial<mailDatas>) => {
    mutate({ messId: data?.messageId })
    setSelectedMessage(data!)
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
    <div className="grid h-[100vh] grid-cols-5 bg-background pt-[6.8vh] lg:grid-cols-1">
      <section
        className={`col-span-2 flex flex-col items-center justify-start pl-[12vw] 2xl:pl-[6vw] xl:pl-0 lg:col-span-1 ${selectedMessage && 'lg:hidden'}`}
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
        <div className="m-0 flex h-[87vh] w-full  flex-col items-center justify-start overflow-x-hidden overflow-y-scroll p-0">
          {mailDatas &&
            mailDatas?.map((mess, i) => (
              <div
                ref={ref}
                key={`${mess.snippet} + ${i}`}
                className={`ml-0 flex w-full cursor-pointer justify-center !pl-0 hover:bg-slate-500/25 ${selectedMessage?.messageId == mess?.messageId ? 'bg-slate-500/25' : ''}`}
                onClick={() => chooseMessage(mess)}
              >
                <div className="flex w-full items-center justify-start divide-y divide-dashed divide-blue-200">
                  <div>
                    {mess?.isUnread ? (
                      <Tally2 className="h-6 w-6 pr-1 text-sky-600" />
                    ) : (
                      <Tally1 className="h-6 w-6 text-orange-500" />
                    )}
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="flex text-base">{mess?.from}</div>
                      <div className="text-s pr-1">{mess?.date}</div>
                    </div>
                    <div className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm">
                      {mess?.subject}
                    </div>
                    <div className="line-clamp-2 w-full text-sm ">{mess?.snippet}</div>
                  </div>
                </div>
              </div>
            ))}
          <div>{isFetchingNextPage && <RotateCw className="my-1  animate-spin " />}</div>
        </div>
      </section>

      <section
        className={`relative col-span-3 flex w-full flex-col items-center justify-center overflow-x-hidden overflow-y-hidden xl:col-span-3 ${selectedMessage ? 'lg:col-span-1' : 'lg:hidden'}`}
      >
        <div className="relative lg:py-4">
          {selectedMessage && (
            <div className="hidden lg:col-span-4 lg:flex lg:w-full lg:flex-col lg:items-center lg:justify-center lg:overflow-x-hidden lg:overflow-y-hidden">
              <Button className="w-[60vw]" onClick={() => setSelectedMessage(null)}>
                Back
              </Button>
            </div>
          )}
        </div>
        <div className=" h-full max-h-screen w-full overflow-auto">
          {selectedMessage?.bodyData && /<[a-z][\s\S]*>/i.test(selectedMessage?.bodyData) ? (
            <iframe
              className="flex h-full w-full items-center justify-center overflow-x-hidden font-sans"
              srcDoc={selectedMessage?.bodyData}
            />
          ) : (
            <div
              className=" flex w-full flex-col items-center justify-center whitespace-pre-wrap px-4"
              key={selectedMessage?.bodyData}
            >
              {selectedMessage?.bodyData}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
