#!/usr/bin/env node
'use strict'
/* eslint-disable no-console */
const encode = require('./src/encode')
const register = require('./src/register')
const rsl = require('raw-sha-links')
const fs = require('fs')
const os = require('os')
const path = require('path')
const prompt = require('prompt-sync')()

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

const configfile = path.join(os.homedir(), '.bundlesync.json')
let config
try {
  const buffer = fs.readFileSync(configfile)
  config = JSON.stringify(buffer.toString())
} catch (e) {
  config = {}
}

if (!config.token) config.token = process.env.GHTOKEN

const authenticated = yargs => {
  yargs.option('token', {
    desc: 'GitHub token.',
    default: config.token
  })
}

const getToken = () => {
  const token = prompt('Gimme a GitHub Token:')
  config.token = token
  console.log('Saving token to ~/.bundlesync.json')
  fs.writeFileSync(configfile, Buffer.from(JSON.stringify(config)))
  return token
}

const registerCommand = async argv => {
  if (!argv.token) argv.token = getToken()
  const resp = await register(argv)
  console.log(resp.success)
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
  .command({
    command: 'register [name]',
    aliases: ['r'],
    desc: 'Register a named bundle.',
    handler: registerCommand,
    builder: yargs => authenticated(yargs)
  })
  .argv
