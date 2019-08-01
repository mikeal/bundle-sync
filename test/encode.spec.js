'use strict'
const { chunker } = require('../src/encode')
const assert = require('assert')
const bytes = require('bytesish')
const tsame = require('tsame')
const fs = require('fs')
const { it } = require('mocha')

const same = (x, y) => assert.ok(tsame(x, y))

const fixture = fs.readFileSync('./fixture.bundle.js')

it('chunk bundle', async () => {
  let parts = []
  for await (let [hash, chunk] of chunker(fixture)) {
    parts.push([await hash, chunk])
  }
  let b = bytes.concat(parts.map(x => x[1]))
  assert.ok(bytes.compare(b, fixture))
})

