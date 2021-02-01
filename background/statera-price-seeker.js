const fetch = require('node-fetch');
var cron = require('node-cron');

async function loopStateraPrice(client) {
  // '805521288194031646' // statera-price-tracker Id
  // '805493129653911562' // bot-testing Id
  const channelId = '805521288194031646' // statera-price-tracker Id
  const stateraChannel = client.channels.cache.get(channelId)

  let primaryPrice = await fetch('https://api.coingecko.com/api/v3/coins/statera')
    .then(response => response.json())
    .then(response => response.market_data.current_price.usd)
    .catch(error => stateraChannel.send('I couldn\'t get Statera\'s price... ', error));

  // */30 means every 30 minutes, run the following code
  cron.schedule('*/30 * * * *', () => {
    console.log('Checking the statera price growth (once every 30 minutes...)');

    fetch('https://api.coingecko.com/api/v3/coins/statera')
      .then(response => response.json())
      .then(function (jsonResult) {
        let currentPrice = jsonResult.market_data.current_price.usd
        let percentIncrease = ((currentPrice - primaryPrice) / primaryPrice) * 100

        console.log(currentPrice, primaryPrice, percentIncrease)

        if (percentIncrease > 15) {
          stateraChannel.send(`OOOOO STATERA IS MOONING!! IT'S NOW $${currentPrice}!! (it was ${primaryPrice} 30 minutes ago` +
            ', and this bot will alert if Statera gains 15% or more within 30 minute timespans.)')
        }

        primaryPrice = currentPrice
      })
      .catch(error => stateraChannel.send('The statera bot has failed to do its 30 minute round...', error));
  });
}

module.exports = loopStateraPrice
