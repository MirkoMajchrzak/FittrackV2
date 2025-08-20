export type DeviceType = 'strength' | 'cardio'
export type Device = { id: string; name: string; type: DeviceType; icon_url?: string | null }
export type Profile = { id: string; email: string; role: 'user'|'admin' }
export type Log = {
id?: string; user_id: string; device_id: string; performed_at?: string;
reps?: number|null; weight_kg?: number|null; minutes?: number|null; level?: number|null; notes?: string|null
}