const chalk = require('chalk')
const dayjs = require('dayjs')

const API = require('./services')

const shouldCancelLike = (item) => !item.user.id

const cancelLike = async () => {
    let page = 1, sum = 0

    try {
        while (true) {
            const { data } = await API.getLikeList(page++)
            const { data: { list }, ok } = data

            if (ok && list.length > 0) {
                for (const item of list) {
                    if (shouldCancelLike(item)) {
                        const deleteResult = await API.cancelLike(String(item.id))
                        console.info(`CANCEL LIKE ${chalk.yellow(item.id)} ${!!deleteResult.data && deleteResult.data.ok === 1 ? chalk.green('succeed') : chalk.red('failed')}`)
                        console.info(chalk.blue(`[${dayjs(item.created_at).format("YYYY-MM-DD hh:mm:ss")}]`))
                        console.info()
                        sum++
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

const loopCancelLike = async () => {
    let sum = 0

    while (true) {
        const result = await cancelLike()

        if (result) {
            sum += result
        } else {
            break
        }
    }

    console.info(`cancel invalid likes finished, cancel ${sum} likes!`)
}

loopCancelLike()
