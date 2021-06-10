const getRecentNfts = async (amount = 12) => {
    const response = await fetch(`/api/nfts/recent?amount=${amount}`).then(res => res.json())
    return response.data
}

const getAddressNfts = async (address, amount = 24) => {
    console.log(address)
    const response = await fetch(`/api/addresses/${address}/nfts?amount=${amount}`).then(res => res.json())
    console.log(JSON.stringify(response.data))
    return response.data
}

const getPortfolioNfts = async (portfilioId, amount = 24) => {
    console.log(portfilioId)
    const response = await fetch(`/api/portfolios/${portfilioId}/nfts?amount=${amount}`).then(res => res.json())
    console.log(JSON.stringify(response.data))
    return response.data
}

const getRandomAddress = async () => {
    const response = await fetch(`/api/addresses/random`).then(res => res.json())
    return response.data
}

const getPortfolio = async(id) => {
    const response = await fetch(`/api/portfolios/${id}`).then(res => res.json())
    return response.data
}

const savePortfolio = async(folio) => {
    const response = await fetch(`/api/portfolios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(folio)
    }).then(res => res.json())
    return response.data
}


export {
    getRecentNfts,
    getAddressNfts,
    getRandomAddress,
    getPortfolio,
    savePortfolio,
    getPortfolioNfts
}