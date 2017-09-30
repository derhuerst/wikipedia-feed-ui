'use strict'

const send = require('send')

const slugToPath = require('./slug-to-path')

const sendVersion = (dat, file, version, req, res, next) => {
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

const sendLatest = (dat, file, req, res, next) => {
	send(req, file, {root: dat.path})
	.pipe(res)
	.once('error', next)
	.once('finish', () => next())
}

const page = (dat) => (req, res, next) => {
	const file = slugToPath(req.params.slug)

	if (req.query.version) {
		const version = parseInt(req.query.version)
		if (Number.isNaN(version)) {
			const err = new Error('invalid version parameter.')
			err.statusCode = 400
			return next(err)
		}
		sendVersion(dat, file, version, req, res, next)
	} else {
		sendLatest(dat, file, req, res, next)
	}
}

module.exports = page
