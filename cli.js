'use strict'
/* eslint-disable no-console */
const encode = require('./src/encode')
const rsl = require('raw-sha-links')
const fs = require('fs')

const getInput = argv => {
  let input
  if (!argv.input) {
    console.error('Reading input from stdin')
    input = process.stdin
  } else {
    input = fs.createReadStream(argv.input)
  }
  return input
}

const encodeCommand = async argv => {
  const input = getInput(argv)
  const hashes = await encode(input)
  const encoded = rsl.encode(hashes)
  console.log(rsl.decode(encoded))
}

require('yargs') // eslint-disable-line
  .command({
    command: 'encode [input]',
    aliases: ['e', 'enc'],
    desc: 'Encode bundle and output raw-sha-links block.',
    handler: encodeCommand,
    builder: yargs => {
      yargs.positional('input', {
        desc: 'Input file (bundle.js) to encode.'
      })
    }
  })
  .argv
