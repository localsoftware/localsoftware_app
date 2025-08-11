/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DATA_BUCKETNAME
Amplify Params - DO NOT EDIT */

const mThumbnail = require('./modules/thumbnail')

exports.handler = async evt => {
  console.log('Received event:', JSON.stringify(evt, null, 2))

  const args = evt.arguments

  const { type } = args
  const payload = JSON.parse(args.payload)

  let data = null
  switch (type) {
    case 'thumbnail':
      data = await mThumbnail(payload)
      break

    default:
      data = { msg: `type:${type}  is not found` }
      console.log(type)
  }

  if (data) return JSON.stringify(data)
  return null
}
