const { etherscanApiKey, prefix } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: 'gas',
	description: 'Uses the Etherscan Gas Oracle to display the current slow, average, and fast gas prices in gwei.' +
    ' Will also tell you whether these numbers are relatively high or low, and how long (guesstimate) it would take' +
    ' to get a transaction through using the average gas price displayed.',
	execute(message) {
    fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${etherscanApiKey}`)
      .then(response => response.json())
      .then(async function (jsonResult) {
        const averageGasPrice = jsonResult.result.ProposeGasPrice
        message.channel.send(`Current Gas Fees:\nSlow: ${jsonResult.result.SafeGasPrice} gwei` +
          `\nAverage: ${averageGasPrice} gwei` +
          `\nFast: ${jsonResult.result.FastGasPrice} gwei`);

        let gasResponseMessage = ''

        if (averageGasPrice < 50) {
          gasResponseMessage = ' this would be a great time to send a transaction! Gas costs are low!'
        } else if (averageGasPrice < 100) {
          gasResponseMessage = ' this would be an OK time to send a transaction. Gas costs are OK.'
        } else if (averageGasPrice < 150) {
          gasResponseMessage = ' this isn\'t the best time to send a transaction. Gas costs are relatively expensive.'
        } else if (averageGasPrice < 225) {
          gasResponseMessage = '... well, don\'t. Gas costs are rediculously expensive.'
        } else {
          gasResponseMessage = ' NOOO NOOOO AAAAAAHHHHHHHHH. VITALIK I\'M NOT TRYING TO SPEND A MONTHS SALARY ON GAS'
        }

        message.channel.send(`Assuming you'd use average gas fees${gasResponseMessage}`)

        const wei = averageGasPrice * 1000000000

        const secondsWait = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${wei}&apikey=${etherscanApiKey}`)
          .then(response => response.json())
          .catch(error => message.channel.send('Couldn\'t get the wait time, sorry: ', error));

        message.channel.send(`And if you did use the average, it would take about ${secondsWait.result} seconds.`);
      })
      .catch(async function (error) {
        message.channel.send(`Argh, I can't get information on the current Ethereum Gas situation. Sorry :(`)
      })
	},
};
