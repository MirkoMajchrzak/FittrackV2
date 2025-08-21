import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState<string|null>(null)

  const onLogin = async (e:React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen login-gradient text-white flex flex-col">
      {/* Header/Icon */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <img
          src="/abe_bear_icon.png"
          alt="App Icon"
          className="w-28 h-28 rounded-3xl logo-shadow ring-1 ring-white/40 mb-5"
        />
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
          FitTrack
        </h1>
        <p className="mt-1 text-white/80 text-sm">Willkommen zurück 👋</p>

        {/* Login-Karte */}
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 space-y-3 shadow-xl ring-1 ring-white/20"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-white/80">E-Mail</span>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="du@example.com"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              inputMode="email"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wide text-white/80">Passwort</span>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 rounded bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="••••••••"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-white text-indigo-700 font-semibold active:scale-[.99] disabled:opacity-70"
          >
            {loading ? 'Einloggen…' : 'Einloggen'}
          </button>

          {error && (
            <p className="text-sm text-red-100 bg-red-500/20 border border-red-400/40 rounded px-3 py-2">
              {error}
            </p>
          )}
        </form>

        <div className="mt-4 text-xs text-white/70">
          derzeit nur für Äffchen und Bärchen
        </div>
      </div>

      {/* Safe-Area Footer Abstand für Mobile */}
      <div className="h-6" />
    </div>
  )
}
