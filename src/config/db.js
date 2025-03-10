const mysql= require('mysql2')
require("dotenv").config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 20,
  });


connection.getConnection((err,con)=>{
 if(err){
    console.error("error",err)
 }else{
    console.log("connected to database");
    con.release();
 }
});
module.exports=connection;