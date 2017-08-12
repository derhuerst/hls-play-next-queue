'use strict'

const randomId = require('shortid').generate

const findTitle = require('./lib/find-title')
const generatePlaylist = require('./lib/generate-playlist')

const err = (msg, code) => {
	err = 'string' === typeof err ? new Error(err) : err
	err.statusCode = code
	return err
}

const createQueue = () => {
	const queue = []
	let sequence = 0

	const removeFromQueue = (id) => {
		const i = queue.findIndex(item => item.id === id)
		if (i >= 0) queue.splice(i, 1)
	}

	const add = (req, res, next) => {
		const filename = req.query.file
		if (!filename) return err('invalid file parameter', 400)

		findTitle(filename, (err, data) => {
			if (err) return err(err, 500)

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

			res.status(201)
			res.type('text/plain')
			res.send('ok')
		})
	}

	const list = (req, res) => {
		res.type('application/vnd.apple.mpegurl')
		res.send(generatePlaylist(queue))
	}

	return {add, list}
}

module.exports = createQueue
