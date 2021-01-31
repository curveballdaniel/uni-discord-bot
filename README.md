# uni-discord-bot
A simple Discord Uniswap bot which alerts when certain thresholds are met

# Starting up the bot

Simply run `node index.js` or `npm run start` to start the bot! If the bot is not running, it will show as offline in the Discord server. Then, none of the commands will work.

# Current commands implemented:

## Lookup

Usage:
```
!lookup [coin-name OR ticker]
```

For example,

```
!lookup statera
or
!lookup btc
```

Lookup uses the CoinGecko API to search for the token and return a bunch of information about the coin. A sample run for `!lookup statera`

```
statera {icon image attached}
An Ethereum smart-contract token with a difference

Deflationary
Statera's core algorithm is designed to ensure that for every transaction, 1% of the amount transacted is destroyed.

Exchange
Smart-exchange routing, including, but not limited to, Kyber, 0x Relays, Uniswap, Balancer & 1inch.

Portfolio
Constant arbitrage trading opportunities keep Statera's portfolio weights and tokens in a constant ratio.

Statera rebalacing
Every trade for Statera creates an arbitrage opportunity. Trading attracts liquidity, which in-turn attracts trading. Liquidity ripples and the supply of Statera decreases.

'statera' is derived from the Latin word for 'balance'

Coin Homepage
https://stateratoken.com/
Price Info
Price: 0.148984 USD, Volume: 228,676 USD
Price Changes
Daily: 12.23817%
Weekly: 0.79462%
Biweekly: 46.47289%
Monthly: 113.87872%
Market Cap
Ranking: 510
Current Market Cap: 12,353,926 USD
Circulating Supply: 82,920,989.2502525 / 82,920,989.2502525

Today at 7:38 PM
```

# Required files

In order to correctly run the bot, a `TOKEN` env variable is required. This can be obtained from https://discord.com/developers/applications.
