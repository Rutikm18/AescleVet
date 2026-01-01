export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">You're Offline</h1>
        <p className="text-gray-600 mb-4">
          Don't worry! This app works completely offline.
        </p>
        <p className="text-sm text-gray-500">
          All your medicine data is stored on your device and will be available when you're back online.
        </p>
      </div>
    </div>
  )
}

