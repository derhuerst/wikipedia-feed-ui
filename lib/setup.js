'use strict'

const mkdirp = require('mkdirp')
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

const doneMsg = ui('done', `
<p>Done! I will try to sync the data now. Go to <a href="/">the start page</a>.</p>`)

const attachSetup = (app, db, cb) => {
	let done = false

	const route = (req, res, next) => {
		if (done) return next()
		if (req.path !== '/setup') {
			res.redirect(302, '/setup')
			res.type('html')
			res.send(redirectMsg)
			return next()
		}

		if (req.method === 'POST') {
			const key = req.body && req.body.key
			if (!key) {
				res.status(400)
				res.type('html')
				res.send(invalidMsg)
				return next()
			}

			mkdirp(db, (err) => {
				if (err) return next(err)

				done = true
				res.status(201)
				res.type('html')
				res.send(doneMsg)
				cb(key)
			})
		} else {
			res.type('html')
			res.send(keyForm)
		}
	}

	app.use('/setup', bodyParser.urlencoded({extended: false}))
	app.use(route)
}

module.exports = attachSetup
