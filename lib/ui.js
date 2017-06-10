'use strict'

const ui = (title, content) => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8"/>
	<title>${title}</title>
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
					<h1>${title}</h1>
				</div>
				<div class="content">
					<ul>${content}</ul>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
`
}

module.exports = ui
