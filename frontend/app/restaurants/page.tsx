'use client'
import { useState } from 'react'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export default function RestaurantPage() {
  const [prepared, setPrepared] = useState('')
  const [served, setServed] = useState('')
  const [leftover, setLeftover] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const preparedNum = Number(prepared)
    const servedNum = Number(served)
    const leftoverNum = leftover ? Number(leftover) : Math.max(0, preparedNum - servedNum)

    await addDoc(collection(db, 'surplusLogs'), {
      prepared: preparedNum,
      served: servedNum,
      leftover: leftoverNum,
      notes,
      createdAt: serverTimestamp(),
    })
    alert('Data logged!')
    setPrepared(''); setServed(''); setLeftover(''); setNotes('')
  }

  return (
    <div className="p-8 max-w-xl m-auto">
      <h1 className="text-2xl font-bold mb-4">Log Today&apos;s Data</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="number" placeholder="Food Prepared (plates)" value={prepared}
          onChange={e=>setPrepared(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="number" placeholder="Food Served (plates)" value={served}
          onChange={e=>setServed(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="number" placeholder="Leftover / Waste (plates, optional)" value={leftover}
          onChange={e=>setLeftover(e.target.value)} className="w-full p-2 border rounded" />
        <textarea placeholder="Weather / holiday / special notes" value={notes}
          onChange={e=>setNotes(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Submit</button>
      </form>
      <p className="text-xs text-gray-500 mt-2">Tip: Leftover auto-computes if blank.</p>
    </div>
  )
}
