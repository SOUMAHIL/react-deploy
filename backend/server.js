const express = require("express");
require('dotenv').config()
const cors = require("cors");
const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
const restrictMiddleware = require("./restrict");
const {db} = require("./database");
const util = require("util");

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

const saltRounds = 10

const dbQuery = util.promisify(db.query).bind(db);


app.get('/', async (req, res) => {
    res.send("Bonjour, ceci est un petit message sur l'endpoint /");
});


app.post('/login', async (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? "; // Corrected SQL query
    await dbQuery(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error("Erreur lors de la requête de connexion:", err);
            return res.status(500).json('Erreur lors de la connexion');
        }
        if (data.length > 0) {
            // Compare the password with the hash
            bcrypt.compare(req.body.password, data[0].password, async (err, result) => {
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
                    await dbQuery(sql, [token, email], (err) => {
                        if (err) {
                            console.error("Erreur lors de la mise à jour du token:", err);
                            return res.json("Erreur" + err.message);
                        }
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

app.post('/signup', async (req, res) => {
    // check if email already exists
    const sql = "SELECT * FROM users WHERE email = ?";
    await dbQuery(sql, [req.body.email], (err, data) => {
        if (err) {
            console.error("Erreur lors de la recherche de l'email:", err);
            return res.json("Erreur");
        }
        if (data.length > 0) {
            return res.status(409).json("Email déjà utilisé");
        }
        bcrypt.hash(req.body.password, saltRounds, async(err, hash) => {
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
            await dbQuery(sql, values, (err, data) => {
                if (err) {
                    console.error("Erreur lors de l'insertion des données:", err);
                    return res.json("Erreur");
                }
                return res.json("Données insérées avec succès");
            });
        });
    });
});


// Protected routes
app.use(restrictMiddleware);


// post,get,push,delete//
app.get("/patients", async (req, res) => {
    const q = "SELECT * from patients WHERE user_id = ? ORDER BY id DESC";
    await dbQuery(q, [req.user.id], (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
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

    await dbQuery(
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
app.get("/patients/:id", async (req, res) => {
    const id = req.params.id;
    await dbQuery("SELECT * from patients where id = ? AND user_id = ?", [id, req.user.id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    });
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

    await dbQuery(q, [...values, patientId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.delete("/patients/:id", async (req, res) => {
    const patientId = req.params.id;
    const q = "DELETE FROM patients WHERE id = ? ";

    await dbQuery(q, [patientId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


// .....


app.listen(8081, () => {
    console.log("Le serveur écoute sur le port 8081");
});
