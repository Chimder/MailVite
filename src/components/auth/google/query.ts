import { useQuery } from '@tanstack/react-query'

import { queryClient } from '@/app/providers'

import { getGmailSession } from './options'

// const queryKeySession = ['temp_session']
export function useGmailSession() {
  return useQuery({
    queryKey: ['gmail_session'],
    queryFn: () => getGmailSession(),
    // retry: 1,
    // staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function resetGmailSession() {
  queryClient.refetchQueries({ queryKey: ['gmail_session'] })
}
