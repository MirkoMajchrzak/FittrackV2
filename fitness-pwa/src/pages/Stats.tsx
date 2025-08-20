import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


type Row = { week: string; volume?: number; minutes?: number; user_id: string }


export default function Stats(){
const [strength,setStrength] = useState<Row[]>([])
const [cardio,setCardio] = useState<Row[]>([])
const [users,setUsers] = useState<Record<string,string>>({})


useEffect(()=>{ (async()=>{
const { data: profs } = await supabase.from('profiles').select('id,email')
const map: Record<string,string> = {}
profs?.forEach(p=> map[p.id] = p.email)
setUsers(map)
const { data: s } = await supabase.from('v_strength_volume').select('*').order('week')
setStrength(s as any ?? [])
const { data: c } = await supabase.from('v_cardio_minutes').select('*').order('week')
setCardio(c as any ?? [])
})() },[])


const grouped = (rows:Row[], field:'volume'|'minutes') => {
const g: Record<string, any> = {}
rows.forEach(r=>{
const w = new Date(r.week).toLocaleDateString()
g[w] ||= { week:w }
g[w][users[r.user_id]||r.user_id] = (g[w][users[r.user_id]||r.user_id]||0) + (r as any)[field]
})
return Object.values(g)
}


return (
<div className="p-5">
<h1 className="text-xl font-bold mb-3">Statistik</h1>


<div className="bg-white p-4 rounded-2xl shadow mb-6">
<h2 className="font-semibold mb-2">Kraft – Volumen (Whd×kg) pro Woche</h2>
<div style={{height:240}}>
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={grouped(strength,'volume')}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="week" />
<YAxis />
<Tooltip /><Legend />
{Object.values(users).map((email,i)=> (
<Area key={email} type="monotone" dataKey={email} stackId="1" />
))}
</AreaChart>
</ResponsiveContainer>
</div>
</div>


<div className="bg-white p-4 rounded-2xl shadow">
<h2 className="font-semibold mb-2">Cardio – Minuten pro Woche</h2>
<div style={{height:240}}>
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={grouped(cardio,'minutes')}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="week" />
<YAxis />
<Tooltip /><Legend />
{Object.values(users).map((email,i)=> (
<Area key={email} type="monotone" dataKey={email} stackId="1" />
))}
</AreaChart>
</ResponsiveContainer>
</div>
</div>
</div>
)
}