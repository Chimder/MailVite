import { useQuery } from '@tanstack/react-query'

import { queryClient } from '@/app/providers/providers'

import { getTempSession } from '../components/auth/temp/options'

export function useTempSession() {
  return useQuery({
    queryKey: ['temp_session'],
    queryFn: () => getTempSession(),
    refetchOnWindowFocus: false,
  })
}

export function resetTempSession() {
  queryClient.refetchQueries({ queryKey: ['temp_session'] })
}
