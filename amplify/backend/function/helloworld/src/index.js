/* Amplify Params - DO NOT EDIT
	API_API_GRAPHQLAPIENDPOINTOUTPUT
	API_API_GRAPHQLAPIIDOUTPUT
	AUTH_WEBSITE6BA563A3_USERPOOLID
	STORAGE_DATA_BUCKETNAME
Amplify Params - DO NOT EDIT */

exports.handler = async (evt, ctx) => {
  await (() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  })()

  return {
    body: JSON.stringify(ctx),
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      // PUT MORE HEADERS HERE
    },
    statusCode: 200,
  }

  // return `evt: ${JSON.stringify(evt)}`
  // return `env: ${JSON.stringify(process.env)}`
  // return `ctx: ${JSON.stringify(ctx)}`
}
