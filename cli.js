#!/usr/bin/env node
'use strict'

const startServer = require('.')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const db = process.env.DB
if (!db) showError('Missing DB env var.')

const port = process.env.PORT || 3000

const server = startServer(db, port, (err) => {
	if (err) return showError(err)
	console.info(`Listening on port ${port}.`)
})
