export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About This Template</h1>
        <p className="text-xl text-gray-600">
          A comprehensive starter template for modern web applications
        </p>
      </div>

      <div className="prose prose-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary-700 mb-3">Frontend Stack</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• React 18 with TypeScript</li>
              <li>• Vite for fast development</li>
              <li>• Tailwind CSS v4</li>
              <li>• React Router for navigation</li>
              <li>• Firebase SDK for auth & data</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary-700 mb-3">Backend Stack</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Firebase Functions v2</li>
              <li>• TypeScript for type safety</li>
              <li>• Europe West 2 deployment</li>
              <li>• Shared data models</li>
              <li>• Zod for validation</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Architecture</h2>
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <pre className="text-sm text-gray-800 overflow-x-auto">
{`template_w_firestore/
├── package.json          # Root workspace
├── shared/               # Shared types & models
│   ├── src/
│   │   ├── types/       # TypeScript interfaces
│   │   ├── schemas/     # Zod validation schemas
│   │   └── index.ts     # Shared utilities
├── src/                 # React + Vite app
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── config/          # Configuration files
│   └── main.tsx         # App entry point
└── functions/           # Firebase Functions
    └── src/
        └── index.ts     # Functions entry point`}
          </pre>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
        <div className="bg-primary-50 p-6 rounded-lg">
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Install dependencies: <code className="bg-gray-200 px-2 py-1 rounded">npm run install:all</code></li>
            <li>Configure Firebase in <code className="bg-gray-200 px-2 py-1 rounded">src/config/firebase.ts</code></li>
            <li>Start development: <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code></li>
            <li>Start Firebase emulators: <code className="bg-gray-200 px-2 py-1 rounded">npm run firebase:emulators</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}



