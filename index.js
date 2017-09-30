'use strict'

const express = require('express')
const http = require('http')
const hsts = require('hsts')
const compression = require('compression')
const path = require('path')
const serve = require('serve-static')
const openDat = require('dat-node')
const pathExists = require('path-exists')

const attachApi = require('./api')
const handleErrors = require('./lib/error')
const attachSetup = require('./lib/setup')

const startServer = (db, port, opt, cb) => {
	const app = express()
	const server = http.createServer(app)
	server.listen(port, (err) => {
		if (err) cb(err)
	})

	app.use(hsts({maxAge: 24 * 60 * 60 * 1000}))
	app.use(compression())
	app.use('/static', serve(path.join(__dirname, 'static'), {index: false}))

	const startApp = (opt = {}) => {
		openDat(db, opt, (err, dat) => {
			if (err) return cb(err)

			dat.trackStats()
			if (!opt.offline) dat.joinNetwork()

			attachApi(app, dat)
			app.use(handleErrors)
			cb()
		})
	}

	pathExists(db)
	.then((exists) => {
		if (exists) return startApp(opt)

		const setupDone = (key) => {
			console.info(`setup done. dat key is ${key}.`)
			startApp(Object.assign({}, opt, {key}))
		}

		console.info('db not found. going to show the setup page.')
		attachSetup(app, db, setupDone)
	})
	.catch(cb)
}

module.exports = startServer
