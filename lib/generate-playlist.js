'use strict'

const path = require('path')

const head = `\
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-ALLOW-CACHE:YES
#EXT-X-PLAYLIST-TYPE:EVENT`
const tail = '\n#EXT-X-ENDLIST'

const generatePlaylist = (queue) => {
	let res = head

	for (let item of queue) {
		const {filename, duration, tags, sequence} = item
		const seconds = Math.round(duration / 1000)
		const title = tags.title || path.basename(filename, path.extname(filename))

		res += `
#EXT-X-MEDIA-SEQUENCE:${sequence}
#EXT-X-TARGETDURATION:${seconds}
#EXTINF:${seconds},${title}
/${item.id}
#EXT-X-DISCONTINUITY`
	}

	return res + tail
}

module.exports = generatePlaylist
