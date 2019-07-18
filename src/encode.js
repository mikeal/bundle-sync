const chunker = require('rabin-generator')
const rsl = require('raw-sha-links')
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
  return rsl.encode(await Promise.all(hashes))
}
module.exports = encode
module.exports.chunker = _chunker
