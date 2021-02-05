const { prefix } = require('../config.json')
const fetchCoin = require('../fetch-coin')
const table = require('table');

function addCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

module.exports = {
	name: 'portfolio',
	description: 'Returns the price of a hand picked portfolio of coins' +
    '. Used in format `!portfolio.`',
	async execute(message) {
	  const portfolioCoins = [
      'bitcoin',
      'ethereum',
      'chainlink',
      'xdai-stake',
      'growth-defi',
      'statera',
      'dfohub',
      'meridian-network'
    ]

    const coinTable = [
      ['(Rank) Name', '24h Gain/Loss %', 'Price (USD)', 'Market Cap (USD)']
    ]

    // fetch coins from CoinGecko API
    for (const index in portfolioCoins) {
      const jsonResult = await fetchCoin(portfolioCoins[index])

      // error handling
      if (!jsonResult) {
        coinTable.push([`${portfolioCoins[index]}`, 'Error', 'Error', 'Error'])
      } else if (jsonResult.error) {
        coinTable.push([`${portfolioCoins[index]}`, 'Error', 'Error', 'Error'])
      } else {
        coinTable.push([
          `(${jsonResult.market_data.market_cap_rank}) ${portfolioCoins[index]}`,
          `${jsonResult.market_data.price_change_percentage_24h}%`,
          `$${addCommas(jsonResult.market_data.current_price.usd)}`,
          `$${addCommas(jsonResult.market_data.market_cap.usd)}`
          ]
        )
      }
    }

    const config = {
      columnDefault: {
        width: 20
      },
      border: table.getBorderCharacters('honeywell')
    }

    const outputTable = table.table(coinTable, config)

    return message.channel.send('Here\'s how the portfolio is doing!\n```'
      + outputTable + '```')
	},
}
