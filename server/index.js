const https = require("https")
const express = require("express")
const path = require("path")
const httpsOptions = require("./cert").httpsOptions
const { Pool } = require('pg')

const port = 1337

const pool  = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'whitie',
  password: 'password',
  database: 'roundist'
})

const app = express()
const server = https.createServer(httpsOptions, app)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
next()
})

app.get("/", async (req, res) => {
let username = req.query.username
if (!username) return res.status(404)

let { rows } = await pool.query('SELECT username FROM users_logins WHERE LOWER(username) = $1', [username.toLowerCase()])
    console.log(rows)
if (rows && rows[0]) return res.send(rows[0].username)
let {dbres} = await pool.query('INSERT INTO users_logins (username, datetime) VALUES ($1, NOW())',
    [username.toLowerCase()])

res.send(username)
})

server.listen(port, function () {
console.log(`Roundist API is listening on ${port}`)
})