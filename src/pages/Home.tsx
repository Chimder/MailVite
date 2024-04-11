import { Link } from 'react-router-dom'

import { useGmailSession } from '@/components/auth/google/query'
import { regTempEmailAccount } from '@/components/auth/temp/options'
import { useTempSession } from '@/components/auth/temp/query'

import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'

export default function Home() {
  const { data: googleSession } = useGmailSession()
  const { data: tempSession } = useTempSession()
  const redirect_uri = `${import.meta.env.VITE_URL}/google/auth/callback`
  const GoogleLoginURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=openid%20profile%20email%20https://www.googleapis.com/auth/gmail.modify&access_type=offline&prompt=consent`

  // const path = useParams()
  const limit = (googleSession?.length || 0) + (tempSession?.length || 0) === 6
  return (
    <main className="absolute flex h-full w-full items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Manage your mail</CardTitle>
          <CardDescription>Connect to Gmail or Temp mail</CardDescription>
          {limit && <CardTitle className="text-sm text-red-600">Limit 6 mail</CardTitle>}
        </CardHeader>
        <CardContent>
          <div className="px-10">
            <div className="flex  flex-col items-center justify-center space-y-5">
              <Link className={`w-full ${limit && 'pointer-events-none'}`} to={GoogleLoginURL}>
                <Button disabled={limit} className="w-full">
                  <svg
                    className="mr-1 h-7 w-7"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <div className="text-base">Google</div>
                </Button>
              </Link>
              <Button
                onClick={() => regTempEmailAccount()}
                className={`w-full  ${limit && 'pointer-events-none'}`}
                disabled={limit}
              >
                <svg
                  className="w-28"
                  viewBox="0 0 147 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M56.584 8.552c1.835 0 3.296.597 4.384 1.792 1.11 1.195 1.664 2.795 1.664 4.8V25h-4.128v-9.568c0-.96-.235-1.707-.704-2.24-.47-.533-1.13-.8-1.984-.8-.939 0-1.675.31-2.208.928-.512.619-.768 1.515-.768 2.688V25h-4.128v-9.568c0-.96-.235-1.707-.704-2.24-.47-.533-1.13-.8-1.984-.8-.917 0-1.653.31-2.208.928-.533.619-.8 1.515-.8 2.688V25h-4.128V9h4.128v1.696c.96-1.43 2.443-2.144 4.448-2.144 1.963 0 3.413.768 4.352 2.304 1.067-1.536 2.656-2.304 4.768-2.304ZM78.298 9h4.128v16h-4.128v-1.888c-1.237 1.557-2.976 2.336-5.216 2.336-2.133 0-3.968-.81-5.504-2.432-1.515-1.643-2.272-3.648-2.272-6.016s.757-4.363 2.272-5.984c1.536-1.643 3.37-2.464 5.504-2.464 2.24 0 3.979.779 5.216 2.336V9Zm-7.616 11.264c.832.832 1.888 1.248 3.168 1.248 1.28 0 2.336-.416 3.168-1.248.853-.853 1.28-1.941 1.28-3.264 0-1.323-.427-2.4-1.28-3.232-.832-.853-1.888-1.28-3.168-1.28-1.28 0-2.336.427-3.168 1.28-.832.832-1.248 1.91-1.248 3.232 0 1.323.416 2.41 1.248 3.264ZM88.217 7.08c-.682 0-1.28-.245-1.792-.736-.49-.512-.736-1.11-.736-1.792 0-.683.246-1.28.736-1.792.512-.512 1.11-.768 1.792-.768.704 0 1.302.256 1.792.768.512.512.768 1.11.768 1.792 0 .683-.256 1.28-.768 1.792-.49.49-1.088.736-1.792.736ZM86.17 25V9h4.128v16H86.17Zm7.907 0V1.64h4.128V25h-4.128Zm12.226-.384a2.62 2.62 0 0 1-1.92.8 2.618 2.618 0 0 1-1.92-.8 2.616 2.616 0 0 1-.8-1.92c0-.747.266-1.387.8-1.92a2.618 2.618 0 0 1 1.92-.8 2.62 2.62 0 0 1 1.92.8c.533.533.8 1.173.8 1.92a2.62 2.62 0 0 1-.8 1.92Z"
                    fill="#252F3F"
                    data-darkreader-inline-fill=""
                  ></path>
                  <path
                    d="M119.696 12.968h-3.616v6.656c0 .555.139.96.416 1.216.278.256.683.405 1.216.448.534.021 1.195.01 1.984-.032V25c-2.837.32-4.842.053-6.016-.8-1.152-.853-1.728-2.379-1.728-4.576v-6.656h-2.784V9h2.784V5.768l4.128-1.248V9h3.616v3.968Zm20.857-4.416c1.834 0 3.296.597 4.384 1.792 1.109 1.195 1.664 2.795 1.664 4.8V25h-4.128v-9.568c0-.96-.235-1.707-.704-2.24-.47-.533-1.131-.8-1.984-.8-.939 0-1.675.31-2.208.928-.512.619-.768 1.515-.768 2.688V25h-4.128v-9.568c0-.96-.235-1.707-.704-2.24-.47-.533-1.131-.8-1.984-.8-.918 0-1.654.31-2.208.928-.534.619-.8 1.515-.8 2.688V25h-4.128V9h4.128v1.696c.96-1.43 2.442-2.144 4.448-2.144 1.962 0 3.413.768 4.352 2.304 1.066-1.536 2.656-2.304 4.768-2.304Z"
                    fill="#5850EC"
                    data-darkreader-inline-fill=""
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24.486 7.512a12 12 0 1 0-1.972 18.568 2 2 0 1 1 2.174 3.356A16 16 0 1 1 32 15.998a6 6 0 0 1-9.6 4.802 8 8 0 1 1 1.6-4.802 2 2 0 1 0 4 0c0-3.074-1.172-6.14-3.514-8.486ZM20 15.998a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
                    fill="#5850EC"
                    data-darkreader-inline-fill=""
                  ></path>
                </svg>
              </Button>
            </div>
            <div className="flex flex-col space-y-1.5"></div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </main>
  )
}
