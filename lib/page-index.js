'use strict'

const path = require('path')
const slugg = require('slugg')

const ui = require('./ui')

const renderPageLink = (file) => {
	// todo: de-slugify
	return `
<li><a href="/wiki/${file.replace(/\.html$/, '')}">${file}</a></li>`
}

const renderDirLink = (dir) => {
	return `
<li><a href="/${dir}">articles with <code>${dir}</code></a></li>`
}

const renderStats = (dat) => {
	const connections = dat.network ? `
<p>Connected to ${dat.network.connected} peers.` : `
<p>Offline mode.`
	return connections + `
Latest known version is <code>${dat.archive.version}</code>.</p>`
}

const render = (dat, files, isRoot) => {
	const render = isRoot ? renderDirLink : renderPageLink
	const content = renderStats(dat) + files.map(render).join('')
	return ui(isRoot ? 'directories' : 'pages', content)
}

const pageIndex = (dat) => (req, res, next) => {
	const dir = '/' + (req.params.ns || '')
	const isRoot = !req.params.ns

	dat.archive.readdir(dir, {cached: true}, (err, files) => {
		if (err) {
			err.statusCode = 404
			return next(err)
		}

		// todo: use slugify from build-wikipedia-feed
		files = files.sort((a, b) => slugg(a) < slugg(b) ? -1 : 1)

		// res.json(files)
		res.type('html')
		res.send(render(dat, files, isRoot))
		next()
	})
}

module.exports = pageIndex
