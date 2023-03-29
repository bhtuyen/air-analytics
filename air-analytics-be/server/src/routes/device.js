var express = require("express");
const client = require("../../broker");
var router = express.Router();
const pool = require("../../connection");
const { updateById } = require("../helpers");
const topic_state = 'device/state'

// get all devices

router.get("", async (req, res) => {
  const userId = req.user.id;
  var sql = `SELECT * FROM devices WHERE user_id = ${userId}`;
  const devices = await pool.query(sql);
  res.send(devices.rows);
});

// get device by id

router.get("/:id", async (req, res) => {
  const deviceId = req.params.id;
  const userId = req.user.id;
  var sql = `SELECT * FROM devices WHERE user_id = ${userId} AND id = ${deviceId}`;
  const devices = await pool.query(sql);
  res.send(devices.rows[0]);
});

// create new device

router.post("", async (req, res) => {
  const userId = req.user.id;
  const { name, state, position } = req.body;
  var sql = `INSERT INTO devices ( name , state, user_id, position) VALUES ($1, $2, $3, $4) returning id, name, state, user_id, position`;
  const value = [name, state || 0, userId, position || 0];
  const device = await pool.query(sql, value);
  res.send(device.rows[0]);
});

// update device

router.put("/:id", async (req, res) => {
  const deviceId = req.params.id;
  await updateById("devices", deviceId, req.body);
  var sql = `SELECT * FROM devices WHERE id = ${deviceId}`;
  const result = await pool.query(sql);
  client.publish(topic_state, JSON.stringify(result.rows[0]), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.log(error);
    }
  })
  res.send(result.rows[0]);
});

// delete device

router.delete("/:id", async (req, res) => {
  const deviceId = req.params.id;
  const sql = `DELETE FROM devices where id = ${deviceId}`;
  await pool.query(sql);
  res.send("Delete successfully");
});

module.exports = router;
