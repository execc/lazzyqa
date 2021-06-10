const { loadAll, loadDistinct, save, loadById } = require('./mongo')

const getRecentNfts = async (limit) => {
    console.log(`called getRecentNfts limit = ${limit}`)
    const result = await loadAll('nfts', undefined, undefined, limit * 50, { 'lastUpdated': -1 })
    const withImage = result.filter(item => item.image && item.image !== '')
    const unique = [...new Map(withImage.map(item => [item["image"], item])).values()];
    return unique.splice(0, limit)
}

const getAddressNfts = async (address, limit) => {
    console.log(`called getAddressRecentNfts address = ${address} limit = ${limit}`)
    const result = await loadAll('nfts', undefined, undefined, limit * 50, { 'lastUpdated': -1 }, { 'owner': address })
    const withImage = result.filter(item => item.image && item.image !== '')
    const unique = [...new Map(withImage.map(item => [item["image"], item])).values()];
    return unique.splice(0, limit)
}

const getPortfolioNfts = async (portfolio, limit) => {
    console.log(`called getPortfolioNfts portfolio = ${portfolio} limit = ${limit}`)
    const folio = await loadById('portfolios', portfolio)
    const addresses = folio ? folio.addresses : []
    const result = await loadAll('nfts', undefined, undefined, limit * 50, { 'lastUpdated': -1 }, { 'owner': { '$in': addresses } })
    const withImage = result.filter(item => item.image && item.image !== '')
    const unique = [...new Map(withImage.map(item => [item["image"], item])).values()];
    return unique.splice(0, limit)
}

const getRandomAddress = async () => {
    console.log(`called getRandomAddress`)
    const addresses = await loadDistinct('nfts', 'owner')
    const item = addresses[Math.floor(Math.random() * addresses.length)];
    return item
}

const savePortfolio = async (folio) => {
    console.log(`called savePortfolio`)
    await save('portfolios', folio)
}

const getPortfolio = async (id) => {
    console.log(`called getPortfolio id = ${id}`)
    const result = await loadById('portfolios', id)
    return result
}

module.exports = {
    getRecentNfts,
    getAddressNfts,
    getRandomAddress,
    getPortfolio,
    savePortfolio,
    getPortfolioNfts,
}