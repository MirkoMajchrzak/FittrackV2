import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './pages/Login'
import Home from './pages/Home'
import LogPage from './pages/LogPage'
import Stats from './pages/Stats'
import DevicesAdmin from './pages/DevicesAdmin'


function BottomNav() {
const { pathname } = useLocation()
const tabs = [
{ to: '/', label: 'Home' },
{ to: '/log', label: 'Training' },
{ to: '/stats', label: 'Statistik' },
]
return (
<nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t">
<ul className="flex justify-around py-2 text-sm">
{tabs.map(t => (
<li key={t.to}>
<Link className={`px-3 py-2 rounded ${pathname===t.to?'font-semibold text-indigo-600':''}`} to={t.to}>{t.label}</Link>
</li>
))}
</ul>
</nav>
)
}


export default function App(){
const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(null)
const [role, setRole] = useState<'user'|'admin'|'loading'>('loading')


useEffect(() => {
supabase.auth.getSession().then(({ data }) => setSession(data.session))
const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
return () => sub.subscription.unsubscribe()
}, [])


useEffect(() => {
async function loadRole(){
if(!session) { setRole('loading'); return }
const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
setRole((data?.role as any) ?? 'user')
}
loadRole()
}, [session])


if(!session) return <Login />


return (
<div className="pb-16 min-h-screen bg-gray-50">
<Routes>
<Route path="/" element={<Home role={role} />} />
<Route path="/log" element={<LogPage />} />
<Route path="/stats" element={<Stats />} />
{role==='admin' && <Route path="/admin/devices" element={<DevicesAdmin />} />}
<Route path="*" element={<Navigate to="/" />} />
</Routes>
<BottomNav />
</div>
)
}