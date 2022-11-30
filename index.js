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
const bookingsCollection = client.db('readers-port').collection('bookings');
const addedProductsCollection = client.db('readers-port').collection('addedProducts');
const advertisedItems = client.db('readers-port').collection('advertisedItems')

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

app.post('/addedProduct', async (req, res) => {
    const product = req.body;
    const result = await addedProductsCollection.insertOne(product);
    res.send(result);
})

app.get('/myProducts', async (req, res) => {
    const email = req.query.email;
    const query = {email : email};
    const result = await addedProductsCollection.find(query).toArray();
    res.send(result);
})

app.post('/advertise', async (req, res)=> {
    const product = req.body;
    const result = await advertisedItems.insertOne(product);
    res.send(result);
})

app.get('/advertisedItems', async (req, res)=> {
    const query = {};
    const result = await advertisedItems.find(query).toArray();
    res.send(result);
})

app.delete('/advertisedItems/:id', async(req, res)=> {
    const id = req.params.id;
    const query = {_id : id};
    const result  = await advertisedItems.deleteOne(query);
    res.send(result);
})

app.patch('/updateProduct/:id', async (req, res)=> {
    const id = req.params.id;
    const filter = {_id: ObjectId(id)};
    const updateDoc = {
        $set : {
            status : "sold"
        }
    };
    const result = await addedProductsCollection.updateOne(filter,updateDoc);
    res.send(result);
})


app.delete('/addedProducts/:id', async(req, res)=> {
    const id = req.params.id;
    const query = {_id : ObjectId(id)};
    const result  = await addedProductsCollection.deleteOne(query);
    res.send(result);
})

// admin routes
app.get('/allBuyers', async (req, res) => {
    const filter = {type : "User"};
    const buyers = await usersCollection.find(filter).toArray();
    res.send(buyers)
})

app.get('/allSellers', async (req, res) => {
    const filter = {type : "Seller"};
    const sellers = await usersCollection.find(filter).toArray();
    res.send(sellers)
})

app.delete('/allBuyers/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {_id : ObjectId(id)};
    const result = await usersCollection.deleteOne(filter);
    res.send(result)
})
app.delete('/allSellers/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {_id : ObjectId(id)};
    const result = await usersCollection.deleteOne(filter);
    res.send(result)
})

app.get('/', (req, res) => {
    res.send('server running')
})

app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})