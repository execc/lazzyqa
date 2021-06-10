const { Zilliqa } = require('@zilliqa-js/zilliqa');

const zilliqa = new Zilliqa(process.env['ZILLIQA_URL']);

const withRetries = ({ attempt, maxRetries }) => async (...args) => {
    const slotTime = 500;
    let retryCount = 0;
    do {
      try {
        //console.log('Attempting...', Date.now());
        return await attempt(...args);
      } catch (error) {
        const isLastAttempt = retryCount === maxRetries;
        if (isLastAttempt) {
          // Stack Overflow console doesn't show unhandled
          // promise rejections so lets log the error.
          console.error(error);
          return Promise.reject(error);
        }
      }
      const randomTime = Math.floor(Math.random() * slotTime);
      const delay = 2 ** retryCount * slotTime + randomTime;
      // Wait for the exponentially increasing delay period before retrying again.
      await new Promise(resolve => setTimeout(resolve, delay));
    } while (retryCount++ < maxRetries);
  }

/**
 * 
 * @param {*} txHash 
 * @returns 
 */
const getTransactionDetails = async(txHash) => {
    const response = await zilliqa.blockchain.getTransaction(txHash)
    if (response.error !== undefined) {
        throw new Error(response.error.message);
    }
    return response
}

const getTxBlock = async(block) => {
  const response = await zilliqa.blockchain.getTxBlock(block)
  if (response.error !== undefined) {
      throw new Error(response.error.message);
  }
  return response
}

/**
 * 
 * @returns Current blockchain height
 */
const getNumTxBlocks = async () => {
    const response = await zilliqa.blockchain.getNumTxBlocks()
    if (response.error !== undefined) {
        throw new Error(response.error.message);
    }
    return parseInt(response.result, 10);
}

/**
 * 
 * @param {*} blockNum block height
 * @returns block info
 */
 const getTransactionsForBlock = async (blockNum) => {
    console.log(`Loading transactions for block ${blockNum}`)
    const fakeAPI = () => zilliqa.blockchain.getTransactionsForTxBlock(
        parseInt(blockNum, 10)
    )
    const fakeAPIWithRetries = withRetries({ attempt: fakeAPI, maxRetries: 10 });
    const response = await fakeAPIWithRetries()

    if (response.error && response.error.message === 'TxBlock has no transactions') {
        return []
    }
    if (response.error !== undefined) {
        throw new Error(response.error.message);
    }
    return response.result.flat()
}

module.exports = {
    getTransactionDetails,
    getNumTxBlocks,
    getTransactionsForBlock,
    getTxBlock
}