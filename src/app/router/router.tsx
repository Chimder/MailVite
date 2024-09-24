import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import GoogleCallBack from '@/components/auth/google/callback'

import Layout from './layout'

export default function Routes() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          // element: <Home />,
          async lazy() {
            let { Home } = await import('../../pages/Home')
            return { Component: Home }
          },
        },
        {
          path: '/google/:mail',
          // element: <Google />,
          async lazy() {
            let { Google } = await import('../../pages/Google')
            return { Component: Google }
          },
        },
        {
          path: '/temp/:mail',
          // element: <Temp />,
          async lazy() {
            let { Temp } = await import('../../pages/Temp')
            return { Component: Temp }
          },
        },
        {
          path: '/google/auth/*',
          element: <GoogleCallBack />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
