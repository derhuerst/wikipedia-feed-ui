'use strict'

const openDat = require('dat-node')
const http = require('http')

const createApi = require('./api')

const startServer = (db, port, cb) => {
	openDat(db, (err, dat) => {
		if (err) return cb(err)

		const api = createApi(dat)
		const server = http.createServer(api)
		server.listen(port, cb)
	})
}

module.exports = startServer
