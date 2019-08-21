'use strict'
const chunker = require('rabin-generator')
const digest = require('digestif')

const _chunker = async function * (input) {
  for await (const view of chunker(input)) {
    yield [digest(view), view]
  }
}

const encode = async input => {
  const hashes = []
  for await (const [hash] of _chunker(input)) {
    hashes.push(hash)
  }
  return Promise.all(hashes)
}

module.exports = encode
module.exports.encode = encode
module.exports.chunker = _chunker
