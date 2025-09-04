'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

export default function ImpactPage(){
  const [totalSaved, setTotalSaved] = useState(0)

  useEffect(()=>{
    const unsub = onSnapshot(collection(db, 'surplusLogs'), snap=>{
      let sum = 0
      snap.forEach(doc=> { const d = doc.data() as any; sum += Number(d.leftover||0) })
      setTotalSaved(sum)
    })
    return () => unsub()
  }, [])

  // Simple conversion assumptions for demo
  const meals = totalSaved
  const co2kg = totalSaved * 1.8  // placeholder
  const peopleFed = Math.round(meals)

  return (
    <div className="p-8 max-w-3xl m-auto space-y-4">
      <h1 className="text-2xl font-bold">Impact Metrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-white"><h2 className="text-lg font-semibold">Meals Saved</h2><p className="text-3xl">{meals}</p></div>
        <div className="p-4 border rounded bg-white"><h2 className="text-lg font-semibold">CO₂ Avoided (kg)</h2><p className="text-3xl">{co2kg.toFixed(1)}</p></div>
        <div className="p-4 border rounded bg-white"><h2 className="text-lg font-semibold">People Fed</h2><p className="text-3xl">{peopleFed}</p></div>
      </div>
      <p className="text-gray-600 text-sm">* Conversion factors are demo placeholders for hackathon.</p>
    </div>
  )
}
