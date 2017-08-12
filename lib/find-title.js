'use strict'

const ffprobe = require('ffprobe')
const readTags = require('read-audio-tags')
const path = require('path')

const findTitle = (file, cb) => {
	ffprobe(file, {path: '/usr/local/bin/ffprobe'}, (err, info) => {
		if (err) return cb(err)

		const audio = info.streams.find(s => s.codec_type === 'audio')
		const duration = Math.floor(parseFloat(audio.duration) * 1000)
		readTags(file, (err, tags) => {
			if (err) return cb(err)

			cb(null, {path: file, filename: path.basename(file), duration, tags})
		})
	})
}

module.exports = findTitle
