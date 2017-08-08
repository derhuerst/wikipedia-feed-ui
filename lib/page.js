'use strict'

const send = require('send')

const sendRevision = (dat, revision, req, res, next) => {
	const file = '/' + req.params.slug + '.html'
	const oldArchive = dat.archive.checkout(revision)

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
	if (req.query.revision) {
		const revision = parseInt(req.query.revision)
		if (Number.isNaN(revision)) {
			const err = new Error('invalid revision parameter.')
			err.statusCode = 400
			return next(err)
		}
		sendRevision(dat, revision, req, res, next)
	} else {
		sendLatest(dat, req, res, next)
	}
}

module.exports = page
