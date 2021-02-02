const { prefix } = require('../config.json');
const fetch = require('node-fetch');
const Discord = require('discord.js');

function addCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function createEmbed(fetchObj) {
  const description = fetchObj.description.en.substring(0, 1024)

  const embed = new Discord.MessageEmbed()
    .setColor('#EFFF00')
    .setTitle(fetchObj.id)
    .setURL(`https://www.coingecko.com/en/coins/${fetchObj.id}`)
    .setThumbnail(fetchObj.image.small)
    .setDescription(description)
    .addFields(
      { name: 'Coin Homepage', value: fetchObj.links.homepage[0]},
      { name: 'Price Info', value: `Price: ${addCommas(fetchObj.market_data.current_price.usd)} USD, Volume: ${addCommas(fetchObj.market_data.total_volume.usd)} USD`},
      { name: 'Price Changes', value: `Daily: ${fetchObj.market_data.price_change_percentage_24h}%\nWeekly: ${fetchObj.market_data.price_change_percentage_7d}%` +
        `\nBiweekly: ${fetchObj.market_data.price_change_percentage_14d}%\nMonthly: ${fetchObj.market_data.price_change_percentage_30d}%`},
      { name: 'Market Cap', value: `Ranking: ${fetchObj.market_data.market_cap_rank}\nCurrent Market Cap: ${addCommas(fetchObj.market_data.market_cap.usd)} USD\n` +
        `Circulating Supply: ${addCommas(fetchObj.market_data.circulating_supply)} / ${addCommas(fetchObj.market_data.total_supply)}`}
    )
    .setTimestamp()

  return embed
}

module.exports = {
	name: 'lookup',
	description: 'Lookup a certain coin [X]. Used in format `!lookup [coin-name]`, or `!lookup [ticker]`.\nExample: `!lookup statera` or `!lookup btc`.\n\nIf the incorrect coin is found using only the ticker, try using its full name instead. For example, `!lookup meridian-network` rather than `!lookup LOCK`',
	async execute(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    // remove command
    args.shift()

    if (args.length < 1) {
      return message.channel.send('You need to supply a coin to lookup! E.G. `!lookup statera`, or `!lookup BTC`');
    }

    const userToken = args.shift().toLowerCase();

    // try to find the coin with the input as the ID
    fetch(`https://api.coingecko.com/api/v3/coins/${userToken}`)
      .then(response => response.json())
      .then(function (jsonResult) {
        return message.channel.send(createEmbed(jsonResult));
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

            return message.channel.send(createEmbed(coin));
          }
        }
      return message.channel.send('I still couldn\'t find the coin :(');
    });
	},
};
