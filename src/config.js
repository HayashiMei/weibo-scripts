require('dotenv').config()

const UID = process.env.UID
const COOKIE = process.env.COOKIE
const TOKEN = process.env.TOKEN

const START_YEAR = process.env.START_YEAR
const START_MONTH = process.env.START_MONTH
const END_YEAR = process.env.END_YEAR
const END_MONTH = process.env.END_MONTH

module.exports = {
    UID,
    COOKIE,
    TOKEN,
    START_YEAR,
    START_MONTH,
    END_YEAR,
    END_MONTH,
}
