'use strict'

const through = require('through2')

const slugToPath = require('./slug-to-path')
const ui = require('./ui')

const render = (slug, history) => {
	let content = ''
	for (let [version, date] of history) {
		content += `
<li>
	<a href="/wiki/${slug}?version=${version}">
		${date.toLocaleDateString()}
		${date.toLocaleTimeString()}
	</a>
</li>`
	}
	return ui('history of ' + name, content)
}

const pageHistory = (dat) => (req, res, next) => {
	const history = dat.archive.history({
		type: 'put', // todo: correct?
		name: slugToPath(req.params.slug)
	})

	const history = []

	history
	.on('error', (err) => {
		history.close()
		next(err)
	})
	.on('data', (revision) => {
		if (revision.name === path) {
			history.push([revision.version, new Date(revision.value.mtime)])
		}
	})
	.on('end', () => {
		res.type('html')
		res.send(render(req.params.slug, history.reverse()))
	})
}

module.exports = pageHistory
