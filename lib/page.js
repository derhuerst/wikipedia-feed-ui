'use strict'

const page = (db) => (req, res, next) => {
	const path = '/' + req.params.slug + '.html'
	db.readFile(path, 'utf8', (err, content) => {
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
