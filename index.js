const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wbjzicb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const categoriesCollection = client.db('readers-port').collection('categories');
const usersCollection = client.db('readers-port').collection('users');
const bookingsCollection = client.db('readers-port').collection('bookings')

app.get('/categories', async (req, res) =>{
    const query = {}
    const categories = await categoriesCollection.find(query).toArray();
    res.send(categories);
})

app.get('/category/:id', async (req, res) =>{
    const id = req.params.id;
    const filter = {_id : ObjectId(id)};
    const products = await categoriesCollection.findOne(filter);
    res.send(products)
})

app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.send(result)
})

app.post('/bookings', async (req, res) => {
    const booking = req.body;
    const result = await bookingsCollection.insertOne(booking);
    res.send(result);
})

app.get('/users', async (req, res)=> {
    const email = req.query.email;
    const query = {email : email};
    const user = await usersCollection.findOne(query);
    res.send(user);
})

app.get('/', (req, res) => {
    res.send('server running')
})

app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})