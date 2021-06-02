const axios = require('axios').default
const config = require('../config')

const http = axios.create()
http.defaults.headers.cookie = config.COOKIE
http.defaults.headers.referer = `https://weibo.com/u/${config.UID}`
http.defaults.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
http.defaults.headers['x-requested-with'] = 'XMLHttpRequest'
http.defaults.headers['x-xsrf-token'] = config.TOKEN

module.exports = http
