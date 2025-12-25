const express = require('express')
const app = express()
const dotenv = require('dotenv');
const cors = require('cors')
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json())
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eztfylz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

''
async function run() {
    try {
        // await client.connect();
        const eventCollection = client.db('event-hub').collection('events')

        

        // adding marathons data 
        app.post('/event', async (req, res) => {
            const data = req.body;
            console.log(data)
            const result = await eventCollection.insertOne(data)
            res.send(result)
        })

        // marathons Data with ID 
        app.get('/details/:id',async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await eventCollection.findOne(query);
            res.send(result)
        })


        //  getting all marathons data with  limit 
        app.get('/events', async (req, res) => {
            const result = await eventCollection.find().limit(3).toArray()
            res.send(result)
        })
    //   comment 


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally { 
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Server is on')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})





