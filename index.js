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
        const registrationCollection = client.db('event-hub').collection('registration')
        const reviewCollection = client.db('event-hub').collection('review')



        // adding event data 
        app.post('/event', async (req, res) => {
            const data = req.body;
            // console.log(data)
            const result = await eventCollection.insertOne(data)
            res.send(result)
        })

        // marathons Data with ID 
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await eventCollection.findOne(query);
            res.send(result)
        })


        //  getting all events data with  limit 
        app.get('/events', async (req, res) => {
            const result = await eventCollection.find().limit(3).toArray()
            res.send(result)
        })


        //search funtionality for event
        app.get("/find", async (req, res) => {
            const search = req.query.search;
            const query = search
                ? { name: { $regex: search, $options: "i" } }
                : {};

            const result = await eventCollection.find(query).toArray();
            res.send(result);
        });



        //getting all data marathon 
        app.get('/event/list', async (req, res) => {
            const email = req.query.email;
            const sortOrder = req.query.sort === 'asc' ? 1 : -1;
            const query = {};
            if (email) {
                query.user_email = email;
            }
            const result = await eventCollection.find(query)
                .sort({ createdAt: sortOrder })
                .toArray();
            res.send(result);
        });

        // ----------------------
        app.post('/registration', async (req, res) => {
            const data = req.body;
            // console.log(data)
            const result = await registrationCollection.insertOne(data);
            res.send(data)
        })


        // get my registration on event 

        app.get('/my-registration', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }
            const result = await registrationCollection.find(query).toArray()
            res.send(result)
        })

        // delete registered data 
        app.delete('/registration/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query)
            const result = await registrationCollection.deleteOne(query)
            res.send(result)
        })


        //review collection 
        app.post('/review', async (req, res) => {
            const data = req.body;
            // console.log(data)
            const result = await reviewCollection.insertOne(data);
            res.send(data)
        })

        //  getting all review  data with  limit 
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })










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





