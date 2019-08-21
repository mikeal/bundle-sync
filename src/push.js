const bent = require('bent')
const bytes = require('bytesish')
const rsl = require('raw-sha-links')
const encode = require('./encode')

const apiUrl = 'https://api.bundlesync.dev'
const get = bent(apiUrl)
const put = bent(apiUrl, 'PUT', 'buffer')
const enc = encodeURIComponent

const push = async (data, token) => {
  const qs = `?access_token=${enc(token)}`
  const digests = []
  const db = {}
  for await (let [digest, chunk] of encode.chunker(data)) {
    digest = await digest
    digests.push(digest)
    db[bytes.toString(digest, 'base64')] = chunk
  }
  const block = rsl.encode(digests)
  console.log(`/sync/${qs}`)
  const missing = rsl.decode(await put(`/sync/${qs}`, block))
  for (let miss of missing) {
    const key = bytes.toString(miss, 'base64')
    if (!db[key]) throw new Error('Remote asked for missing data')
    console.log(`/raw-block/${qs}`)
    const hash = await put(`/raw-block/${qs}`, db[key])
    if (bytes.toString(hash, 'base64') !== key) {
      throw new Error('Hash missmatch')
    }
  }
  console.log(`pushed ${missing.length} new blocks`)
}

module.exports = push
  /*
  const list = rsl.decode(bytes(missing))

  same(list, [hash1, hash2, hash3])

  const respHash1 = await put('https://api.bundlesync.dev/raw-block/', value1)
  assert.ok(bytes.compare(hash1, respHash1))

  const stillMissing = rsl.decode(await put('https://api.bundlesync.dev/sync/', block))
  same(stillMissing, [hash2, hash3])
  */
