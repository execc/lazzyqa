const { startLoadingBlocks } = require('./txLoader')
const { startLoadingTransactionContent } = require('./contentLoader')
const { startLoadingNft } = require('./nftLoader')

const run = () => {
    startLoadingBlocks()
    startLoadingTransactionContent()
    startLoadingNft()
}

run()