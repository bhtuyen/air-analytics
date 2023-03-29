// require('./broker');
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const jwt = require("jsonwebtoken");
const JWT_SECRET = "air-analytics";
const pool = require("./connection");
require('./broker');

const authRouter = require("./src/routes/auth");
const deviceRouter = require("./src/routes/device");
const metricRouter = require("./src/routes/metric");

const userMiddleware = async (req, res, next) => {
  try {
    if (req.path.includes("auth") && (req.path.includes('login') | req.path.includes('register'))) return next();
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return next(new Error("Invalid token"));
    const token = authorizationHeader.split(" ")[1];
    const result = jwt.verify(token, JWT_SECRET);
    const users = await pool.query(`SELECT * FROM users WHERE id=${result.id}`);
    if (users.rows[0]) {
      req.user = users.rows[0];
      return next();
    } else {
      return next(new Error("User not found"));
    }
  } catch (err) {
    return next(err);
  }
};

var cors = require("cors");

var app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.all("*", userMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/metrics", metricRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

app.listen("3000", () => {
  console.log(`Example app listening on port 3000`);
});
