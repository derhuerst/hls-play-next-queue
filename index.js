'use strict'

const randomId = require('shortid').generate
const {parse} = require('url')

const findTitle = require('./lib/find-title')
const generatePlaylist = require('./lib/generate-playlist')

const invalid = (res, msg) => {
	res.statusCode = 400
	res.end(msg)
}

const serverError = (res, msg) => {
	res.statusCode = 500
	res.end(msg)
}

const createQueue = () => {
	const queue = []
	let sequence = 0

	const removeFromQueue = (id) => {
		const i = queue.findIndex(item => item.id === id)
		if (i >= 0) queue.splice(i, 1)
	}

	const add = (req, res, query) => {
		const filename = query.file // todo: use HTTP body
		if (!filename) return invalid(res, 'invalid file parameter')

		findTitle(filename, (err, data) => {
			if (err) return serverError(res, err.message)

			data = Object.assign({id: randomId(), sequence: sequence++}, data)
			if (queue.length > 0) {
				const last = queue[queue.length - 1]
				data.start = last.start + last.duration
			} else data.start = Date.now()

			queue.push(data)
			setTimeout(removeFromQueue, data.duration, data.id)

			res.statusCode = 201
			res.end('ok')
		})
	}

	const list = (req, res) => {
		// todo: mime type
		res.end(generatePlaylist(queue))
	}

	const onRequest = (req, res) => {
		const {pathname, query} = parse(req.url, true)

		if (req.method === 'POST' && pathname === '/') add(req, res, query)
		else if (req.method === 'GET' && pathname === '/') list(req, res)
	}

	return onRequest
}

module.exports = createQueue
