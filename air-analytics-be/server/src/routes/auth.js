var express = require("express");
var router = express.Router();
const pool = require("../../connection");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "air-analytics";
const { updateById } = require("../helpers");

// register

router.post("/register", async (req, res) => {
  var sql = "INSERT INTO users (name, username, password, alert_status, min_aqi, time) VALUES ($1, $2, $3, $4, $5, $6)";
  const { name, username, password } = req.body;
  const alert_status = 0, min_aqi = 0, time = 0;
  const value = [name, username, password, alert_status, min_aqi, time];
  pool.query(sql, value, function (err) {
    if (err) throw err;
    res.send("Add successfully");
  });
});

router.get('/profiles', async (req, res) => {
  const userid = req.user.id;
  var sql = "SELECT * FROM users WHERE id = $1";
  const value = [userid];
  pool.query(sql, value, function (err, user) {
    if (err) throw err;
    res.send(user.rows[0]);
  })
})

router.put('/profiles', async (req, res) => {
  const userId = req.user.id;
  await updateById('users', userId, req.body);
  var sql = `SELECT * FROM users WHERE id = ${userId}`;
  const result = await pool.query(sql);
  res.send(result.rows[0]);
})

// login

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  var sql = `SELECT * FROM users WHERE username = $1`;
  const value = [username];
  pool.query(sql, value, function (err, user) {
    if (err) throw err;
    if (!user.rows[0]) {
      res.send({ err: "user does not exist" });
      return;
    }
    if (user.rows[0].password === password) {
      var token = jwt.sign(
        {
          id: user.rows[0].id,
        },
        JWT_SECRET
      );
      res.send({ messge: "oke", token: token });
    } else res.send({ err: "password is incorrect" });
  });
});

// logout

router.get("/logout", async (req, res) => {
  const id = req.user.id;
  if (id) res.send("Logout successfully");
});

module.exports = router;
