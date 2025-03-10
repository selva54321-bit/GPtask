const express = require("express")
const cors =require("cors")
require("dotenv").config();
const db =require("./src/config/db")

const app = express()
const PORT = 8000;
 
app.use(cors());
app.use(express.json());
// app.get("/login",(req,res)=>{
//     const query="SELECT * FROM login";
//     db.query(query,(err,result)=>{
//         if(!err){
//             res.send(result)
//             console.log("done")
//         }
//         else{
//             res.send(err)
//             console.log("false")
//         }
//     })
// })

app.post("/user",(req,res)=>{
    const {email} =req.body;

    if (!email){
        return res.status(404).json({error:"Email is required"});
    }
    const query ="SELECT role FROM login WHERE email=? ";
    // console.log("Running query:", query);  // Log to confirm query

    db.query(query,[email],(err,result)=>{
        if(err){
            console.error("Error in role",err);
            return res.status(500).json({ error: "Database query failed" });

        }
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ role: result[0].role });

    });


    app.get("/followers", (req, res) => {
        const query = "SELECT month, count FROM followers ORDER BY month ASC";
        db.query(query, (err, result) => {
            if (!err) {
                res.json(result);
            } else {
                res.status(500).json({ error: "Database query failed" });
            }
        });
    });
    
    // Fetch Engagement Data
    app.get("/engagement", (req, res) => {
        const query = "SELECT likes, shares, comments FROM engagement";
        db.query(query, (err, result) => {
            if (!err) {
                res.json(result);
            } else {
                res.status(500).json({ error: "Database query failed" });
            }
        });
    });
    
    // Fetch Audience Demographics
    app.get("/audience", (req, res) => {
        const query = "SELECT age, percentage FROM audience";
        db.query(query, (err, result) => {
            if (!err) {
                res.json(result);
            } else {
                res.status(500).json({ error: "Database query failed" });
            }
        });
    });


    app.post("/content",(req,res)=>{
        const {id,name,caption}=req.body;
        const query="INSERT INTO content (id,name,content) VALUES(?,?,?)";
        db.query(query,[id,name,caption],(err)=>{
            if(err){
                console.log(err);
                return res.status(500).json({error:"Failed to add marks"});   
            }

            res.status(200).json({message:"inserted"});
        });
    })

    app.delete("/content-delete/:id",(req,res)=>{
        const {id}=req.params;
        const query="DELETE FROM content WHERE id=?";

        db.query(query,[id],(err)=>{
            if(err){
                console.error("Error:",err);
                return res.status(500).json({error:"Failed to fatch"});
            }
            res.status(200).json({message:"Data deleted"})
        });
    });

    app.put("/content-update/:id", (req, res) => {
        const { id } = req.params;
        console.log("Received ID:", id); // Debugging
      
        if (!id) {
          return res.status(400).json({ error: "Invalid ID" });
        }
      
        const { name, caption } = req.body;
        const query = "UPDATE content SET name=?, caption=? WHERE id=?";
      
        db.query(query, [name, caption, id], (err, result) => {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json({ error: "Failed to update data" });
          }
          res.status(200).json({ message: "Data updated successfully" });
        });
      });
      
    
    
    app.get("/caption", (req, res) => {
        const query = "SELECT * FROM content";
        db.query(query, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to fetch content" });
          }
          res.status(200).json(results);
        });
      });

      


});
app.listen(PORT,()=>{
    console.log(`server is runnning on ${PORT}`)
});