'use strict'
const bent = require('bent')

const github = bent('https://api.github.com', { 'User-Agent': 'bundlesync-0.0.1' }, 'json')
const regapi = bent('https://api.bundlesync.dev/register/', 'json')
const enc = encodeURIComponent

const register = async opts => {
  const { token, name } = opts
  if (!name || !token) throw new Error('Missing required argument')

  const user = await github(`/user?access_token=${enc(token)}`)
  const login = user.login

  const params = `?access_token=${enc(token)}&login=${enc(login)}&name=${enc(name)}`
  const resp = await regapi(params)
  if (!resp.success) throw new Error('Failed ' + JSON.stringify(resp))
  return resp
}

module.exports = register
