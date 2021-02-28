import { NowRequest, NowResponse } from '@vercel/node' // yarn add @vercel/node
import { MongoClient, Db } from 'mongodb'
import { useRouter } from 'next/router'

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

  const db = await connectToDatabase(process.env.MONGODB_URI)
  
  const collection = db.collection('usersGithub')

  const{ level, currentExperience, challengesCompleted} = request.body

  const router = useRouter()
  const github = router.query.github

  collection.findOne({"github": github}, (error, data) => {
  if(data.currentExperience != currentExperience) {
    collection.updateOne({"github": github}, {$set: {"level": level, "currentExperience": currentExperience, "challengesCompleted": challengesCompleted}})
  }
    response.json(data)
  })
  return response.status(201).json({ok: true})

}