const { prefix } = require('../config.json');
const fetch = require('node-fetch');

function addCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
	name: 'price',
	description: 'Find the price of a certain coin [X]. Used in format `!price [coin-name]`, or `!price [ticker]`.\nExample: `!price statera` or `!price btc`.\n\nIf the incorrect coin is found using only the ticker, try using its full name instead. For example, `!price meridian-network` rather than `!price LOCK`',
	async execute(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    // remove command
    args.shift()

    if (args.length < 1) {
      return message.channel.send('You need to supply a coin to lookup! E.G. `!price statera`, or `!price BTC`');
    }

	  const userToken = args.shift().toLowerCase();

    // try to find the coin with the input as the ID
    fetch(`https://api.coingecko.com/api/v3/coins/${userToken}`)
      .then(response => response.json())
      .then(function (jsonResult) {
        return message.channel.send(`The price of ${userToken} (${jsonResult.id}) is $${addCommas(jsonResult.market_data.current_price.usd)} USD! (Volume: $${addCommas(jsonResult.market_data.total_volume.usd)})`);
      })
      .catch(async function (error) {
        message.channel.send(`Can't find that coin name, searching for $${userToken}`)

        // otherwise parse the coingecko for the coin's thought listing
        const coinList = await fetch('https://api.coingecko.com/api/v3/coins/list')
          .then(response => response.json())
          .catch(error => message.channel.send('Error listing all coins: ', error));

        // then search for the appropriate ID and get the coin that way
        for (let i in coinList) {
          if (coinList[i].symbol === userToken) {
            const coinId = coinList[i].id

            let coin = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
              .then(response => response.json())
              .catch(error => message.channel.send('Error listing all coins: ', error));

            return message.channel.send(`The price of ${userToken} (${coin.id}) is $${addCommas(coin.market_data.current_price.usd)} USD! (Volume: $${addCommas(coin.market_data.total_volume.usd)})`);
          }
        }
      return message.channel.send(`I couldn\'t find the price of ${userToken} :(`);
    });
	},
};
