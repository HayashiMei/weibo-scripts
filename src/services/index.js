const http = require('./http')
const config = require('../config')

const getTweetList = (date, page = 1) => {
    return http.get('https://weibo.com/ajax/statuses/mymblog', {
        params: {
            uid: config.UID,
            page,
            feature: 0,
            stat_date: date,
        }
    })
}

const getLongText = (mblogid) => {
    return http.get('https://weibo.com/ajax/statuses/longtext', {
        params: {
            id: mblogid,
        }
    })
}

const getLotteryPage = async (mid) => {
    const { data } = await http.get('https://lottery.media.weibo.com/lottery/h5/history/list', {
        params: {
            mid,
        }
    })

    const result = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1)
    return JSON.parse(result)
}

const deleteTweet = (id) => http.post('https://weibo.com/ajax/statuses/destroy', { id })

const getLikeList = (page = 1) => {
    return http.get(`https://weibo.com/ajax/statuses/likelist`, {
        params: {
            uid: config.UID,
            page,
        }
    })
}

const cancelLike = (id) => http.post('https://weibo.com/ajax/statuses/cancelLike', { id })

module.exports = {
    getTweetList,
    getLongText,
    getLotteryPage,
    deleteTweet,
    getLikeList,
    cancelLike
}
