import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage() {
  const user = await getUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
