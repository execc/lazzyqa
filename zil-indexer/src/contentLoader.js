const { sendMessages, subscribeTo } = require('./kafka')
const { getTransactionDetails } = require('./zilliqaApi')
const { sleep } = require('./utils')

const runFiltered = async (transactionsToLoad) => {
    const txs = transactionsToLoad.filter(tx => tx.txHash)
    const maxAttempts = 5
    let attempt = 1
    let ex = null
    let success = false
    while(attempt < maxAttempts) {
        try {
            await run(txs)
            success = true
            break
        } catch(e) {
            ex = e
            const waitTime = 1000 * attempt
            console.log(`Attmpt ${attempt}, error loading txs, waiting ${waitTime}`)
            attempt++
            await sleep(waitTime)
        }
    }
    if (!success) {
        console.error(ex)
    } else {
        console.log(`+ Completed loading tx batch size = ${transactionsToLoad.length}`)
    }
}

const run = async (transactionsToLoad) => {
    console.log(`Loading ${transactionsToLoad.length} transactions`)
    const pendingTxs = []
    for (const tx of transactionsToLoad) {
        pendingTxs.push(getTransactionDetails(tx.txHash).then(details => ({
            ...details,
            req: tx
        })))
    }

    const loadedTxs = await Promise.all(pendingTxs)
    console.log(`Success Done loading ${pendingTxs.length} transactions`)
    const messages = loadedTxs
        .filter(data => data.receipt.event_logs)
        .flatMap((data, index) => data.receipt.event_logs.map(log => ({
            ...log,
            tx: data,
            req: transactionsToLoad[index]
        })))
        .map(x => ({
            value: JSON.stringify(x)
        }))

    await sendMessages('zil-txs', messages)
    return true
}

const startLoadingTransactionContent = async () => {
    await subscribeTo('content-loader-group', 'zil-tx-batches', runFiltered)
}

module.exports = {
    startLoadingTransactionContent
}