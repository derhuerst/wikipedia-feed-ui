'use strict'

const express = require('express')
const hsts = require('hsts')
const compression = require('compression')
const path = require('path')
const serve = require('serve-static')

const createApi = (dat) => {
	const stats = require('./lib/stats')(dat)
	const index = require('./lib/page-index')(dat)
	const page = require('./lib/page')(dat)
	const pageHistory = require('./lib/page-history')(dat)
	const onError = require('./lib/error')

	const api = express()

	api.use(hsts({maxAge: 24 * 60 * 60 * 1000}))
	api.use(compression())

	api.use('/static', serve(path.join(__dirname, 'static'), {index: false}))

	api.get('/stats', stats)
	api.get('/', index)
	api.get('/:ns', index)
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
