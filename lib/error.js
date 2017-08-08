'use strict'

const accepts = require('accepts')

const ui = require('./ui')

const showStack = process.env.NODE_DEBUG === 'wikipedia-feed-ui'
const renderError = (err) => {
	const stack = showStack && err.stack ? `\
<pre><code>
${err.stack}
</code></pre>` : ''
	return ui('oops!', `
		<p>${err.message}</p>
		${stack}
	`)
}

const onError = (err, req, res, next) => {
	if (process.env.NODE_DEBUG === 'wikipedia-feed-ui') console.error(err)

	if (res.headersSent) return next()
	res.status(err.statusCode || 500)

	const type = accepts(req).type(['json', 'html'])
	if (type === 'json') {
		res.json({error: true, msg: err.message})
	} else if (type === 'html') {
      	res.header('content-type', 'text/html')
		res.send(renderError(err))
	} else {
      	res.header('content-type', 'text/plain')
      	res.send(err.message)
	}
	next()
}

module.exports = onError
