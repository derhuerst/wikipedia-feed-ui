'use strict'

const through = require('through2')

const ui = require('./ui')

const render = (name, history) => {
	let content = ''
	for (let [revision, date] of history) {
		content += `
<li>
	<a href="/wiki/${name}?revision=${revision}">
		${date.toLocaleDateString()}
		${date.toLocaleTimeString()}
	</a>
</li>`
	}
	return ui('history of ' + name, content)
}

const pageHistory = (db) => (req, res, next) => {
	const path = '/' + req.params.slug + '.html'
	const revisions = db.history({
		type: 'put', // todo: correct?
		name: path
	})

	const history = []

	revisions
	.on('error', (err) => {
		revisions.close()
		next(err)
	})
	.on('data', (revision) => {
		if (revision.name === path) {
			history.push([revision.version, new Date(revision.value.mtime)])
		}
	})
	.on('end', () => {
		res.type('html')
		res.send(render(req.params.slug, history))
	})
}

module.exports = pageHistory
