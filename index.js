const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tftgw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect()
        const billingCollection = client.db('power-hack').collection('billings')
        const userCollection = client.db('power-hack').collection('users')


        app.get('/billing-list', async (req, res) => {
            const query = {}
            const billings = await billingCollection.find(query).toArray()
            res.send(billings)
        })


        app.post('/registration', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.get('/login', async (req, res) => {
            const query = {}
            const users = await userCollection.find(query).toArray()
            res.send(users)
        })
    }
    finally {

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Hello Power Hack')
})

app.listen(port, () => {
    console.log(`Power Hack listening on port ${port}`)
})