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

const renderStats = (dat) => {
	const connections = dat.network ? `
<p>Connected to ${dat.network.connected} peers.` : `
<p>Offline mode.`
	return connections + `
Latest known version is <code>${dat.archive.version}</code>.</p>`
}

const render = (dat, files) => {
	const content = renderStats(dat) + files.map(renderFile).join('')
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
		res.send(render(dat, files)) // todo
		next()
	})
}

module.exports = pages
