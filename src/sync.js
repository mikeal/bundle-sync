'use strict'
const bytes = require('bytesish')

const has = (_set, comp) => {
  for (const value of _set) {
    if (bytes.compare(value, comp)) return true
  }
  return false
}

const diff = (get, manifest, cache) => {
  if (!(cache instanceof Set)) cache = new Set(cache)

  const index = []
  const chunks = []
  const cachehits = []

  while (manifest.length) {
    const hash = manifest.shift()
    if (has(cache, hash)) {
      index.push(1)
      cachehits.push(hash)
    } else {
      index.push(0)
      chunks.push(get(hash))
    }
  }
  return [index, chunks, cachehits]
}

exports.diff = diff
