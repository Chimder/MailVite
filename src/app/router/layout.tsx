import { Outlet } from 'react-router-dom'

import { MainLayout } from '@/components/Layout/mainLayout'

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
