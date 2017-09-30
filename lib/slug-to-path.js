'use strict'

const deslugify = require('wiki-article-name-encoding/decode')
const slugify = require('wiki-article-name-encoding/encode')

const slugToPath = (slug) => {
	const deslugified = deslugify(slug)
	const ns = deslugified.slice(0, 2).toLowerCase()
	return ns + '/' + slugify(deslugified, true) + '.html'
}

module.exports = slugToPath
