import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'


export default function Home({ role }:{ role: 'user'|'admin'|'loading' }){
return (
<div className="px-5 pt-10">
<div className="rounded-3xl gradient-bg text-white p-6 shadow-lg">
<h2 className="text-3xl font-bold">Willkommen 👋</h2>
<p className="opacity-90">Trage dein Training ein und vergleiche die Statistik.</p>
<div className="flex gap-3 mt-4">
<Link to="/log" className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold">Training</Link>
<Link to="/stats" className="bg-white/20 px-4 py-2 rounded-xl">Statistik</Link>
</div>
</div>


<div className="mt-6 space-y-3">
{role==='admin' && <Link to="/admin/devices" className="block p-4 bg-white rounded-2xl shadow">Geräte verwalten (Admin)</Link>}
<button onClick={()=>supabase.auth.signOut()} className="block w-full p-4 bg-white rounded-2xl shadow">Abmelden</button>
</div>
</div>
)
}