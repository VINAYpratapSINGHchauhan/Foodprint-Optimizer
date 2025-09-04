export default function Page() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">FoodPrint Optimizer</h1>
      <p className="text-gray-700">
        Reduce food waste with AI forecasting and smart redistribution.
      </p>
      <ul className="list-disc pl-5">
        <li><a className="text-blue-600 underline" href="/restaurants">Canteen / Restaurant: Log Today&apos;s Data</a></li>
        <li><a className="text-blue-600 underline" href="/ngos">NGO Dashboard</a></li>
        <li><a className="text-blue-600 underline" href="/impact">Impact Metrics</a></li>
      </ul>
    </main>
  )
}
