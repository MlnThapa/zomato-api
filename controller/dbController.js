import { MongoClient } from "mongodb";
let url = "mongodb+srv://mlnthapa:32MV0x1xyzCrwz7m@mernapp.a4figwv.mongodb.net/?retryWrites=true&w=majority"

let client = new MongoClient(url)

let db = client.db('Zomato')

async function getData(colName, query){
    let output = [];
    try{
        const cursor = db.collection(colName).find(query);
        for await(const data of cursor){
            output.push(data);
        }
        cursor.closed
    }catch(err){
        output.push({"Error":"Error in getData"})
    }
    return output
}

async function postData(colName,data){
    let output;
    try{
        output = await db.collection(colName).insertOne(data)
    }catch(error){
        output = {"response":"error in postData"}
    }
    return output
}

async function updateOrder(colName,condition,data){
    let output;
    try{
        output = await db.collection(colName).updateOne(condition,data)
    }catch(err){
        output={"response":"error in update data"}
    }
    return output
}

async function deleteOrder(colName, condition){
    let output;
    try{
        output = await db.collection(colName).deleteOne(condition);
    }catch(err){
        output = {'response': 'Error in delete data'}
    }
    return output;
}

export{
    getData,
    postData,
    updateOrder,
    deleteOrder
}