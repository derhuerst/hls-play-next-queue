'use strict'

const os = require('os')
const path = require('path')
const shell = require('shell-escape-tag').default
const {exec} = require('child_process')
const send = require('send')
const fs = require('fs')

const dir = os.tmpdir()

const sendConverted = (item, req, res, cb) => {
	const src = item.path
	const dest = path.join(dir, item.id + '.m4a')
	const cmd = shell `ffmpeg -y -v error -i ${src} -vn -ac 2 -acodec aac -format m4a ${dest}`
	console.info('converting', src, '->', dest)

	exec(cmd, (err, stdout, stderr) => {
		if (err) return cb(err)

		send(req, dest)
		.pipe(res)
		.once('error', cb)
		.once('finish', () => {
			fs.unlink(dest, cb)
		})
	})
}

module.exports = sendConverted
