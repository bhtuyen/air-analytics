const mqtt = require('mqtt');
const pool = require('./connection');
const _ = require('lodash');
const { calcConcentration, updateById } = require('./src/helpers');

//setup mqtt
const host = '10.13.9.39';
const port = 1883;
const clientId = `77c4898a-7158-4936-ac62-1681096fd2fd`;
const connectUrl = `mqtt://${host}:${port}`;

//connect to broker
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});
const topic_data = 'air/data';
const topic_state = 'device/state';

client.on('connect', () => {
    console.log('Connected');
    client.subscribe([topic_data, topic_state], () => {
        console.log(`Subscribed`);
    });
});

client.on('message', async (topic, payload) => {
    switch (topic) {
        case topic_data: {
            const { device_id, metadata, time } = JSON.parse(
                payload.toString()
            );
            const limit = 12;
            let sql = `SELECT * FROM metrics WHERE device_id = ${device_id} ORDER BY time DESC limit ${
                limit - 1
            }`;
            const metrics = await pool.query(sql);
            let data = metrics.rows.map((r) => r.metadata);
            data.push(metadata);
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
            const aqi = _.floor(_.max([CO, SO2, NO2, PM10, PM25]));

            // const aqi = Math.floor(Math.random() * (200 - 60 + 1) + 60);
            sql = `INSERT INTO metrics ( aqi , metadata, device_id, time) VALUES ($1, $2, $3, $4) returning id, aqi, metadata, device_id, time`;
            const value = [aqi, metadata, device_id, time];
            const metric = await pool.query(sql, value);
            break;
        }
        case topic_state: {
            const device = JSON.parse(payload.toString());
            await updateById('devices', device.id, device);
            break;
        }
        default: {
            break;
        }
    }
});

module.exports = client;
