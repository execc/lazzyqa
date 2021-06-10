const fs = require('fs')
const { getNumTxBlocks, getTransactionsForBlock } = require('./zilliqaApi');
const { sendMessages } = require('./kafka')
const { partition, sleep } = require('./utils')

const run = async (startBlock, batchCompletedCallback) => {
    const h = await getNumTxBlocks()
    const block = h - 1
    const batchSize = 5
    if (parseInt(startBlock) === parseInt(block)) {
        console.log(`No new blocks found`)
        return
    }
    console.log(`Loading blocks from ${startBlock} to ${block}`)
    for (let i = startBlock; i < block; i += batchSize) {
        let k = i
        const pending = []
        while (k < block && k < i + batchSize) {
            console.log(`Loading block ${k} / ${block} (${k / block * 100})%`)
            pending.push(getTransactionsForBlock(`${k}`))
            k++
        }
        console.log(`Waiting for ${pending.length} blocks...`)
        const completed = await Promise.all(pending)
        console.log(`Loaded ${pending.length} blocks...`)

        const txsToLoad = []
        for (let x = 0; x < completed.length; x++) {
            const txBlock = i + x
            const blockTxs = completed[x]
            console.log(`Got ${blockTxs.length} transactions for block ${txBlock}`)
            for (let blockTx of blockTxs) {
                txsToLoad.push({
                    txHash: blockTx,
                    block: txBlock
                })
            }
        }

        console.log(`Loading ${txsToLoad.length} transactions in block`)
        const partitions = partition(txsToLoad, 20).map(x => ({
            value: JSON.stringify(x)
        }))

        await sendMessages('zil-tx-batches', partitions)

        batchCompletedCallback(k)
    }
}

const startLoadingBlocks = async () => {
    const delay = 5000
    let state = {}
    try {
        state = JSON.parse(fs.readFileSync('current_block.json'))
    } catch (e) {
        fs.writeFileSync('current_block.json', JSON.stringify({
            last: parseInt(process.env['START_BLOCK'])
        }))
        state = JSON.parse(fs.readFileSync('current_block.json'))
    }

    const cb = (newHeight) => {
        fs.writeFileSync('current_block.json', JSON.stringify({
            last: newHeight
        }))
        state = JSON.parse(fs.readFileSync('current_block.json'))
    }

    while (true) {
        try {
            await run(state.last, cb)
        } catch (e) {
            console.error(e)
            console.error(`Error loading block range, retry in ${delay} ms.`)
        }
        console.log(`Done loading blocks; sleeping for ${delay}`)
        await sleep(delay)
    }
}

 module.exports = {
    startLoadingBlocks
}