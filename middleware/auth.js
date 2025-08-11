export default function({ store, redirect }) {
  return store.dispatch('auth/check').then(member => {
    console.log('middleware auth', member)
    // if (!member) return redirect('/signin')
  })
}
