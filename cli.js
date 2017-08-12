#!/usr/bin/env node
'use strict'

const mri = require('mri')
const express = require('express')
const corser = require('corser')

const createQueue = require('.')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v']
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    hls-play-next-queue <dir>
Examples:
    hls-play-next-queue /path/to/media
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`hls-play-next-queue v${pkg.version}\n`)
	process.exit(0)
}

const dir = argv._[0]
if (!dir) {
	console.error('dir is invalid.')
	process.exit(1)
}

const {item, add, list} = createQueue(dir)

express()
.use(corser.create())
.use(item)
.get('/', list)
.post('/', add)
.listen(3000, () => {
	console.info(`Serving ${dir} on port 3000.`)
})
