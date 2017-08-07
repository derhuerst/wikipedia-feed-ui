# wikipedia-feed-ui

**Serve a Wikipedia [dat archive](https://github.com/datproject/dat-node) feed over HTTP.**

[![npm version](https://img.shields.io/npm/v/wikipedia-feed-ui.svg)](https://www.npmjs.com/package/wikipedia-feed-ui)
[![build status](https://img.shields.io/travis/derhuerst/wikipedia-feed-ui.svg)](https://travis-ci.org/derhuerst/wikipedia-feed-ui)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/wikipedia-feed-ui.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install wikipedia-feed-ui
```


## Usage

```js
Usage:
    wiki-feed-ui [-p port] [--db path-to-dat-archive]
Options:
	--port  -p  Port to listen on. Default: 3000
    --db        Path to the P2P Wiki dat archive.
                Default: /Users/j/Library/Application Support/p2p-wiki/db
Examples:
    wiki-feed-ui -p 8080 --db my-custom-p2p-wiki-archive
```


## Contributing

If you have a question or have difficulties using `wikipedia-feed-ui`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/wikipedia-feed-ui/issues).
