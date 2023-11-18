const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
// Signup and login
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "signup"
});

db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données:", err);
        return;
    }
    console.log("Connexion à la base de données réussie");
});

app.get('/', (req, res) => {
    res.send("Bonjour, ceci est un petit message sur l'endpoint /");
});

app.post('/signup', (req, res) => {
    console.log(req.body);
    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)"; // Corrected SQL query
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
    db.query(sql, values, (err, data) => { // Removed array brackets around 'values'
        if (err) {
            console.error("Erreur lors de l'insertion des données:", err);
            return res.json("Erreur");
        }
        return res.json("Données insérées avec succès");
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?"; // Corrected SQL query
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error("Erreur lors de la requête de connexion:", err);
            return res.json("Erreur");
        }
        if (data.length > 0) {
            return res.json("Succès");
        } else {
            return res.json("Échec");
        }
    });
});


// post,get,push,delete//


app.get("/patient",(req, res) =>{
    const q= "SELECT * from patient ORDER BY id DESC " ;
    db.query(q, (err, data) => {
        if(err){
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
app.post("/patient", (req, res) => {
    const n_national = req.body.n_national;
    const ts = req.body.ts;
    const sexe = req.body.sexe;
    const age = req.body.age;
    const date_pre = req.body.date_pre;
    const date_ret_result = req.body.date_ret_result;
    const val_cv = req.body.val_cv;

    db.query(
        "INSERT INTO patient (n_national, ts, sexe, age, date_pre, date_ret_result, val_cv) VALUES(?, ?, ?, ?, ?, ?, ?)",
        [n_national, ts, sexe, age, date_pre, date_ret_result, val_cv],
        (err, result) => {
            if(err){
                console.log(err);
            }else{
                res.send("you have registered successfully");
            }
        })
});
app.get("/patientdetails/:id",(req, res)=>{
       const id = req.params.id;
       db.query("SELECT * from patient where id = ?", id, (err, result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result);
        }
       });
});
app.put("/patient/:id", (req, res) => {
    const patientId = req.params.id;
    const q = "UPDATE patient SET 'n_national'= ?, 'ts' = ?, 'sexe'=?, 'age'=?, 'date_pre'=?, 'date_ret_result'=?, 'val_cv'=?"; 

    const values =[
    req.body.n_national,
    req.body.ts,
    req.body.sexe,
    req.body.age,
    req.body.date_pre,
    req.body.date_ret_result,
    req.body.val_cv

    ];

    db.query(q, [...values,patientId], (err, data) => {
      if(err) return res.send(err);
      return res.json(data);
    });
});

app.delete("/patient/:id", (req, res) => {
    const patientId = req.params.id;
    const q = "DELETE FROM patient WHERE id = ? ";

    db.query(q, [patientId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
      });
});





// .....



app.listen(8081, () => {
    console.log("Le serveur écoute sur le port 8081");
});
