// eSIR 2.0 Service Worker
const CACHE_NAME = 'esir-cache-v1.0.1';

// Install event
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
  console.log('🚀 eSIR 2.0 Service Worker installing...');
  // eslint-disable-next-line no-restricted-globals
  event.waitUntil(self.skipWaiting());
});

// Activate event
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (event) => {
  console.log('🔄 eSIR 2.0 Service Worker activating...');
  // eslint-disable-next-line no-restricted-globals
  event.waitUntil(self.clients.claim());
});

// Fetch event
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static files
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.warn('Service Worker: API request failed:', error);
    // Return proper Response object
    return new Response(JSON.stringify({
      success: false,
      message: 'Tidak dapat terhubung ke server. Silakan cek koneksi internet Anda.'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

// Handle static requests
async function handleStaticRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.warn('Service Worker: Static request failed:', error);
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page as fallback
    const offlineResponse = await caches.match('/');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Return a basic HTML response as last resort
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>eSIR 2.0 - Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1>eSIR 2.0</h1>
          <p>Anda sedang offline. Silakan cek koneksi internet Anda.</p>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

console.log('🚀 eSIR 2.0 Service Worker loaded!');
