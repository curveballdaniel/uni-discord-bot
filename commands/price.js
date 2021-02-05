const { prefix } = require('../config.json')
const fetchCoin = require('../fetch-coin')

function addCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

module.exports = {
	name: 'price',
	description: 'Find the price of a certain coin [X]. Used in format ' +
    '`!price [coin-name]`, or `!price [ticker]`.\nExample: `!price statera`' +
    ' or `!price btc`.\n\nIf the incorrect coin is found using only the' +
    ' ticker, try using its full name instead. For example, ' +
    '`!price meridian-network` rather than `!price LOCK`',
	async execute(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    // remove command
    args.shift()

    if (args.length < 1) {
      return message.channel.send('You need to supply a coin to lookup!' +
        ' E.G. `!price statera`, or `!price BTC`')
    }

	  const userToken = args.shift().toLowerCase()
    // fetch coin from CoinGecko API
    const jsonResult = await fetchCoin(userToken)

    // error handling
    if (!jsonResult) {
      return message.channel.send(`I couldn\'t find the price of ${userToken} :(`)
    } else if (jsonResult.error) {
      return message.channel.send(`CoinGecko error: I couldn\'t find the price of ${userToken} :(`)
    }

    return message.channel.send(`The price of ${userToken} (${jsonResult.id}) is` +
      ` $${addCommas(jsonResult.market_data.current_price.usd)} USD!\n` +
      `Up ${jsonResult.market_data.price_change_percentage_24h}% Daily` +
      ` and ${jsonResult.market_data.price_change_percentage_7d}% Weekly.` +
      ` (Volume: $${addCommas(jsonResult.market_data.total_volume.usd)})`)
	},
}
