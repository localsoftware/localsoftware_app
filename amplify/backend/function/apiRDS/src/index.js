const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')

const server = awsServerlessExpress.createServer(app)

exports.handler = (evt, ctx) => {
  console.log(`EVENT: ${JSON.stringify(evt)}`)
  return awsServerlessExpress.proxy(server, evt, ctx, 'PROMISE').promise
}
