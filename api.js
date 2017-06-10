'use strict'

const express = require('express')
const hsts = require('hsts')
const compression = require('compression')
const path = require('path')
const serve = require('serve-static')

const pages = require('./lib/pages')
const page = require('./lib/page')

const api = express()
module.exports = api

api.use(hsts({maxAge: 24 * 60 * 60 * 1000}))
api.use(compression())

api.use('/static', serve(path.join(__dirname, 'static'), {index: false}))

api.get('/', pages)
api.get('/wiki/:slug', page)

api.use((err, req, res, next) => {
	if (process.env.NODE_DEBUG === 'wikipedia-feed-ui') console.error(err)
	if (res.headersSent) return next()
	res.status(err.statusCode || 500).json({error: true, msg: err.message})
	next()
})
