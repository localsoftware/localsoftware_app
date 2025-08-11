// TODO: remove server/index

const express = require('express')
const session = require('cookie-session')
const consola = require('consola')
const redirectSSL = require('redirect-ssl')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  app.use(
    session({
      name: 'session',
      secret: '4564f6s4fdsfdfd',
    })
  )

  app.use(redirectSSL)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}
start()
