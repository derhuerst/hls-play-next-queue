'use strict'

const path = require('path')
const randomId = require('shortid').generate

const findTitle = require('./lib/find-title')
const generatePlaylist = require('./lib/generate-playlist')
const sendConverted = require('./lib/send-converted')

const createError = (err, code) => {
	err = 'string' === typeof err ? new Error(err) : err
	err.statusCode = code
	return err
}

const createQueue = (root) => {
	const queue = []
	let sequence = 0

	const removeFromQueue = (id) => {
		const i = queue.findIndex(item => item.id === id)
		if (i >= 0) queue.splice(i, 1)
	}

	const item = (req, res, next) => {
		if (req.method !== 'GET') return next()

		const id = path.basename(req.path)
		const item = queue.find(item => item.id === id)
		if (!item) return next()

		sendConverted(item, req, res, next)
	}

	const add = (req, res, next) => {
		const filename = req.query.file
		if (!filename) return next(createError('invalid file parameter', 400))

		findTitle(path.join(root, filename), (err, data) => {
			if (err) return next(createError(err, 500))

			data = Object.assign({id: randomId(), sequence: sequence++}, data)
			if (queue.length > 0) {
				const last = queue[queue.length - 1]
				data.start = last.start + last.duration
			} else data.start = Date.now()
			queue.push(data)

			setTimeout(() => {
				const i = queue.findIndex(item => item.id === data.id)
				if (i >= 0) queue.splice(i, 1)
			}, data.duration)

			console.info('added', filename, 'to the queue', data.id)
			res.status(201)
			res.type('text/plain')
			res.send(data.id)
		})
	}

	const list = (req, res) => {
		console.info('serving playlist with', queue.length, 'queued')
		res.type('application/vnd.apple.mpegurl')
		res.send(generatePlaylist(queue))
	}

	return {item, add, list}
}

module.exports = createQueue
