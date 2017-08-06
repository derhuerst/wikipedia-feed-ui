#!/usr/bin/env node
'use strict'

const mri = require('mri')
const path = require('path')
const envPaths = require('env-paths')

const pkg = require('./package.json')
const startServer = require('.')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v']
})

if (argv.version || argv.v) {
	process.stdout.write(`wiki-feed-ui v${pkg.version}\n`)
	process.exit(0)
}

const defaultDb = path.join(envPaths('p2p-wiki', {suffix: ''}).data, 'db')

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    wiki-feed-ui [-p port][--db path-to-hyperdrive]
Options:
	--port  -p  Port to listen on. Default: 3000
    --db        Path to the P2P Wiki database.
                Default: ${defaultDb}
Examples:
    wiki-feed-ui -p 8080 --db my-custom-p2p-wiki-db
\n`)
	process.exit(0)
}

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const db = argv.db || defaultDb
const port = argv.port || argv.p || 3000

// todo: check if db path exists
const server = startServer(db, port, (err) => {
	if (err) return showError(err)
	console.info(`Serving ${db} on port ${port}.`)
})
