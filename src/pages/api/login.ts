import { NowRequest, NowResponse } from '@vercel/node' // yarn add @vercel/node
import { MongoClient, Db } from 'mongodb'

let cachedDb: Db = null

async function connectToDatabase(uri: string) {
  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const dbURL = new URL(uri)
  const dbName = dbURL.pathname.substr(1)
  const db = client.db(dbName)

  cachedDb = db

  return db
}

export default async (request: NowRequest, response: NowResponse) => {
  const { github } = request.body

  const db = await connectToDatabase(process.env.MONGODB_URI)
  
  const collection = db.collection('usersGithub')

  collection.findOne({"github": github}, (error, data) => {
    if(data) {
      console.log('ok')
    } else {
      collection.insertOne({
        github,
        level: 0,
        currentExperience: 0,
        challengesCompleted: 0,
      })
    }
  })

  return response.status(201).json({ok: true})
}