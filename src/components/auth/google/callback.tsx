import React, { useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import Spinner from '../../spiner'
import { decrypt, encrypt } from './options'
import { resetGmailSession } from './query'
import { GoogleAccount } from './types'

const GoogleCallBack = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      const code = new URL(window.location.href).searchParams.get('code')

      if (code) {
        const redirect_uri = `${import.meta.env.VITE_URL}/google/auth/callback`
        const response = await axios.post('https://oauth2.googleapis.com/token', {
          code,
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
          redirect_uri,
          grant_type: 'authorization_code',
        })
        const { access_token, refresh_token } = response.data
        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        const { email, id: googleId, picture, name } = profileResponse.data
        const existingAccount = Cookies.get(`googleMailer_${email}`)

        if (existingAccount) {
          // Update existing account
          const account = await decrypt(existingAccount)
          account.accessToken = access_token
          account.refreshToken = refresh_token
          Cookies.set(`googleMailer_${account.email}`, await encrypt(account), {
            expires: new Date().setFullYear(new Date().getFullYear() + 1),
            sameSite: 'strict',
            secure: true,
          })
        } else {
          // Create new account
          const account: GoogleAccount = {
            name,
            providerId: 'google',
            providerAccountId: googleId,
            email,
            picture,
            accessToken: access_token,
            refreshToken: refresh_token,
            userId: uuidv4(),
          }
          Cookies.set(`googleMailer_${account.email}`, await encrypt(account), {
            expires: new Date().setFullYear(new Date().getFullYear() + 1),
            sameSite: 'strict',
            secure: true,
          })
        }
      }

      resetGmailSession()
      navigate('/')
    }
    fetchData()
  }, [])
  return <Spinner />
}

export default GoogleCallBack
