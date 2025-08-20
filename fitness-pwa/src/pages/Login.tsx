import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'


export default function Login(){
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [loading,setLoading] = useState(false)
const [error,setError] = useState<string|null>(null)


const onLogin = async (e:React.FormEvent) => {
e.preventDefault(); setLoading(true); setError(null)
const { error } = await supabase.auth.signInWithPassword({ email, password })
if(error) setError(error.message)
setLoading(false)
}


return (
<div className="min-h-screen gradient-bg text-white flex flex-col">
<div className="grow flex flex-col justify-center items-center px-6">
<h1 className="text-4xl font-extrabold mb-6">FitnessApp</h1>
<form onSubmit={onLogin} className="w-full max-w-sm bg-white/10 backdrop-blur rounded-2xl p-5 space-y-3">
<input className="w-full px-3 py-2 rounded text-black" placeholder="E-Mail" value={email} onChange={e=>setEmail(e.target.value)} />
<input type="password" className="w-full px-3 py-2 rounded text-black" placeholder="Passwort" value={password} onChange={e=>setPassword(e.target.value)} />
<button disabled={loading} className="w-full py-2 rounded-xl bg-white text-indigo-600 font-semibold">{loading?'…':'Einloggen'}</button>
{error && <p className="text-sm text-red-100">{error}</p>}
</form>
</div>
<div className="p-4 text-center/70 text-white/80 text-xs">Nur für eingeladene Nutzer · PWA fähig</div>
</div>
)
}