const {db} = require("./database");

module.exports = function (req, res, next) {

    const sql = "SELECT * FROM users WHERE token = ?";
    db.query(sql, [req.headers.authorization], (err, data) => {
        if (err) {
            console.error("Erreur lors de la vérification du token:", err);
            return res.json("Erreur");
        }
        if (data.length > 0) {
            // Token is valid
            req.user = data[0];
            return next();
        } else {
            res.status(401);
            // Token is not valid
            return res.json("Token invalide");
        }
    });
};