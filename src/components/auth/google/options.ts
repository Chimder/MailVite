import axios, { AxiosError } from 'axios'
import { jwtVerify, SignJWT } from 'jose'
import { Base64 } from 'js-base64'
import Cookies from 'js-cookie'

import { formatDate } from '../../../shared/lib/data-format'
import { GoogleAccount } from './types'

const secretKey = import.meta.env.VITE_SECRET
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().sign(key)
}

export async function decrypt(input: string): Promise<any> {
  if (!input) {
    console.error('ER dECRYPT INPUT')
    return undefined
  }
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Error during decryption:', error)
    return undefined
  }
}

export async function deleteGoogleMail(email: string) {
  Cookies.remove(`googleMailer_${email}`)
}

export async function getGmailSession(): Promise<GoogleAccount[] | null> {
  const cookiesAll = Cookies.get()
  const tempAccounts = Object.keys(cookiesAll)
    .filter(cookieName => cookieName.startsWith('googleMailer_'))
    .map(cookieName => cookiesAll[cookieName])
  const accounts = await Promise.all(tempAccounts.map(cookie => decrypt(cookie)))
  return accounts
}

async function makeAuthenticatedRequest(url: string, refreshToken: string) {
  const refreshResponse = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })

  const accessToken = refreshResponse.data.access_token

  // Делаем запрос с новым токеном доступа
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  })

  return { data: response.data, accessToken }
}

export async function getMessagesAndContent(
  accessToken: string,
  refreshToken: string,
  pageToken?: number,
) {
  if (!accessToken || !refreshToken) {
    throw new Error('Account not found')
  }

  const url = `https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=100&pageToken=${pageToken}`

  const { data, accessToken: updatedAccessToken } = await makeAuthenticatedRequest(
    url,
    refreshToken,
    // accessToken,
  )

  const nextPageToken = data.nextPageToken

  if (!data.messages) {
    return undefined
  }

  const messages = await Promise.allSettled(
    data.messages.map(async (message: any) => {
      const messageUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`
      const messageResponse = await axios.get(messageUrl, {
        headers: {
          Authorization: `Bearer ${updatedAccessToken}`,
          Accept: 'application/json',
        },
      })
      return messageResponse.data
    }),
  )

  const messagesData = messages
    .map((message: any, i: number) => {
      if (message.status === 'fulfilled') {
        const payload = message.value?.payload
        const headers = payload?.headers
        if (headers) {
          const subjectHeader = headers.find((header: any) => header.name === 'Subject')
          const fromHeader = headers.find((header: any) => header.name === 'From')
          const toHeader = headers.find((header: any) => header.name === 'To')
          const dateHeader = headers.find((header: any) => header.name === 'Date')

          const subject = subjectHeader ? subjectHeader.value : ''
          const from = fromHeader ? extractName(fromHeader.value) : ''
          const to = toHeader ? toHeader.value : ''
          const date = dateHeader ? formatDate(dateHeader.value) : ''

          const messageId = message.value?.id
          const snippet = message.value?.snippet
          const isUnread = message.value?.labelIds
            ? message.value.labelIds.includes('UNREAD')
            : false

          let isBodyWithParts = false
          let body
          if (payload?.parts) {
            if (payload.parts.length > 1) {
              body = payload.parts[1]?.body?.data
            } else {
              body = payload.parts[0]?.body?.data
            }
          } else {
            isBodyWithParts = true
            body = payload?.body?.data
          }

          let decodedText = ''
          if (body) {
            const base64text = body.replace(/-/g, '+').replace(/_/g, '/')
            decodedText = Base64.decode(base64text)
          }

          const bodyData = decodedText
          return {
            messageId,
            subject,
            from,
            to,
            date,
            snippet,
            isUnread,
            isBodyWithParts,
            bodyData,
          }
        }
      }
      return null
    })
    .filter(message => message !== null)

  return { messagesData, nextPageToken }
}

function extractName(from: string) {
  const match = from.match(/(.*)<.*>/)
  return match ? match[1].trim() : from
}

export async function markAsRead(accessToken: string, refreshToken: string, messageId: string) {
  if (!accessToken || !refreshToken) {
    throw new Error('Account not found')
  }

  const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`

  try {
    await axios.post(
      url,
      {
        removeLabelIds: ['UNREAD'],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    )
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError?.response?.status === 401) {
      console.log('Token истек MODIFY')
      const refreshResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      })

      accessToken = refreshResponse.data.access_token

      await axios.post(
        url,
        {
          removeLabelIds: ['UNREAD'],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
      )
    } else {
      throw error
    }
  }
}
