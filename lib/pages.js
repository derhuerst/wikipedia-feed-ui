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

const renderStats = (archive) => {
	// todo: show wether it's syncing
	return `
<p>Archive is ${archive.live ? '' : 'not '} in live mode. Latest known version is ${archive.version}.</p>
`
}

const render = (archive, files) => {
	const content = renderStats(archive) + files.map(renderFile).join('')
	return ui('available pages', content)
}

const pages = (dat) => (req, res, next) => {
	dat.archive.readdir('/', {cached: true}, (err, files) => {
		if (err) {
			err.statusCode = 404
			return next(err)
		}

		files = files.sort((a, b) => slugg(a) < slugg(b) ? -1 : 1)

		// res.json(files)
		res.type('html')
		res.send(render(dat.archive, files)) // todo
		next()
	})
}

module.exports = pages
