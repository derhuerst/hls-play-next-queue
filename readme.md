# hls-play-next-queue

**A [play next queue](https://www.youtube.com/watch?v=wUO6vw8Hwn4) that serves an [HTTP live stream (HLS)](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/Introduction/Introduction.html).**

[![npm version](https://img.shields.io/npm/v/hls-play-next-queue.svg)](https://www.npmjs.com/package/hls-play-next-queue)
[![build status](https://img.shields.io/travis/derhuerst/hls-play-next-queue.svg)](https://travis-ci.org/derhuerst/hls-play-next-queue)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hls-play-next-queue.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install hls-play-next-queue
```


## CLI Usage

```shell
Usage:
    hls-play-next-queue <dir>
Examples:
    hls-play-next-queue /path/to/media
```


## JS Usage

```js
const express = require('express')
const createQueue = require('.')

const {item, add, list} = createQueue('/path/to/my/media')

express()
.use(item)
.get('/', list)
.post('/', add)
.listen(3000)
```


## Contributing

If you have a question or have difficulties using `hls-play-next-queue`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hls-play-next-queue/issues).
