import { useQuery } from '@tanstack/react-query'

import { queryClient } from '@/app/providers'

import { getTempSession } from './options'

// const queryKeySession = ['temp_session']
export function useTempSession() {
  return useQuery({
    queryKey: ['temp_session'],
    queryFn: () => getTempSession(),
    // retry: 1,
    // staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function resetTempSession() {
  queryClient.refetchQueries({ queryKey: ['temp_session'] })
}
