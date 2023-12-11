const express = require("express");
require('dotenv').config()
const cors = require("cors");
var jwt = require('jsonwebtoken');
const restrictMiddleware = require("./restrict");
const {pool} = require("./database");
const util = require("util");
var bcrypt = require('bcryptjs');


const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    // origin: 'https://mon-app-reactjs.com',
    credentials: true
}));

app.use(express.json());

const saltRounds = 10


app.post('/login', async (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? "; // Corrected SQL query
    await pool.promise().query(sql, [req.body.email, req.body.password]).then(([data]) => {
        bcrypt.compare(req.body.password, data[0].password).then(async (result) => {
            console.log("erf")

            // Generate a random token and store it in the database
            const email = data[0].email;
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

            const sql = "UPDATE users SET token = ? WHERE email = ?";
            await pool.promise().query(sql, [token, email]).then(() => {
                return res.json({
                    status: 'success',
                    user: {
                        id: data[0].id,
                        name: data[0].name,
                        email: data[0].email
                    },
                    token: token,
                });
            }).catch((err) => {
                console.error("Erreur lors de la mise à jour du token:", err);
                return res.json({
                    status: 'error',
                    error: "Erreur: " + err.message
                });
            });
        }).catch((err) => {
            console.error("Erreur lors de la comparaison des mots de passe:", err);
            return res.json({
                status: 'error',
                error: "Erreur: " + err.message
            });
        });
    }).catch((err) => {
        console.log(err);
    })
});

app.post('/signup', async (req, res) => {
    // check if email already exists
    const sql = "SELECT * FROM users WHERE email = ?";
    await pool.promise().query(sql, [req.body.email]).then(([data]) => {
        if (data.length > 0) {
            res.status(400);
            return res.json("Email déjà utilisé");
        }
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
            const values = [
                req.body.name,
                req.body.email,
                hash
            ];
            await pool.promise().query(sql, values).then(() => {
                return res.json("Inscription réussie")
            })
        });
    }).catch((err) => {
        console.error("Erreur lors de la vérification de l'email:", err);
        return res.json("Erreur: " + err.message);
    });
});


// Protected routes
app.use(restrictMiddleware);


// post,get,push,delete//
app.get("/patients", async (req, res) => {
    const q = "SELECT * from patients WHERE user_id = ? ORDER BY id DESC";
    await pool.promise().query(q, [req.user.id]).then(([data]) => res.json(data)).catch((err) => {
        console.log(err);
        return res.json(err);
    })
})
app.post("/patients", async (req, res) => {
    const n_national = req.body.n_national;
    const ts = req.body.ts;
    const sexe = req.body.sexe;
    const age = req.body.age;
    const date_pre = req.body.date_pre;
    const date_ret_result = req.body.date_ret_result;
    const val_cv = req.body.val_cv;
    const q = "INSERT INTO patients (user_id, n_national, ts, sexe, age, date_pre, date_ret_result, val_cv) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
    await pool.promise().query(q, [req.user.id, n_national, ts, sexe, age, date_pre, date_ret_result, val_cv]).then(([data]) => {
        res.send("you have registered successfully");
    }).catch((err) => res.json(err))
});
app.get("/patients/:id", async (req, res) => {
    const id = req.params.id;
    await pool.promise().query("SELECT * from patients where id = ? AND user_id = ?", [id, req.user.id])
        .then(([data]) => res.json(data))
        .catch((err) => res.json(err))
});
app.put("/patients/:id", async (req, res) => {
    const patientId = req.params.id;
    const q = "UPDATE patients SET n_national= ?, ts = ?, sexe=?, age=?, date_pre=?, date_ret_result=?, val_cv=? WHERE id = ?";

    const values = [
        req.body.n_national,
        req.body.ts,
        req.body.sexe,
        req.body.age,
        req.body.date_pre,
        req.body.date_ret_result,
        req.body.val_cv,
        patientId
    ];

    await pool.promise().query(q, [...values, patientId]).then(([data]) => res.json(data)).catch((err) => res.json(err))
});

app.delete("/patients/:id", async (req, res) => {
    const patientId = req.params.id;
    const q = "DELETE FROM patients WHERE id = ? ";

    await pool.promise().query(q, [patientId]).then(([data]) => res.json(data)).catch((err) => res.json(err))
});


// .....


app.listen(8080);
