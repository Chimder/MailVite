export const redirects = {
  toHome: '/',
  toGoogleLogin: '/google/login',
  // toSignup: "/signup",
  // afterLogin: "/dashboard",
  // afterLogout: "/",
  // toVerify: "/verify-email",
  // afterVerify: "/dashboard",
} as const

export const redirect_uri = `${import.meta.env.VITE_URL}/google/auth/callback`
export const GoogleLoginURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=openid%20profile%20email%20https://www.googleapis.com/auth/gmail.modify&access_type=offline&prompt=consent`
