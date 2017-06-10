'use strict'

const hyperdrive = require('hyperdrive')
const slugg = require('slugg')

const DB = process.env.DB
if (!DB) {
	console.error('Missing DB env var.')
	process.exit(1)
}

const archive = hyperdrive(DB)

const renderFile = (file) => {
	return `
<li>
	<a href="/wiki/${file.replace(/\.html$/, '')}">${file}</a>
</li>
`
}

const render = (files) => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8"/>
	<title>all pages</title>
	<meta name="generator" content="wikipedia-feed-ui">
	<meta name="referrer" content="origin-when-cross-origin">
	<meta name="viewport" content="initial-scale=1,user-scalable=yes,width=device-width">
	<link rel="canonical" href="https://en.wikipedia.org/">
	<link rel="stylesheet" href="/static/mobile.css">
</head>
<body>
	<div id="mw-mf-viewport">
		<div id="mw-mf-page-center">
			<div id="content" class="mw-body">
				<div class="pre-content heading-holder">
					<h1>available pages</h1>
				</div>
				<div class="content">
					<ul>${files.map(renderFile).join('')}</ul>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
`
}

const pages = (req, res, next) => {
	archive.readdir('/', {cached: true}, (err, files) => {
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
