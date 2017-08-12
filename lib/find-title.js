'use strict'

const ffprobe = require('ffprobe')
const readTags = require('read-audio-tags')

const findTitle = (filename, cb) => {
	ffprobe(filename, {path: '/usr/local/bin/ffprobe'}, (err, info) => {
		if (err) return cb(err)

		const audio = info.streams.find(s => s.codec_type === 'audio')
		const duration = Math.floor(parseFloat(audio.duration) * 1000)
		readTags(filename, (err, tags) => {
			if (err) return cb(err)

			cb(null, {filename, duration, tags})
		})
	})
}

module.exports = findTitle
