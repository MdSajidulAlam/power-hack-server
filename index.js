const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tftgw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect()
        const billingCollection = client.db('power-hack').collection('billings')
        const userCollection = client.db('power-hack').collection('users')

        app.post('/login', async (req, res) => {
            const user = req.body
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            })
            res.send({ accessToken })
        })


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
        app.post('/add-billing', async (req, res) => {
            const billing = req.body
            const result = await billingCollection.insertOne(billing)
            res.send(result)

        })

        app.patch('/update-bill/:id', async (req, res) => {
            const id = req.params.id
            const updatedBill = req.body
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    name: updatedBill.name,
                    email: updatedBill.email,
                    phone: updatedBill.phone,
                    paidAmount: updatedBill.paidAmount,
                }
            }
            const result = await billingCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.delete('/delete-bill/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await billingCollection.deleteOne(query)
            res.send(result)
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