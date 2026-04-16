import { cookies } from 'next/headers'

const SESSION_COOKIE = 'adsi_admin_session'
const SESSION_VALUE = 'authenticated'
const MAX_AGE = 60 * 60 * 8 // 8 hours

export async function setAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE)
  return cookie?.value === SESSION_VALUE
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
