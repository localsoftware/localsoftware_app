/* Amplify Params - DO NOT EDIT
	AUTH_WEBSITE6BA563A3_USERPOOLID
Amplify Params - DO NOT EDIT */

/* eslint-disable import/no-absolute-path */
const Models = require('/opt/nodejs/models')

exports.handler = async evt => {
  console.log('Received event:', JSON.stringify(evt, null, 2))

  const args = evt.arguments

  const { model, method } = args
  if (!model || !method) return false

  let { updates, query } = args
  query = JSON.parse(query)

  let data = null
  switch (method) {
    case 'findAll':
      data = await Models[model].findAll(query)
      break

    case 'update':
      updates = JSON.parse(updates)
      data = await Models[model].update(updates, query)
      break
  }

  if (data) return JSON.stringify(data)
  return null
}
