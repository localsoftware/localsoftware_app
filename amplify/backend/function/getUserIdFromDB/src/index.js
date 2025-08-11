/* Amplify Params - DO NOT EDIT
	AUTH_WEBSITE6BA563A3_USERPOOLID
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')

const cognito = new AWS.CognitoIdentityServiceProvider()

/* eslint-disable import/no-absolute-path */
const Models = require('/opt/nodejs/models')

exports.handler = async evt => {
  let email = null

  try {
    const user = await cognito
      .adminGetUser({
        UserPoolId: process.env.AUTH_WEBSITE6BA563A3_USERPOOLID,
        Username: evt.identity.username,
      })
      .promise()

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
  if (!email) return null

  return Models.User.findOne({
    where: { email: email },
  }).then(user => {
    console.log('find user', user)

    if (user) {
      // check if user email is verified
      console.log('user is registered', user)

      return user.id
    } else {
      console.log('create new user')

      const newUser = Models.User.build()
      newUser.email = email
      newUser.password = 'cognito'
      newUser.verified = true
      newUser.urlLink = `${evt.identity && evt.identity.username}`

      return newUser.save().then(user => {
        console.log('newUser', user)
        return user.id
      })
    }
  })
}
