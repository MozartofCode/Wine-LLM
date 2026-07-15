"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AuthWidget() {
  const { user, isLoading, signInWithEmail, signOut } = useAuth()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) return null

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-rose-700">{user.email}</span>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    )
  }

  if (sent) {
    return <span className="text-sm text-rose-700">Check your email for a sign-in link.</span>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    const { error } = await signInWithEmail(email.trim())
    setSubmitting(false)
    if (error) setError(error)
    else setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-9 w-48 text-sm"
      />
      <Button type="submit" size="sm" disabled={submitting || !email.trim()} className="bg-rose-700 hover:bg-rose-800">
        {submitting ? "Sending..." : "Sign in"}
      </Button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
  )
}
