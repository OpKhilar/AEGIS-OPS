import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

function aiChatPlugin() {
  return {
    name: 'ai-chat-plugin',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { messages, apiKey: clientApiKey, system } = JSON.parse(body || '{}');
            const apiKey = clientApiKey || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'NO_API_KEY', message: 'No Google Gemini API key provided.' }));
              return;
            }

            const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
            const { streamText } = await import('ai');

            const google = createGoogleGenerativeAI({ apiKey });
            
            const formatted = (messages || []).map(m => ({
              role: m.role,
              content: m.content
            }));

            const result = streamText({
              model: google('gemini-1.5-flash'),
              system: system || 'You are an emergency first-aid triage assistant.',
              messages: formatted,
            });

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');

            for await (const chunk of result.textStream) {
              res.write(chunk);
            }
            res.end();
          } catch (err) {
            console.error('Error in /api/chat middleware:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'AI_STREAM_ERROR', message: err.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    aiChatPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'assets/leaflet/*'],
      manifest: {
        name: 'Emergency Response App',
        short_name: 'SOS',
        description: 'First-aid, shelters, and SOS reports',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-z]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
