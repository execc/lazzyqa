const { subscribeTo } = require('./kafka')
const { getTxBlock } = require('./zilliqaApi')
const { save, loadById } = require('./mongo')
const fetch = require('node-fetch')

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jper', 'gif']

const isImage = (uri) => {
    return IMAGE_EXTENSIONS.filter(ext => uri.endsWith(`.${ext}`)).length > 0
}

const eventParam = (event, name) => {
    return event.params.filter(p => p.vname === name)[0].value
}

const hasParam = (event, name) => {
    return event.params.filter(p => p.vname === name).length > 0
}

const handleMint = async (event) => {
    const tokenUri = eventParam(event, 'token_uri')
    const creator = eventParam(event, 'by')
    const owner = eventParam(event, 'recipient')
    const tokenId = eventParam(event, 'token_id')
    const contract = event.tx.toAddr
    const block = event.req.block
    let image = ''
    let meta = {}
    
    // Try to fetch metadata
    //
    if (isImage(tokenUri)) {
        image = tokenUri
    } else {
        try {
            meta = await fetch(tokenUri).then(res => res.json())
            image = meta.image
        } catch(e) {
            console.error(`Unable to load meta for token uri ${tokenUri}`)
        }
    }

    // Fetch block timestamp
    //
    const blockInfo = await getTxBlock(block)
    const timestamp = blockInfo.result.header.Timestamp

    const eventDocument = {
        type: 'Mint',
        creator,
        timestamp,
        block
    }

    // Save NFT info
    //
    const nftDocument = {
        _id: `${contract}:${tokenId}`,
        tokenId,
        tokenUri,
        creator,
        owner,
        image,
        meta,
        created: timestamp,
        lastUpdated: timestamp,
        title: meta.title,
        history: [
            eventDocument
        ]
    }

    save('nfts', nftDocument)
    console.log(`Saved nft ${contract}:${tokenId} to db`)
}

const handleTransfer = async (event) => {
    const newOwner = eventParam(event, 'recipient')
    const tokenId = eventParam(event, 'token_id')
    const contract = event.tx.toAddr
    const block = event.req.block

    // Find NFT
    const document = await loadById('nfts', `${contract}:${tokenId}`)
    if (!document) {
        console.log(`Transfer of unknown NFT ${contract}:${tokenId}, aborted handler`)
        return
    } else {
        console.log(`Transfer of known NFT`)
    }
    
    // Fetch block timestamp
    //
    const blockInfo = await getTxBlock(block)
    const timestamp = blockInfo.result.header.Timestamp

    const eventDocument = {
        type: 'Transfer',
        newOwner,
        timestamp,
        block
    }

    document.owner = newOwner
    document.lastUpdated = timestamp
    document.history.push(eventDocument)

    save('nfts', document)
    console.log(`Updated nft ${contract}:${tokenId} to db`)
}

const run = async (event) => {
    if (event._eventname === 'MintSuccess') {
        console.log(`Handle MintSuccess`)
        await handleMint(event)
    }
    if (event._eventname === 'TransferSuccess' && hasParam(event, 'token_id')) {
        console.log(`Handle TransferSuccess`)
        await handleTransfer(event)
    }
}

const startLoadingNft = async () => {
    await subscribeTo('nft-loader-group-13', 'zil-txs', run, true)
}

module.exports = {
    startLoadingNft
}