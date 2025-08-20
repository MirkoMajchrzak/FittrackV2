import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Device, Log } from '../types'


export default function LogPage(){
const [devices,setDevices] = useState<Device[]>([])
const [deviceId,setDeviceId] = useState<string>('')
const [values,setValues] = useState({ reps:'', weight_kg:'', minutes:'', level:'', notes:'' })
const [myLogs,setMyLogs] = useState<any[]>([])


useEffect(()=>{ (async()=>{
const { data } = await supabase.from('devices').select('*').order('name')
setDevices(data as any ?? [])
})() },[])


const selected = useMemo(()=> devices.find(d=>d.id===deviceId), [devices,deviceId])


async function submit(e:React.FormEvent){
e.preventDefault()
const user = (await supabase.auth.getUser()).data.user!
const payload: Log = { user_id: user.id, device_id: deviceId,
reps: selected?.type==='strength'? Number(values.reps) || null : null,
weight_kg: selected?.type==='strength'? Number(values.weight_kg) || null : null,
minutes: selected?.type==='cardio'? Number(values.minutes) || null : null,
level: selected?.type==='cardio'? Number(values.level) || null : null,
notes: values.notes || null }
const { error } = await supabase.from('logs').insert(payload as any)
if(error) return alert(error.message)
setValues({ reps:'', weight_kg:'', minutes:'', level:'', notes:'' })
await loadMyLogs()
}


async function loadMyLogs(){
const { data } = await supabase.from('logs').select('*, devices(name,type)').order('performed_at',{ascending:false}).limit(10)
setMyLogs(data as any ?? [])
}
useEffect(()=>{ loadMyLogs() },[])


return (
<div className="p-5">
<h1 className="text-xl font-bold mb-3">Training eintragen</h1>
<form onSubmit={submit} className="bg-white p-4 rounded-2xl shadow space-y-3">
<select className="w-full border px-3 py-2 rounded" value={deviceId} onChange={e=>setDeviceId(e.target.value)}>
<option value="">Gerät wählen…</option>
{devices.map(d=> <option key={d.id} value={d.id}>{d.name} {d.type==='strength'?'(Kraft)':'(Cardio)'}</option>)}
</select>


{selected?.type==='strength' && (
<div className="grid grid-cols-2 gap-3">
<input className="border px-3 py-2 rounded" placeholder="Wiederholungen" inputMode="numeric" value={values.reps} onChange={e=>setValues(v=>({...v,reps:e.target.value}))} />
<input className="border px-3 py-2 rounded" placeholder="Gewicht (kg)" inputMode="decimal" value={values.weight_kg} onChange={e=>setValues(v=>({...v,weight_kg:e.target.value}))} />
</div>
)}
{selected?.type==='cardio' && (
<div className="grid grid-cols-2 gap-3">
<input className="border px-3 py-2 rounded" placeholder="Minuten" inputMode="numeric" value={values.minutes} onChange={e=>setValues(v=>({...v,minutes:e.target.value}))} />
<input className="border px-3 py-2 rounded" placeholder="Stufe" inputMode="numeric" value={values.level} onChange={e=>setValues(v=>({...v,level:e.target.value}))} />
</div>
)}
<textarea className="w-full border px-3 py-2 rounded" placeholder="Notizen (optional)" value={values.notes} onChange={e=>setValues(v=>({...v,notes:e.target.value}))} />
<button disabled={!deviceId} className="bg-indigo-600 text-white px-4 py-2 rounded-xl">Speichern</button>
</form>


<h2 className="mt-6 font-semibold">Letzte Einträge</h2>
<ul className="mt-2 space-y-2">
{myLogs.map((l:any)=> (
<li key={l.id} className="bg-white p-3 rounded-xl shadow text-sm flex justify-between">
<span className="font-medium">{l.devices?.name}</span>
{l.devices?.type==='strength' ? (
<span>{l.reps}× @ {l.weight_kg} kg</span>
) : (
<span>{l.minutes} min · Stufe {l.level}</span>
)}
</li>
))}
</ul>
</div>
)
}