'use strict'

const slugg = require('slugg')

const ui = require('./ui')

const renderFile = (file) => {
	return `
<li>
	<a href="/wiki/${file.replace(/\.html$/, '')}">${file}</a>
</li>
`
}

const render = (files) => {
	return ui('available pages', files.map(renderFile).join(''))
}

const pages = (db) => (req, res, next) => {
	db.readdir('/', {cached: true}, (err, files) => {
		if (err) {
			err.statusCode = 404
			return next(err)
		}

		files = files.sort((a, b) => slugg(a) < slugg(b) ? -1 : 1)

		// res.json(files)
		res.type('html')
		res.send(render(files)) // todo
		next()
	})
}

module.exports = pages
