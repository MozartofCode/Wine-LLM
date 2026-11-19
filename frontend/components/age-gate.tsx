"use client"

import { useEffect, useState } from "react"
import { Wine } from "lucide-react"

const KEY = "pour-decisions:age-ok"

export function AgeGate() {
  const [show, setShow] = useState(false)
  const [declined, setDeclined] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(KEY) !== "1") setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  if (!show) return null

  function confirm() {
    try {
      window.localStorage.setItem(KEY, "1")
    } catch {
      // can't remember the answer; the gate will show again next visit
    }
    setShow(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/70 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <Wine className="h-6 w-6" />
        </span>
        {declined ? (
          <>
            <h2 id="age-gate-title" className="mt-4 text-xl font-bold text-rose-950">
              Come back a little later
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              This site is about alcohol, so it's only for people of legal drinking age where they live.
            </p>
          </>
        ) : (
          <>
            <h2 id="age-gate-title" className="mt-4 text-xl font-bold text-rose-950">
              Are you of legal drinking age?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Pour Decisions is about wine, so we need to check before you come in.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeclined(true)}
                className="flex-1 rounded-full border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-800 hover:bg-rose-50"
              >
                Not yet
              </button>
              <button
                type="button"
                onClick={confirm}
                autoFocus
                className="flex-1 rounded-full bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800"
              >
                Yes, I am
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
