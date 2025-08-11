export default function({ $axios, redirect }) {
  $axios.setHeader('Content-Type', 'application/json')

  // for dev
  $axios.onRequest(config => {
    console.log('$axios: making request to ' + config.url, { config })
  })
}
