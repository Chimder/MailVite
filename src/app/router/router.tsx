import { lazy } from 'react'
import Google from '@/pages/Google'
import Home from '@/pages/Home'
import Temp from '@/pages/Temp'
import { createBrowserRouter, Navigate, redirect, RouterProvider } from 'react-router-dom'

import GoogleCallBack from '@/components/auth/google/callback'

import Layout from './layout'

export default function Routes() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/google/:mail',
          element: <Google />,
        },
        {
          path: '/temp/:mail',
          element: <Temp />,
        },
        {
          path: '/google/auth/*',
          element: <GoogleCallBack />,
        },
        // {
        //   path: PATH.STREAMER,
        //   element: <Steamer />,
        //   loader: async ({ params }) => {
        //     const [user, emotes] = await Promise.all([
        //       getUserById(params?.id),
        //       getEmotes(params?.id),
        //     ]);
        //     return { user, emotes };
        //   },
        // },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
