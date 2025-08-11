/* Amplify Params - DO NOT EDIT
	AUTH_WEBSITE6BA563A3_USERPOOLID
	ENV
	REGION
	STORAGE_DATA_BUCKETNAME
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

exports.handler = async evt => {
  console.log('Received event:', JSON.stringify(evt, null, 2))
  console.log(process.env)

  const args = evt.arguments
  const { type, userId, identityId, data } = args

  if (!type || !userId || !identityId || !data)
    throw new Error('missing required input')

  const input = {
    type,
    userId,
    identityId,
    data,
  }
  console.log('input', input)

  const params = {
    stateMachineArn:
      'arn:aws:states:us-east-1:122695763785:stateMachine:ECSTaskNotificationStateMachine-YFcobOE3AgR7',
    input: JSON.stringify(input),
  }

  const stepfunctions = new AWS.StepFunctions()
  await stepfunctions
    .startExecution(params)
    .promise()
    .then(res => {
      console.log('started execution of step function')
      console.log('executionArn:\n', res.executionArn)
    })
    .catch(err => {
      console.log('err while executing step function', err)
    })

  return true
}
