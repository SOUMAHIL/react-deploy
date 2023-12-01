const express = require("express");
require('dotenv').config()
const cors = require("cors");
const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
const restrictMiddleware = require("./restrict");
const {db} = require("./database");

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

const saltRounds = 10

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


app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? "; // Corrected SQL query
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error("Erreur lors de la requête de connexion:", err);
            return res.json("Erreur");
        }
        if (data.length > 0) {
            // Compare the password with the hash
            bcrypt.compare(req.body.password, data[0].password, (err, result) => {
                if (err) {
                    console.error("Erreur lors de la comparaison des mots de passe:", err);
                    return res.json({
                        status: 'error',
                        error: "Erreur: " + err.message
                    });
                }
                if (result) {
                    // Generate a random token and store it in the database
                    const email = data[0].email;
                    const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

                    const sql = "UPDATE users SET token = ? WHERE email = ?";
                    db.query(sql, [token, email], (err, data) => {
                        if (err) {
                            console.error("Erreur lors de la mise à jour du token:", err);
                            return res.json("Erreur" + err.message);
                        }
                    });

                    return res.status(200)
                        .json({
                            status: 'success',
                            user: {
                                id: data[0].id,
                                name: data[0].name,
                                email: data[0].email
                            },
                            token: token
                        });

                } else {
                    return res.json("Email ou mot de passe incorrect");
                }
            });
        } else {
            return res.json("Email ou mot de passe incorrect");
        }
    });
});



// Protected routes
app.use(restrictMiddleware);
app.post('/signup', (req, res) => {

    // check if email already exists
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            console.error("Erreur lors de la recherche de l'email:", err);
            return res.json("Erreur");
        }
        if (data.length > 0) {
            return res.json("Email déjà utilisé");
        }
    });

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            console.error("Erreur lors du hashage du mot de passe:", err);
            return res.json("Erreur");
        }
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        const values = [
            req.body.name,
            req.body.email,
            hash
        ];
        db.query(sql, values, (err, data) => {
            if (err) {
                console.error("Erreur lors de l'insertion des données:", err);
                return res.json("Erreur");
            }
            return res.json("Données insérées avec succès");
        });
    });
});


// post,get,push,delete//
app.get("/patients", (req, res) => {
    const q = "SELECT * from patients WHERE user_id = ? ORDER BY id DESC";
    db.query(q, [req.user.id], (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
app.post("/patients", (req, res) => {
    const n_national = req.body.n_national;
    const ts = req.body.ts;
    const sexe = req.body.sexe;
    const age = req.body.age;
    const date_pre = req.body.date_pre;
    const date_ret_result = req.body.date_ret_result;
    const val_cv = req.body.val_cv;

    db.query(
        "INSERT INTO patients (user_id, n_national, ts, sexe, age, date_pre, date_ret_result, val_cv) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
        [req.user.id, n_national, ts, sexe, age, date_pre, date_ret_result, val_cv],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("you have registered successfully");
            }
        })
});
app.get("/patients/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * from patients where id = ? AND user_id = ?", [id, req.user.id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    });
});
app.put("/patients/:id", (req, res) => {
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

    db.query(q, [...values, patientId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.delete("/patients/:id", (req, res) => {
    const patientId = req.params.id;
    const q = "DELETE FROM patients WHERE id = ? ";

    db.query(q, [patientId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


// .....


app.listen(8081, () => {
    console.log("Le serveur écoute sur le port 8081");
});
