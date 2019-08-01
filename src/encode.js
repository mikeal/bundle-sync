const chunker = require('rabin-generator')
const digest = require('digestif')

const _chunker = async function * (input) {
  for await (let view of chunker(input)) {
    yield [digest(view), view]
  }
}

const encode = async input => {
  let hashes = []
  for await (let [hash, view] of _chunker(input)) {
    hashes.push(hash)
  }
  return Promise.all(hashes)
}

exports.encode = encode
exports.chunker = _chunker
