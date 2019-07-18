const encode = require('./src/encode')
const fs = require('fs')

const encodeCommand = async argv => {
  let input
  if (!argv.input) {
    console.error('Reading input from stdin')
    input = process.stdin
  } else {
    input = fs.createReadStream(argv.input)
  }
  let encoded = await encode(input)
  process.stdout.write(Buffer.from(encoded))
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


