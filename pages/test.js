import { useEffect } from 'react'

export default function TestPage() {
  useEffect(() => {
    // Configuration de base
    const API_BASE_URL = "http://localhost:3000/api"

    // Test 1: Récupération de la liste des champions
    async function testChampionsAPI() {
      console.log("🧪 Test 1: API Champions (GET)")

      try {
        const response = await fetch(`${API_BASE_URL}/champions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        console.log("✅ Status:", response.status)
        console.log("✅ Champions count:", data.champions?.length || 0)
        console.log("✅ Version:", data.version)
        console.log("✅ Sample champions:", data.champions?.slice(0, 5))

        return response.status === 200
      } catch (error) {
        console.error("❌ Erreur API Champions:", error)
        return false
      }
    }

    // Test 2: Analyse de matchup valide
    async function testMatchupAPI() {
      console.log("\n🧪 Test 2: API Matchup (POST) - Cas valide")

      const testData = {
        champ1: "Yasuo",
        champ2: "Zed",
        patch: "14.1.1",
      }

      try {
        const response = await fetch(`${API_BASE_URL}/matchup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
        })

        const data = await response.json()

        console.log("✅ Status:", response.status)
        console.log("✅ Result length:", data.result?.length || 0)
        console.log("✅ Result preview:", data.result?.substring(0, 100) + "...")

        return response.status === 200
      } catch (error) {
        console.error("❌ Erreur API Matchup:", error)
        return false
      }
    }

    // Test 3: Matchup avec différents champions
    async function testMatchupVariations() {
      console.log("\n🧪 Test 3: API Matchup - Variations de champions")

      const testCases = [
        { champ1: "Jinx", champ2: "Caitlyn", patch: "14.1.1" },
        { champ1: "Darius", champ2: "Garen", patch: "14.1.1" },
        { champ1: "Ahri", champ2: "LeBlanc", patch: "14.1.1" },
      ]

      for (const [index, testCase] of testCases.entries()) {
        try {
          console.log(
            `\n📋 Test 3.${index + 1}: ${testCase.champ1} vs ${testCase.champ2}`
          )

          const response = await fetch(`${API_BASE_URL}/matchup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(testCase),
          })

          const data = await response.json()

          console.log("✅ Status:", response.status)
          console.log(
            "✅ Contains champions:",
            data.result?.includes(testCase.champ1) &&
              data.result?.includes(testCase.champ2)
          )
        } catch (error) {
          console.error(`❌ Erreur Test 3.${index + 1}:`, error)
        }
      }
    }

    // Test 4: Cas d'erreur - données manquantes
    async function testMatchupErrors() {
      console.log("\n🧪 Test 4: API Matchup - Gestion d'erreurs")

      const errorCases = [
        { description: "Body vide", data: {} },
        {
          description: "Champion manquant",
          data: { champ1: "Yasuo", patch: "14.1.1" },
        },
        { description: "Patch manquant", data: { champ1: "Yasuo", champ2: "Zed" } },
      ]

      for (const [index, errorCase] of errorCases.entries()) {
        try {
          console.log(`\n📋 Test 4.${index + 1}: ${errorCase.description}`)

          const response = await fetch(`${API_BASE_URL}/matchup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(errorCase.data),
          })

          const data = await response.json()

          console.log("✅ Status:", response.status)
          console.log("✅ Fallback response:", data.result ? "Oui" : "Non")
        } catch (error) {
          console.error(`❌ Erreur Test 4.${index + 1}:`, error)
        }
      }
    }

    // Test de performance
    async function testPerformance() {
      console.log("\n🧪 Test 5: Performance API")

      const testData = {
        champ1: "Yasuo",
        champ2: "Zed",
        patch: "14.1.1",
      }

      const iterations = 5
      const times = []

      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now()

        try {
          const response = await fetch(`${API_BASE_URL}/matchup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(testData),
          })

          await response.json()
          const endTime = performance.now()
          times.push(endTime - startTime)

          console.log(`✅ Test ${i + 1}: ${Math.round(endTime - startTime)}ms`)
        } catch (error) {
          console.error(`❌ Erreur Performance Test ${i + 1}:`, error)
        }
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length
      console.log(`📊 Temps moyen: ${Math.round(avgTime)}ms`)
    }

    // Fonction pour exécuter tous les tests
    async function runAllTests() {
      console.log("🚀 Démarrage des tests API Matchup Mentor\n")
      console.log("=".repeat(50))

      const results = {
        champions: await testChampionsAPI(),
        matchup: await testMatchupAPI(),
      }

      await testMatchupVariations()
      await testMatchupErrors()
      await testPerformance()

      console.log("\n" + "=".repeat(50))
      console.log("📋 Résumé des tests:")
      console.log("✅ API Champions:", results.champions ? "PASS" : "FAIL")
      console.log("✅ API Matchup:", results.matchup ? "PASS" : "FAIL")
      console.log("\n🎯 Tests terminés!")
    }

    // Exposer les tests dans la console
    window.testAPI = {
      all: runAllTests,
      champions: testChampionsAPI,
      matchup: testMatchupAPI,
      variations: testMatchupVariations,
      errors: testMatchupErrors,
      performance: testPerformance,
    }

    // Instructions d'utilisation
    console.log(`
🧪 Tests API Matchup Mentor
============================

Pour exécuter les tests:

1. Tous les tests:
   testAPI.all()

2. Tests individuels:
   testAPI.champions()    // Test API Champions
   testAPI.matchup()      // Test API Matchup
   testAPI.variations()   // Test différents champions
   testAPI.errors()       // Test gestion d'erreurs
   testAPI.performance()  // Test de performance

3. Dans Postman:
   - GET http://localhost:3000/api/champions
   - POST http://localhost:3000/api/matchup
     Body: {"champ1": "Yasuo", "champ2": "Zed", "patch": "14.1.1"}

Assurez-vous que le serveur tourne sur http://localhost:3000
`)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
            🧪 Tests API Matchup Mentor
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">📋 Instructions</h2>
              <div className="text-blue-100 space-y-2">
                <p>1. Ouvrez la console du navigateur (F12)</p>
                <p>2. Tapez <code className="bg-black/30 px-2 py-1 rounded">testAPI.all()</code> pour tous les tests</p>
                <p>3. Ou utilisez les tests individuels :</p>
                <ul className="ml-6 space-y-1">
                  <li><code className="bg-black/30 px-2 py-1 rounded">testAPI.champions()</code> - Test API Champions</li>
                  <li><code className="bg-black/30 px-2 py-1 rounded">testAPI.matchup()</code> - Test API Matchup</li>
                  <li><code className="bg-black/30 px-2 py-1 rounded">testAPI.variations()</code> - Différents champions</li>
                  <li><code className="bg-black/30 px-2 py-1 rounded">testAPI.errors()</code> - Gestion d'erreurs</li>
                  <li><code className="bg-black/30 px-2 py-1 rounded">testAPI.performance()</code> - Performance</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">🔗 Endpoints API</h2>
              <div className="text-green-100 space-y-2">
                <p><strong>GET</strong> <code className="bg-black/30 px-2 py-1 rounded">http://localhost:3000/api/champions</code></p>
                <p><strong>POST</strong> <code className="bg-black/30 px-2 py-1 rounded">http://localhost:3000/api/matchup</code></p>
                <div className="mt-3 p-3 bg-black/20 rounded">
                  <p className="text-sm text-gray-300">Body exemple :</p>
                  <code className="text-green-300">
                    {JSON.stringify({ champ1: "Yasuo", champ2: "Zed", patch: "14.1.1" }, null, 2)}
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">📊 État du serveur</h2>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white">Serveur en cours d'exécution sur http://localhost:3000</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.testAPI?.all()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transform transition-all duration-200 hover:scale-105 shadow-lg"
            >
              🚀 Lancer tous les tests
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}