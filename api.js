'use strict'

const stats = require('./lib/stats')
const index = require('./lib/page-index')
const page = require('./lib/page')
const pageHistory = require('./lib/page-history')

const attachApi = (app, dat) => {
	const routes = {
		stats: stats(dat),
		index: index(dat),
		page: page(dat),
		pageHistory: pageHistory(dat)
	}

	const keyAsHex = dat.archive.key.toString('hex')
	app.use((req, res, next) => {
		if (!res.headersSent) {
			res.append('Hyperdrive-Key', keyAsHex)
			res.append('Hyperdrive-Version', dat.archive.version)
		}
	})

	app.get('/stats', routes.stats)
	app.get('/', routes.index)
	app.get('/:ns', routes.index)
	app.get('/wiki/:slug', routes.page)
	app.get('/wiki/:slug/history', routes.pageHistory)
	app.get('/wiki/Special:History/:slug', routes.pageHistory)
}

module.exports = attachApi
