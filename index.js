'use strict'

const http = require('http')

const createApi = require('./api')

const startServer = (db, port, cb) => {
	const api = createApi(db)

	const server = http.createServer(api)
	server.listen(port, cb)
	return server
}

module.exports = startServer
