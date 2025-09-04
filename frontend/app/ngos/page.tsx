'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

type Log = { id: string; prepared: number; served: number; leftover: number; notes?: string }

export default function NGODashboard() {
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(()=>{
    const q = query(collection(db, 'surplusLogs'), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q, snap => {
      setLogs(snap.docs.map(d=>({id:d.id, ...(d.data() as any)})))
    })
    return () => unsub()
  }, [])

  return (
    <div className="p-8 max-w-3xl m-auto">
      <h1 className="text-2xl font-bold mb-4">NGO Dashboard – Available Surplus</h1>
      <div className="grid gap-3">
        {logs.map((log) => (
          <div key={log.id} className="p-4 border rounded bg-white">
            <p><b>Prepared:</b> {log.prepared}</p>
            <p><b>Served:</b> {log.served}</p>
            <p className="text-green-700"><b>Leftover (surplus):</b> {log.leftover}</p>
            {log.notes && <p className="text-gray-600 text-sm"><b>Notes:</b> {log.notes}</p>}
          </div>
        ))}
        {logs.length === 0 && <p className="text-gray-600">No recent logs yet.</p>}
      </div>
    </div>
  )
}
