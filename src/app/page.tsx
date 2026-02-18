"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Command } from "lucide-react"

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/chat")
    }
  }, [session, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-4">
          <Command className="h-10 w-10 text-black" />
        </div>
        <h1 className="text-3xl font-bold">Welcome to Gemini Chat</h1>
        <p className="text-gray-400">Sign in to start chatting with AI</p>

        <button
          onClick={() => signIn("google")}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
