import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: "discord" | "email"
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")

  if (!userCookie) {
    return null
  }

  try {
    const decoded = Buffer.from(userCookie.value, "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export async function setUser(user: User) {
  const cookieStore = await cookies()
  const encoded = Buffer.from(JSON.stringify(user)).toString("base64")
  cookieStore.set("user", encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearUser() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
}
