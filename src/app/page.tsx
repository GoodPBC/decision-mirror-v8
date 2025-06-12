import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-800">Decision Mirror</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The Decision Layer of the Internet - Experience the future of
          personalized recommendations
        </p>
        <Link
          href="/mirror"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-normal text-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Experience the Mirror
        </Link>
      </div>
    </main>
  )
}
