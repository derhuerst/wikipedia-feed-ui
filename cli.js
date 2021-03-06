#!/usr/bin/env node
'use strict'

const mri = require('mri')
const path = require('path')
const envPaths = require('env-paths')

const pkg = require('./package.json')
const startServer = require('.')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'offline', 'o'
	]
})

if (argv.version || argv.v) {
	process.stdout.write(`wiki-feed-ui v${pkg.version}\n`)
	process.exit(0)
}

const defaultDb = path.join(envPaths('p2p-wiki', {suffix: ''}).data, 'db')

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    wiki-feed-ui [-p port] [--db path-to-dat-archive]
Options:
    --offline  -o  Don't send data to other peers. Default: false
    --port     -p  Port to listen on. Default: 3000
    --db           Path to the P2P Wiki dat archive.
                   Default: ${defaultDb}
Examples:
    wiki-feed-ui -p 8080 --db my-custom-p2p-wiki-archive
\n`)
	process.exit(0)
}

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const db = argv.db || defaultDb
const port = argv.port || argv.p || 3000
const offline = argv.offline || argv.o || false

startServer(db, port, {offline}, (err) => {
	if (err) return showError(err)
	console.info(`Serving ${db} on port ${port}.`)
})
