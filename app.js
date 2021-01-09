const express = require('express');
const app = express()
const PORT = 3000;
const { Client } = require('pg')

app.use(express.json())
const client = new Client({
    user: 'aefevhdj',
    host: 'arjuna.db.elephantsql.com',
    database: 'aefevhdj',
    password: 'NUP4h-qK2YixPptTgcbJpv6pfMxdCzS7',
    port: 5432,
});
//Query for creating tables
const query = `CREATE TABLE IF NOT EXISTS employee (
empid serial,
name varchar,
date_join date,
dob date,
department varchar,
address varchar,
PRIMARY KEY( empid )
);`;
//Connecting to DB
client.connect((err)=>{
    if(err){
        console.error(err)
        return;
    }else {
        console.log('Successfully connected')
    }
})
//Executing Create Table Query
client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('table created');

})
const query2 = `CREATE TABLE IF NOT EXISTS projects (
    projectid serial,
    empid int,
    description varchar,
    PRIMARY KEY(projectid),
    CONSTRAINT fk_employee
        FOREIGN KEY(empid) REFERENCES employee( empid )
    );`;
client.query(query2, (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Table created');
})

app.post('/insertEmp', (req,res)=>{
    let name = req.body.name;
    let date_join = req.body.date_join;
    let dob = req.body.dob;
    let department = req.body.department;
    let address = req.body.address;
    let query = `INSERT INTO employee(name,date_join,dob,department,address) VALUES(
            '${name}',
            '${date_join}',
            '${dob}',
            '${department}',
            '${address}') RETURNING empid;`;
    client.query(query,(err,result)=>{
        if (err) {
            console.error(err);
            //ERROR PAGE
            res.json({message:"Sorry there is some error"});
        }else {
            console.log('Object inserted');
            //Send response for inserted Object
            res.json({message:"Object Inserted",id:result.rows[0].empid});
        }
    })
})
app.post('/insertProj', (req,res)=>{
    let description = req.body.description;
    let empid = req.body.empid;
    let query = `INSERT INTO projects(description,empid) VALUES(
            '${description}',
            '${empid}') RETURNING projectid;`;
    client.query(query,(err,result)=>{
        if (err) {
            console.error(err);
            //ERROR PAGE
            res.json({message:"Sorry there is some error"});
        }else {
            console.log('Object inserted');
            //Send response for inserted Object
            res.json({message:"Object Inserted",id:result.rows[0].projectid});
        }
    })
})
app.get('/showEmp',(req,res,next)=>{
    let query =
        `SELECT * FROM employee;`
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
app.get('/showProj',(req,res,next)=>{
    let query =
        `SELECT * FROM projects;`
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
//Display all objects
app.get('/showProjWithEmp', (req,res,next)=>{
    let query =
        `SELECT * FROM projects INNER JOIN employee ON(projects.empid=employee.empid);`
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
