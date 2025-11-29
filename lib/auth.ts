import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: "discord"
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value) as User
  } catch {
    return null
  }
}

export async function setUser(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function clearUser() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
