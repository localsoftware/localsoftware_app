import Firebase from 'firebase'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBhv8-l8eq6yXNHJpgMOvBHVrjEDAMtvQ0',
  authDomain: 'local-code.firebaseapp.com',
  databaseURL: 'https://local-code.firebaseio.com',
  projectId: 'local-code',
  storageBucket: '',
  messagingSenderId: '92585995733',
  appId: '1:92585995733:web:44c559ad80503644',
}

const FirebaseApp = !Firebase.apps.length
  ? Firebase.initializeApp(firebaseConfig)
  : Firebase

export const db = FirebaseApp.database()
export const auth = FirebaseApp.auth()
