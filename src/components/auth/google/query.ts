import { useQuery } from '@tanstack/react-query'

import { queryClient } from '@/app/providers'

import { getGmailSession } from './options'

export function useGmailSession() {
  return useQuery({
    queryKey: ['gmail_session'],
    queryFn: () => getGmailSession(),
    refetchOnWindowFocus: false,
  })
}

export function resetGmailSession() {
  queryClient.refetchQueries({ queryKey: ['gmail_session'] })
}
