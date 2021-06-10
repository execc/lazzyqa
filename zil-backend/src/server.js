const express = require('express')
const { getRecentNfts, getRandomAddress, getAddressNfts, getPortfolio, savePortfolio, getPortfolioNfts } = require('./service')
const app = express()
const port = 3001

app.use(express.json());

app.get('/api/nfts/recent', async (req, res) => {
    const amount = req.params['amount'] || 12
    const random = await getRecentNfts(amount)
    res.send(JSON.stringify({
        data: random
    }))
})

app.get('/api/addresses/:address/nfts', async (req, res) => {
  const address = req.params.address
  const amount = req.params['amount'] || 12
  const random = await getAddressNfts(address, amount)
  res.send(JSON.stringify({
      data: random
  }))
})


app.get('/api/addresses/random', async (req, res) => {
  const random = await getRandomAddress()
  res.send(JSON.stringify({
      data: random
  }))
})


app.get('/api/portfolios/:id', async (req, res) => {
  const id = req.params.id
  const folio = await getPortfolio(id)
  res.send(JSON.stringify({
    data: folio
}))
})

app.post('/api/portfolios', async (req, res) => {
  const folio = req.body
  await savePortfolio(folio)
  res.send(JSON.stringify({
    data: {
      success: true
    }
}))
})

app.get('/api/portfolios/:portfolio/nfts', async (req, res) => {
  const portfolio = req.params.portfolio
  const amount = req.params['amount'] || 12
  const random = await getPortfolioNfts(portfolio, amount)
  res.send(JSON.stringify({
      data: random
  }))
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})