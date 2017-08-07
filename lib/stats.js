'use strict'

const {format} = require('util')

const ui = require('./ui')

const statsDeactivated = ui('oops', `\
<p>This dat archive does not have stats tracking enabled.</p>`)

const render = (stats) => {
	return ui('stats', `<pre><code>${format(stats)}</code></pre>`)
}

const pages = (dat) => (req, res, next) => {
	const rendered = dat.stats ? render(dat.stats.get()) : statsDeactivated
	res.type('html')
	res.send(rendered)
	next()
}

module.exports = pages
