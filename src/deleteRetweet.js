const chalk = require('chalk')
const dayjs = require('dayjs')
const config = require('./config')

const API = require('./services')

const shouldDelete = (item) => (!!item.retweeted_status && !item.retweeted_status.user) || item.text.includes('发起的投票')
const maybeLottery = (item) => !!item.retweeted_status && (item.retweeted_status.text.includes('抽') || item.retweeted_status.text.includes('奖'))

const deleteByDate = async (date) => {
    let page = 1, sum = 0

    try {
        while (true) {
            const { data } = await API.getTweetList(date, page++)
            const { data: { list }, ok } = data

            if (ok && list.length > 0) {
                for (const item of list) {
                    if (shouldDelete(item)) {
                        const deleteResult = await API.deleteTweet(item.id)
                        console.info(`DELETE ${chalk.yellow(item.id)} ${!!deleteResult.data && deleteResult.data.ok === 1 ? chalk.green('succeed') : chalk.red('failed')}`)
                        console.info(chalk.blue(`[${dayjs(item.created_at).format("YYYY-MM-DD hh:mm:ss")}]`))
                        console.info(`[text]: ${item.text_raw}`)
                        console.info()
                        sum++
                    } else if (maybeLottery(item)) {
                        const { isLongText, mblogid, mid } = item.retweeted_status
                        const lotteryData = await API.getLotteryPage(mid)

                        if (!lotteryData.total) {
                            continue
                        }

                        const timeStr = lotteryData.list[0].time.replace(/年|月/g, '-').replace('日', '')
                        const diff = dayjs(timeStr).diff(dayjs(), 'day')

                        if (diff < -7) {
                            console.info(`DELETE ${chalk.yellow(item.id)} ${!!deleteResult.data && deleteResult.data.ok === 1 ? chalk.green('succeed') : chalk.red('failed')}`)
                            console.info(chalk.blue(`[${dayjs(item.created_at).format("YYYY-MM-DD hh:mm:ss")}]`))
                            console.info(`[text]: ${item.text_raw}`)
                            console.info()
                            sum++
                        }
                    }
                }
            } else {
                break
            }
        }
    } catch (error) {
        console.info(error)
    }

    return sum
}

const loopDelete = async (date) => {
    let sum = 0

    while (true) {
        const result = await deleteByDate(date)

        if (result) {
            sum += result
        } else {
            break
        }
    }

    console.info(`[${date}] delete invalid retweets finished, delete ${sum} tweets!`)

    return sum
}

const main = async () => {
    const { START_YEAR, START_MONTH, END_YEAR, END_MONTH } = config
    const summary = {
        count: 0,
        date: {}
    }

    for (let year = START_YEAR; year <= END_YEAR; year++) {
        for (let month = 1; month <= 12; month++) {
            if (year === START_YEAR && month < START_MONTH) {
                continue
            }

            if (year === END_YEAR && month > END_MONTH) {
                continue
            }

            const date = `${year}${String(month).padStart(2, '0')}`
            const count = await loopDelete(date)

            summary.count += count
            summary.date[date] = count
        }
    }

    console.info()
    console.info('[Date]')
    Object.keys(summary.date).forEach((key) => {
        console.info(`  [${key}]: ${summary.date[key]}`)
    })
    console.info(`[Summary]: ${summary.count}`)
}

main()
