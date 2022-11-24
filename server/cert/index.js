const fs = require('fs')

const httpsKey = fs.readFileSync('/etc/letsencrypt/live/roundist.whitie.ru/privkey.pem')
const httpsCert = fs.readFileSync('/etc/letsencrypt/live/roundist.whitie.ru/cert.pem')
const httpsCA = fs.readFileSync('/etc/letsencrypt/live/roundist.whitie.ru/chain.pem')

const httpsOptions = {
  key: httpsKey,
  cert: httpsCert,
  ca: httpsCA
}

exports.httpsOptions = httpsOptions