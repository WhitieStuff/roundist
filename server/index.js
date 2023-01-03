const https = require('https')
const express = require('express')
const path = require('path')
const httpsOptions = require('./cert').httpsOptions
const { Client } = require('pg')

const port = 1337

const app = express()
const server = https.createServer(httpsOptions, app)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  next()
})

app.get('/', async (req, res) => {
  let username = req.query.username && req.query.username.length ? req.query.username.toLowerCase() : ''
  if (!username.length) return res.status(404).send('username not provided')


  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'whitie',
    password: 'password',
    database: 'roundist'
  })

  await client.connect()

  let { rows } = await client.query(
    'SELECT username, date(datetime) = date(now()) today FROM users_logins WHERE LOWER(username) = $1 ORDER BY id desc LIMIT 1',
    [username.toLowerCase()]
  )
  if (rows && rows[0] && rows[0].today) {
    await client.end()
    return res.send(`${rows[0].username} has already been recorded today`)
  }
  let { dbres } = await client.query(
    'INSERT INTO users_logins (username, datetime) VALUES ($1, NOW())',
    [username.toLowerCase()]
  )

  await client.end()

  res.send(`${username} has been recorded`)
})

server.listen(port, function () {
  console.log(`Roundist API is listening on ${port}`)
})
