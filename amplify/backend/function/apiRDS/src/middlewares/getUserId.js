const AWS = require('aws-sdk')

const cognito = new AWS.CognitoIdentityServiceProvider()

/* eslint-disable import/no-absolute-path */
const Models = require('/opt/nodejs/models')

module.exports = async (req, res, next) => {
  let email = null

  // console.log('middlewares/getUserId evt', req.apiGateway.event)

  const evt = req.apiGateway.event

  try {
    const identityUsernameMatch = evt.requestContext.identity.cognitoAuthenticationProvider.match(
      /CognitoSignIn:([\S]+)$/
    )
    const identityUsername = identityUsernameMatch && identityUsernameMatch[1]

    console.time('cognito')
    const user = await cognito
      .adminGetUser({
        UserPoolId: process.env.AUTH_WEBSITE6BA563A3_USERPOOLID,
        Username: identityUsername,
      })
      .promise()
    console.timeEnd('cognito')

    console.log('user', { user })
    console.log('user.UserAttribute', user.UserAttributes)

    const attrs = user.UserAttributes

    const attrEmail = attrs.filter(attr => {
      const { Name } = attr
      return Name === 'email'
    })[0]

    if (attrEmail) email = attrEmail.Value
  } catch (err) {
    console.error('user', err)
  }

  console.log('user email: ', email)
  if (!email) next()

  console.time('User.findOne')

  const userId = await Models.User.findOne({
    where: { email: email },
  }).then(user => {
    console.log('find user', user)

    if (user) {
      // check if user email is verified
      console.log('user is registered', user)

      return user.id
    }

    return null
  })

  console.timeEnd('User.findOne')

  req.userId = userId

  next()
}
