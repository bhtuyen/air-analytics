const pool = require("../../connection");
const _ = require("lodash");
const { BP } = require("../constants/index");

const updateById = async (table, id, params) => {
  let query = `UPDATE ${table} SET `;
  const arr = Object.keys(params);
  const values = Object.values(params);
  arr.forEach((k, i) => {
    query += ` ${k} = $${i + 1}`;
    if (i != arr.length - 1) {
      query += ",";
    }
  });
  query += ` WHERE id = $${arr.length + 1}`;
  return pool.query(query, [...values, id]);
};

const calcConcentration = (type, c) => {
  const NC = calcNC(c);
  const arr = BP.map((b) => b[type]);
  let i1 = -1;
  for (let i = 0; i < arr.length; i++) {
    i1++;
    if (arr[i] > NC) {
      break;
    }
  }
  const Ii1 = BP[i1].I;
  const Ii = BP[i1 - 1].I;
  const BPi1 = BP[i1][type];
  const BPi = BP[i1 - 1][type];
  return ((Ii1 - Ii) / (BPi1 - BPi)) * (NC - BPi) + Ii;
};

const calcNC = (c) => {
  const cMin = _.min(c);
  const cMax = _.max(c);
  const W = calcW(cMin, cMax);
  let ts = 0;
  let ms = 0;
  for (let i = 1; i <= c.length; i++) {
    ts += Math.pow(W, i - 1) * c[i - 1];
    ms += Math.pow(W, i - 1);
  }
  return ts / ms;
};

const calcW = (cMin, cMax) => {
  const res = cMin / cMax;
  return res <= 0.5 ? 0.5 : res;
};

module.exports = {
  updateById,
  calcConcentration,
};
