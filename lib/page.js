'use strict'

const send = require('send')

const sendVersion = (dat, version, req, res, next) => {
	const file = '/' + req.params.slug + '.html'
	const oldArchive = dat.archive.checkout(version)

	oldArchive.readFile(file, 'utf8', (err, content) => {
		if (err) {
			err.statusCode = 404
			return next(err)
		}

		// todo: all the bells & whistles that `send` provides
		res.type('html')
		res.send(content)
		next()
	})
}

const sendLatest = (dat, req, res, next) => {
	const ns = req.params.slug.slice(0, 2).toLowerCase()
	const file = ns + '/' + req.params.slug + '.html'

	send(req, file, {root: dat.path})
	.pipe(res)
	.once('error', next)
	.once('finish', () => next())
}

const page = (dat) => (req, res, next) => {
	if (req.query.version) {
		const version = parseInt(req.query.version)
		if (Number.isNaN(version)) {
			const err = new Error('invalid version parameter.')
			err.statusCode = 400
			return next(err)
		}
		sendVersion(dat, version, req, res, next)
	} else {
		sendLatest(dat, req, res, next)
	}
}

module.exports = page
