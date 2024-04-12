import { Outlet } from 'react-router-dom'

import { MainLayout } from '@/components/mainLayout'

export default function Layout() {
  return (
    <>
      <MainLayout />
      <main>
        <Outlet />
      </main>
    </>
  )
}
