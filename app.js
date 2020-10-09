const express = require('express');
const app = express()
const PORT = 3000;
const { Client } = require('pg')

app.use(express.json())
const client = new Client({
    //Heroku username
    user: 'postgres',
    //Enter heroku url
    host: 'localhost',
    //Database name
    database: 'Test',
    //YOUR PASSWORD HERE
    password: '123456',
    port: 5432,
});
//Query for creating tables
const query = `CREATE TABLE IF NOT EXISTS users (
    username varchar NOT NULL UNIQUE,
    password varchar NOT NULL);
    CREATE TABLE IF NOT EXISTS objects(
    id SERIAL,
    date varchar,
    time varchar,
    variant varchar,
    haspin varchar,
    map_details varchar
    );
    `;
//Connecting to DB
client.connect()
//Executing Create Table Query
client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Database Successfully started');
})

//Route to create New user
app.post('/register', (req,res)=>{
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    let query = `INSERT INTO USERS VALUES(
            '${username}',
            '${password}')`
    client.query(query,(err,result)=>{
        if (err) {
            console.error(err);
            //ERROR PAGE
            res.json({message:"Sorry there is some error"});
        }else {
            console.log('User added');
            //Add page after register here
            res.send("DONE")
        }
    })
})

//Route for user login
app.post('/login', (req,res,next)=>{
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    let query =
        `SELECT * FROM USERS
         WHERE username='${username}'`
    client.query(query,(err,result)=>{
        if (err) {
            console.error(err);
            //ERROR PAGE
            res.json({message:"Sorry there is some error"});
        }else {
            if(result.rows[0].password===password)
            {
                //Show Login Success
                res.send("USER LOGIN SUCCESS")
                return next();
            }else{
                //Show login failed
                res.json("USER LOGIN FAILED")
                return next();
            }
        }
    })
})
//To create a new Object
app.post('/insert', (req,res)=>{
    let date = req.body.date;
    let time = req.body.time;
    let variant = req.body.variant;
    let haspin = req.body.haspin;
    let map_details = req.body.map_details;
    let query = `INSERT INTO objects(date,time,variant,haspin,map_details) VALUES(
            '${date}',
            '${time}',
            '${variant}',
            '${haspin}',
            '${map_details}');`;
    client.query(query,(err,result)=>{
        if (err) {
            console.error(err);
            //ERROR PAGE
            res.json({message:"Sorry there is some error"});
        }else {
            console.log('Object inserted');
            //Send response for inserted Object
            res.json("Object Inserted")
        }
    })
})

//Display all objects
app.get('/all', (req,res,next)=>{
    let query =
        `SELECT * FROM OBJECTS;`
    client.query(query,(err,result)=>{
        if (err) {
            console.error(err);
            res.json({message:"Sorry there is some error"});
        }else {
            if (result.rows.length > 0) {
                res.json({message: "Success", objects: result.rows})
                return next();
            } else {
                res.send("NO DATA AVAILABLE");

            }
        }
    })
})

//Delete an object
app.delete('/delete/:id',(req,res)=>{

    let id =req.params.id;
    let query =
        `DELETE FROM OBJECTS
         WHERE id=${id}`
    client.query(query,(err,result)=>{
        if (err) {
            console.error(err);
            res.json({message:"Sorry there is some error"});
        }else {
            if(result.rowCount===1){
                console.log("ROW DELETED")
                res.json({success:1,message:"Row Deleted"})
            }else {
                console.log("ROW NOT FOUND")
                res.json({success:1,message:"Row Not found"})

            }
        }
    })
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
