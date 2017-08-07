'use strict'

const {inspect} = require('util')

const ui = require('./ui')

const renderPath = (dat) => {
	return `
<p>The dat archive is stored at <code>${dat.path}</code>.</p>`
}

const renderKey = (dat) => {
	return `
<p>The archive's key is <code>${dat.key.toString('hex')}</code>.</p>`
}

const statsDeactivated = `
<p>This dat archive does not have stats tracking enabled.</p>`
const renderStats = (dat) => {
	if (!dat.stats) return statsDeactivated
	const stats = dat.stats.get()
	return `<pre><code>${inspect(stats, {breakLength: 100})}</code></pre>`
}

const pages = (dat) => (req, res, next) => {
	const rendered = ui('stats', [
		renderPath(dat),
		renderKey(dat),
		renderStats(dat)
	].join(''))

	res.type('html')
	res.send(rendered)
	next()
}

module.exports = pages
