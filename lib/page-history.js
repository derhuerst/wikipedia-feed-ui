'use strict'

const through = require('through2')

const ui = require('./ui')

const render = (name, history) => {
	let content = ''
	for (let [version, date] of history) {
		content += `
<li>
	<a href="/wiki/${name}?version=${version}">
		${date.toLocaleDateString()}
		${date.toLocaleTimeString()}
	</a>
</li>`
	}
	return ui('history of ' + name, content)
}

const pageHistory = (dat) => (req, res, next) => {
	const path = '/' + req.params.slug + '.html'
	const history = dat.archive.history({
		type: 'put', // todo: correct?
		name: path
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
