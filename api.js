'use strict'

const hyperdrive = require('hyperdrive')
const express = require('express')
const hsts = require('hsts')
const compression = require('compression')
const path = require('path')
const serve = require('serve-static')

const createApi = (db) => {
	const archive = hyperdrive(db)

	const pages = require('./lib/pages')(archive)
	const page = require('./lib/page')(archive)
	const pageHistory = require('./lib/page-history')(archive)
	const onError = require('./lib/error')

	const api = express()

	api.use(hsts({maxAge: 24 * 60 * 60 * 1000}))
	api.use(compression())

	api.use('/static', serve(path.join(__dirname, 'static'), {index: false}))

	api.get('/', pages)
	api.get('/wiki/:slug', page)
	api.get('/wiki/:slug/history', pageHistory)
	api.get('/wiki/Special:History/:slug', pageHistory)

	api.use((err, req, res, next) => {
		if (process.env.NODE_DEBUG === 'wikipedia-feed-ui') console.error(err)
		onError(err, req, res, next)
	})

	return api
}

module.exports = createApi
