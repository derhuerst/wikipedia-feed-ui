'use strict'

const hyperdrive = require('hyperdrive')

const DB = process.env.DB
if (!DB) {
	console.error('Missing DB env var.')
	process.exit(1)
}

const archive = hyperdrive(DB)

const page = (req, res, next) => {
	archive.readFile(req.params.slug + '.html', 'utf8', (err, content) => {
		if (err) {
			err.statusCode = 404
			return next(err)
		}
		res.type('html')
		res.send(content)
		next()
	})
}

module.exports = page
