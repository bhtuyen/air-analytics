var express = require('express');
var router = express.Router();
const pool = require('../../connection');
const { calcConcentration } = require('../helpers/index');
const _ = require('lodash');

// get {limit} latest metrics by deviceId

router.get('/devices/:id', async (req, res) => {
    const deviceId = req.params.id;
    const limit = req.query.limit || 10;
    const sql = `SELECT * FROM metrics WHERE device_id = ${deviceId} ORDER BY time DESC limit ${10}`;
    const metrics = await pool.query(sql);
    res.send(limit == 1 ? metrics.rows[0] : metrics.rows.reverse());
});

router.get('/devices/:id/concentration', async (req, res) => {
    const deviceId = req.params.id;
    const limit = 12;
    const sql = `SELECT * FROM metrics WHERE device_id = ${deviceId} ORDER BY time limit ${limit}`;
    const metrics = await pool.query(sql);
    const data = metrics.rows.map((r) => r.metadata);
    const CO = calcConcentration(
        'CO',
        data.map((c) => c.CO)
    );
    const SO2 = calcConcentration(
        'SO2',
        data.map((c) => c.SO2)
    );
    const NO2 = calcConcentration(
        'NO2',
        data.map((c) => c.NO2)
    );
    const PM10 = calcConcentration(
        'PM10',
        data.map((c) => c.PM10)
    );
    const PM25 = calcConcentration(
        'PM25',
        data.map((c) => c['PM2.5'])
    );
    res.send(_.max([CO, SO2, NO2, PM10, PM25]).toString());
});

module.exports = router;
