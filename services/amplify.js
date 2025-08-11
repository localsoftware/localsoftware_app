import Amplify, { Storage, API, Auth } from 'aws-amplify'
import awsconfig from '@/aws-exports'
Amplify.configure(awsconfig)

Storage.configure({ level: 'private' })

export const storage = Storage
export const api = API
export const auth = Auth
