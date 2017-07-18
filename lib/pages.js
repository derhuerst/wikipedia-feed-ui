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

const renderStats = (db) => {
	// todo: show wether it's syncing
	return `
<p>Archive is ${db.live ? '' : 'not '} in live mode. Latest known version is ${db.version}.</p>
`
}

const render = (db, files) => {
	const content = renderStats(db) + files.map(renderFile).join('')
	return ui('available pages', content)
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
		res.send(render(db, files)) // todo
		next()
	})
}

module.exports = pages
