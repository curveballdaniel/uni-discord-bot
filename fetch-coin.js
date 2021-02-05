const fetch = require('node-fetch')

async function fetchCoin(userCoin) {
  const result = await fetch(`https://api.coingecko.com/api/v3/coins/${userCoin}`)
    .then(response => response.json())
    .then(async function (response) {
      if (response.id) {
        return response
      } else {
        // otherwise parse the coingecko for the coin's thought listing
        const coinList = await fetch('https://api.coingecko.com/api/v3/coins/list')
          .then(response => response.json())
          .catch(error => console.error('Error listing all coins: ', error))

        if (!coinList) {
          return null
        }

        // then search for the appropriate ID and get the coin that way
        for (let i in coinList) {
          if (coinList[i].symbol === userCoin) {
            const coinId = coinList[i].id

            coin = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
              .then(response => response.json())
              .catch(error => console.error('Error finding the coin ticker: ', error))

            return coin
          }
        }
        return null
      }
    })
    .catch(error => {error})

  return result
}

module.exports = fetchCoin
