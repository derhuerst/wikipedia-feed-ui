'use strict'

const page = (dat) => (req, res, next) => {
	const path = '/' + req.params.slug + '.html'
	dat.archive.readFile(path, 'utf8', (err, content) => {
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
