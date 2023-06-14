import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mongodb from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getData,postData,updateOrder,deleteOrder } from './controller/dbController.js';

const port = process.env.PORT || 4000
const app = express();
dotenv.config();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(port,()=> console.log(`Listening to Port ${port}`))
})
.catch((error)=>{
    console.log(error)
})


app.get('/',(req,res)=>{
    res.send("Hi from express")
})

app.get('/location',async(req,res)=>{
    let query = {}
    let collection = "location"
    let output = await getData(collection,query)
    res.send(output)
})

//get all mealtype
app.get('/mealType',async(req,res)=>{
    let query = {};
    let collection = "Mealtype";
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/resturants', async(req,res)=>{
    let query = {};
    if(req.query.stateId && req.query.mealId){
        query = {state_id:Number(req.query.stateId),"mealTypes.mealtype_id":Number(req.query.mealId)}
    }
})

//details
app.get('/details/:id',async (req,res)=>{
    let id = new mongodb.ObjectId(req.params.id)
    let query = {_id:id};
    let collection = "ResturantsData"
    let output = await getData(collection,query);
    res.send(output)
})


// orders

app.get('/orders',async(req,res)=>{
    let query={};
    if(req.query.email){
        query = {email:req.query.email}
    }else{
        query={}
    }
    let collections = "orders";
    let output = await getData(collections,query);
    res.send(output)
})

//placeOrder 
app.post('/placeOrder',async(req,res)=>{
    let data = req.body;
    let collection = "orders";
    console.log(">>>",data);
    let response = await postData(collection,data);
    res.send(response);
})

// menu details {"id":[4,8,21]}
app.post('/menuDetails',async(req,res)=>{
    if(Array.isArray(req.body.id)){
        let query = {menu_id:{$in:req.body.id}};
        let collection = 'ResturantMenu';
        let output = await getData(collection,query);
        res.send(output)
    }else{
        res.send('Please pass data in form of array')
    }
})


// update
app.put('/updateOrder',async (req,res)=>{
    let collection = 'orders';
    let condition = {"_id":new mongodb.ObjectId(req.body._id)};
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

// delete 

app.delete('/deleteOrder', async (req,res)=>{
    let collection = 'orders';
    let condition = {"_id":new mongodb.ObjectId(req.body._id)};
    let output = await deleteOrder(collection,condition);
    res.send(output)
})

