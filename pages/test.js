export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Test Tailwind</h1>
        <p className="text-gray-700 mb-4">
          Si vous voyez du bleu et du style, Tailwind fonctionne !
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Bouton Test
        </button>
      </div>
    </div>
  )
}
