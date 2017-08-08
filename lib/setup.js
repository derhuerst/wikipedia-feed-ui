'use strict'

const bodyParser = require('body-parser')

const ui = require('./ui')

const invalidMsg = ui('invalid request', `
<p>Something went wrong. Please go to <a href="/setup">the setup page</a>.</p>`)

const redirectMsg = ui('once second', `
<p>You will be redirected to <a href="/setup">the setup page</a>.</p>`)

const keyForm = ui(`Let's set up your P2P Wikipedia!`, `
<form method="post" action="/setup">
	<input type="text" name="key" placeholder="the dat archive key you want to sync" inputmode="latin" pattern="[A-Fa-f0-9]+" spellcheck="false" required>
	<input type="submit" value="sync dat archive">
</form>`)

const attachSetup = (app, cb) => {
	let done = false

	const route = (req, res, next) => {
		if (done) return next()
		if (req.path !== '/setup') {
			res.redirect(302, '/setup').type('html').send(redirectMsg)
			return next()
		}

		if (req.method === 'POST') {
			const key = req.body && req.body.key
			if (!key) {
				res.status(400).type('html').send(invalidMsg)
				return next()
			}

			// todo
		} else {
			res.type('html').send(keyForm)
		}
	}
	app.use('/setup', bodyParser.urlencoded({extended: false}))
	app.use(route)
}

module.exports = attachSetup
