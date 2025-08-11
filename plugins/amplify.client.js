import Amplify, { Hub } from 'aws-amplify'
import '@aws-amplify/ui-vue'
import awsExports from '@/aws-exports'

Amplify.configure(awsExports)

export default (context, inject) => {
  const { store } = context

  Hub.listen('auth', data => {
    switch (data.payload.event) {
      case 'signIn':
        console.log('amplify/auth user signed in')
        store.dispatch('auth/check')
        break
      case 'signUp':
        console.log('amplify/auth user signed up')
        store.dispatch('auth/check')

        break
      case 'signOut':
        console.log('amplify/auth user signed out')
        store.dispatch('auth/check')

        break
      case 'signIn_failure':
        console.log('amplify/auth user sign in failed')
        store.dispatch('auth/check')

        break
      case 'configured':
        console.log('amplify/auth the Auth module is configured')
        store.dispatch('auth/check')
    }
  })
}
