'use strict'
/* eslint-disable no-path-concat */
const { chunker } = require('../src/encode')
const assert = require('assert')
const bytes = require('bytesish')
const tsame = require('tsame')
const fs = require('fs')
const { it } = require('mocha')

const same = (x, y) => assert.ok(tsame(x, y))

const fixture = fs.readFileSync(__dirname + '/fixtures/bundle')

it('chunk bundle', async () => {
  const parts = []
  for await (const [hash, chunk] of chunker(fixture)) {
    parts.push([await hash, chunk])
  }
  const b = bytes.concat(parts.map(x => x[1]))
  assert.ok(bytes.compare(b, fixture))
  same(bytes.arrayBuffer(b), bytes.arrayBuffer(fixture))
})
