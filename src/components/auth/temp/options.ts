import axios from 'axios'
import Cookies from 'js-cookie'
import { redirect } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { decrypt, encrypt } from '../google/options'
import { resetTempSession } from './query'
import { TempAccount, TempMess } from './types'

export async function getTempSession(): Promise<TempAccount[] | null> {
  const cookiesAll = Cookies.get()
  const tempAccounts = Object.keys(cookiesAll)
    .filter(cookieName => cookieName.startsWith('tempMailer_'))
    .map(cookieName => cookiesAll[cookieName])
  const accounts = await Promise.all(
    tempAccounts.map(cookie => {
      const decrypted = decrypt<TempAccount>(cookie)
      if (typeof decrypted === 'object' && decrypted !== null) {
        return decrypted
      }
      throw new Error('Invalid cookie format')
    }),
  )
  return accounts
}

export async function regTempEmailAccount() {
  const domains = await getDomains()

  if (
    !domains ||
    !domains['hydra:member'] ||
    domains['hydra:member'].length === 0
  ) {
    return undefined
  }

  const username = uuidv4().substring(0, 8)
  const password = uuidv4().substring(0, 12)
  const address = `${username}@${domains['hydra:member'][0].domain}`

  try {
    const accountResponse = await axios.post('https://api.mail.tm/accounts', {
      address: address,
      password: password,
    })
    console.log('ACCRESP second', accountResponse.data)

    const loginResponse = await axios.post('https://api.mail.tm/token', {
      address: address,
      password: password,
    })

    const newAccount: TempAccount = {
      email: address,
      provider: 'mail.tm',
      accessToken: loginResponse.data.token,
      expires: Date.now() + 24 * 60 * 60 * 1000,
    }
    console.log('NEW ACC', newAccount)

    Cookies.set(`tempMailer_${address}`, await encrypt(newAccount), {
      expires: newAccount.expires,
      sameSite: 'strict',
      secure: true,
    })
  } catch (error) {
    console.error('Error during account creation or login:', error)

    resetTempSession()
    redirect('/')
  }
  resetTempSession()
  redirect(`temp/${address}`)
}

export async function deleteTempMail(email: string) {
  Cookies.remove(`tempMailer_${email}`)
}

export async function getTempMessages(
  token: string,
  page: string,
): Promise<TempMess | undefined> {
  try {
    if (!page) {
      page = '1'
    }
    const messages = await axios.get(
      `https://api.mail.tm/messages?page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return messages.data
  } catch (error) {
    console.log(error)
  }
}
export async function getMessageBody(token?: string, messageId?: string) {
  if (!token || !messageId) {
    return undefined
  }

  try {
    const message = await axios.get(
      `https://api.mail.tm/messages/${messageId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return message.data
  } catch (error) {
    console.log(error)
  }
}

async function getDomains() {
  try {
    const response = await axios.get('https://api.mail.tm/domains')
    if (response.status !== 200) {
      console.error(
        'Error retrieving domains:',
        response.status,
        response.statusText,
      )
      return null
    }
    return response.data
  } catch (error) {
    console.error('Error retrieving domains:', error)
    return null
  }
}
