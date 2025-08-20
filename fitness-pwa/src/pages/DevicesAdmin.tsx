import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { DeviceType, Device } from '../types'


export default function DevicesAdmin(){
const [devices,setDevices] = useState<Device[]>([])
const [name,setName] = useState('')
const [type,setType] = useState<DeviceType>('strength')
const [file,setFile] = useState<File|null>(null)


async function load(){
const { data } = await supabase.from('devices').select('*').order('created_at',{ascending:false})
setDevices(data as any ?? [])
}
useEffect(()=>{ load() },[])


async function createDevice(e:React.FormEvent){
e.preventDefault()
let icon_url: string | undefined
if(file){
const path = `${crypto.randomUUID()}-${file.name}`
const { data: up, error: upErr } = await supabase.storage.from('device-icons').upload(path, file)
if(upErr) return alert(upErr.message)
const { data: pub } = supabase.storage.from('device-icons').getPublicUrl(up.path)
icon_url = pub.publicUrl
}
const { error } = await supabase.from('devices').insert({ name, type, icon_url })
if(error) alert(error.message)
setName(''); setFile(null); await load()
}


async function remove(id:string){
if(!confirm('Gerät löschen?')) return
const { error } = await supabase.from('devices').delete().eq('id',id)
if(error) alert(error.message)
await load()
}


return (
<div className="p-5">
<h1 className="text-xl font-bold mb-3">Geräte verwalten</h1>
<form onSubmit={createDevice} className="bg-white p-4 rounded-2xl shadow space-y-3">
<input className="w-full border px-3 py-2 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
<div className="flex gap-3">
<label className="flex items-center gap-2"><input type="radio" checked={type==='strength'} onChange={()=>setType('strength')} />Kraft</label>
<label className="flex items-center gap-2"><input type="radio" checked={type==='cardio'} onChange={()=>setType('cardio')} />Cardio</label>
</div>
<input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
<button className="bg-indigo-600 text-white px-4 py-2 rounded-xl">Gerät anlegen</button>
</form>


<ul className="mt-6 space-y-2">
{devices.map(d => (
<li key={d.id} className="bg-white p-4 rounded-2xl shadow flex items-center justify-between">
<div className="flex items-center gap-3">
{d.icon_url && <img src={d.icon_url} className="w-8 h-8 rounded"/>}
<div>
<div className="font-medium">{d.name}</div>
<div className="text-xs text-gray-500">{d.type==='strength'?'Kraft':'Cardio'}</div>
</div>
</div>
<button onClick={()=>remove(d.id)} className="text-red-600">Löschen</button>
</li>
))}
</ul>
</div>
)
}