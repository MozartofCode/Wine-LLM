"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User } from "lucide-react"

export function AuthWidget() {
  const { user, isLoading, signInWithEmail, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) return null

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

  const resetAndClose = () => {
    setOpen(false)
    setEmail("")
    setSent(false)
    setError(null)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-rose-700 hover:bg-rose-50 hover:text-rose-900">
          <User className="h-4 w-4 mr-1.5" />
          {user ? "Account" : "Sign in"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        {user ? (
          <div className="space-y-3">
            <p className="text-sm text-rose-900 break-all">{user.email}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                signOut()
                resetAndClose()
              }}
            >
              Sign out
            </Button>
          </div>
        ) : sent ? (
          <p className="text-sm text-rose-700">Check your email for a sign-in link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <p className="text-sm text-rose-900">Sign in to save wines</p>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm"
              autoFocus
            />
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !email.trim()}
              className="w-full bg-rose-700 hover:bg-rose-800"
            >
              {submitting ? "Sending..." : "Send sign-in link"}
            </Button>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </form>
        )}
      </PopoverContent>
    </Popover>
  )
}
