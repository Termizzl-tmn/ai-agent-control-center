// One-time local receiver to capture your LINE userId/groupId for
// Settings → LINE Target. Not part of the Electron app — run manually,
// then discard the tunnel once you have the ID.
//
// Usage:
//   1. node scripts/line-webhook-capture.js
//   2. In another terminal: npx localtunnel --port 4040
//   3. Copy the printed https URL, append /webhook, paste it as the
//      Webhook URL in the LINE Developers Console (Messaging API tab),
//      then toggle "Use webhook" on and click Verify.
//   4. Add your bot as a friend (QR code on the same console tab) and
//      send it any message.
//   5. Your userId prints below — paste it into AgentFlow → Settings.

const http = require('http')

const PORT = 4040

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404)
    res.end()
    return
  }

  let body = ''
  req.on('data', (chunk) => { body += chunk })
  req.on('end', () => {
    res.writeHead(200)
    res.end()

    try {
      const payload = JSON.parse(body)
      for (const event of payload.events ?? []) {
        const id = event.source?.userId ?? event.source?.groupId
        const type = event.source?.type
        if (id) {
          console.log(`\n✅ Captured ${type} ID: ${id}`)
          console.log('   Paste this into AgentFlow → Settings → LINE Target\n')
        }
      }
    } catch (err) {
      console.error('Failed to parse webhook payload:', err)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Listening for LINE webhooks on http://localhost:${PORT}/webhook`)
  console.log('Expose this with: npx localtunnel --port ' + PORT)
  console.log('Then set <tunnel-url>/webhook as the webhook URL in the LINE Developers Console.')
  console.log('Message your bot from LINE — your userId will print here.\n')
})
